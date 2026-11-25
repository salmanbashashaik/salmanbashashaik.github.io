// Cloudflare Worker with two jobs:
//   1. GET  /           a small public JSON feed of your Spotify listening
//   2. POST /hit        privacy-friendly visit counting (country/city, no cookies, no IPs stored)
//      GET  /dashboard  private stats page, unlocked with STATS_KEY
// Secrets (wrangler secret put): SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN, STATS_KEY
import { DASHBOARD_HTML } from "./dashboard.js";

const ORIGIN = "https://salmanbashashaik.github.io";

const cors = (origin) => ({
  "Access-Control-Allow-Origin": ["http://localhost:5173", "http://localhost:4173"].includes(origin) ? origin : ORIGIN,
  "Cache-Control": "public, max-age=30",
  "Content-Type": "application/json",
});

/* Spotify rate-limits hard, so answers are cached in D1: the access token for ~50 minutes,
   what's playing for 15 seconds, and top tracks/artists/recent plays for 30 minutes.
   If Spotify errors (e.g. 429), the last good answer is served instead. */
async function cached(env, key, ttlMs, fn) {
  const row = await env.DB.prepare("SELECT v, ts FROM cache WHERE k = ?").bind(key).first();
  if (row && Date.now() - row.ts < ttlMs) return JSON.parse(row.v);
  let fresh = null;
  try { fresh = await fn(); } catch { /* fall through to stale */ }
  if (fresh) {
    await env.DB.prepare("INSERT OR REPLACE INTO cache (k, v, ts) VALUES (?, ?, ?)").bind(key, JSON.stringify(fresh), Date.now()).run();
    return fresh;
  }
  return row ? JSON.parse(row.v) : null;
}

async function token(env) {
  const t = await cached(env, "token", 50 * 60 * 1000, async () => {
    const r = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: env.SPOTIFY_REFRESH_TOKEN }),
    });
    const j = await r.json();
    return j.access_token ? { t: j.access_token } : null;
  });
  return t && t.t;
}

const shape = (t) => ({
  title: t.name,
  artist: t.artists.map((a) => a.name).join(", "),
  url: t.external_urls.spotify,
  image: t.album?.images?.[1]?.url,
  duration: t.duration_ms,
});

async function spotify(req, env) {
  const headers = cors(req.headers.get("Origin"));
  const t = await token(env);
  if (!t) return new Response(JSON.stringify({ error: "spotify auth failed" }), { status: 503, headers });
  // If Spotify has rate-limited us, stay silent until its Retry-After passes; hammering it extends the ban.
  const blockRow = await env.DB.prepare("SELECT v FROM cache WHERE k = 'block'").first();
  const blocked = blockRow && Date.now() < Number(blockRow.v);
  const get = async (p) => {
    if (blocked) return new Response(null, { status: 429 });
    const r = await fetch("https://api.spotify.com/v1" + p, { headers: { Authorization: `Bearer ${t}` } });
    if (r.status === 429) {
      const wait = Number(r.headers.get("retry-after")) || 60;
      await env.DB.prepare("INSERT OR REPLACE INTO cache (k, v, ts) VALUES ('block', ?, ?)").bind(String(Date.now() + wait * 1000), Date.now()).run();
    }
    return r;
  };
  const items = async (path) => {
    const r = await get(path);
    if (!r.ok) throw new Error(String(r.status));
    return (await r.json()).items || [];
  };
  const firstNonEmpty = async (kind, limit) => {
    for (const range of ["short_term", "medium_term", "long_term"]) {
      const got = await items(`/me/top/${kind}?limit=${limit}&time_range=${range}`);
      if (got.length) return got;
    }
    return [];
  };

  const [nowC, slow] = await Promise.all([
    cached(env, "now", 15 * 1000, async () => {
      const r = await get("/me/player/currently-playing");
      if (r.status === 204) return { item: null };
      if (r.status !== 200) return null;
      const j = await r.json();
      return j.item ? { item: { ...shape(j.item), playing: !!j.is_playing, progress: j.progress_ms }, at: Date.now() } : { item: null };
    }),
    cached(env, "slow", 30 * 60 * 1000, async () => {
      const [recent, topTracks, topArtists] = [await items("/me/player/recently-played?limit=30"), await firstNonEmpty("tracks", 5), await firstNonEmpty("artists", 4)];
      let top = topTracks.map(shape);
      if (!top.length) {
        const seen = new Set();
        top = recent.map((i) => i.track).filter((x) => !seen.has(x.id) && seen.add(x.id)).slice(0, 5).map(shape);
      }
      let artists = topArtists.map((a) => a.name);
      if (!artists.length) artists = [...new Set(recent.flatMap((i) => i.track.artists.map((a) => a.name)))].slice(0, 4);
      return { last: recent[0] ? shape(recent[0].track) : null, top, artists };
    }),
  ]);

  let now = null;
  if (nowC && nowC.item && Date.now() - nowC.at < 120000) {
    // the cached answer is up to 15s old, so move the progress bar forward by that much
    const aged = nowC.item.playing ? (nowC.item.progress || 0) + (Date.now() - nowC.at) : nowC.item.progress;
    now = { ...nowC.item, progress: aged };
  } else if (slow && slow.last) {
    now = { ...slow.last, playing: false };
  }
  return new Response(JSON.stringify({ now, top: slow?.top || [], artists: slow?.artists || [] }), { headers });
}

/* ── Visit counting ─────────────────────────────────────────── */

const ALLOWED = [ORIGIN, "http://localhost:5173", "http://localhost:4173"];
const BOT = /bot|crawl|spider|slurp|preview|monitor|headless|lighthouse|curl|wget/i;
const toronto = (d = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto" }).format(d); // YYYY-MM-DD

async function sha(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].slice(0, 8).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hit(req, env) {
  const origin = req.headers.get("Origin") || "";
  const ua = req.headers.get("User-Agent") || "";
  const h = { "Access-Control-Allow-Origin": ALLOWED.includes(origin) ? origin : ORIGIN };
  if (!ALLOWED.includes(origin) || BOT.test(ua) || !env.STATS_KEY) return new Response(null, { status: 204, headers: h });

  let body = {};
  try { body = JSON.parse(await req.text()); } catch { /* ignore */ }
  const day = toronto();
  const ip = req.headers.get("CF-Connecting-IP") || "";
  const vid = await sha(`${ip}|${ua}|${day}|${env.STATS_KEY}`); // rotates daily; the IP is never stored
  let ref = "";
  try { ref = body.ref ? new URL(body.ref).hostname.replace(/^www\./, "") : ""; } catch { /* ignore */ }
  if (ref === "salmanbashashaik.github.io" || ref === "localhost") ref = "";
  const cf = req.cf || {};
  await env.DB.prepare(
    "INSERT INTO hits (ts, day, vid, country, region, city, path, ref) VALUES (?,?,?,?,?,?,?,?)",
  ).bind(Date.now(), day, vid, cf.country || "??", cf.region || "", cf.city || "", String(body.path || "/").slice(0, 80), ref.slice(0, 80)).run();
  return new Response(null, { status: 204, headers: h });
}

async function stats(req, env) {
  const auth = (req.headers.get("Authorization") || "").replace(/^Bearer /, "");
  if (!env.STATS_KEY || auth !== env.STATS_KEY) return new Response("Unauthorized", { status: 401 });
  const day = toronto();
  const since = (n) => toronto(new Date(Date.now() - n * 86400000));
  const q = (sql, ...a) => env.DB.prepare(sql).bind(...a);
  const [today, week, month, all, countries, cities, refs, daily, recent] = await env.DB.batch([
    q("SELECT COUNT(*) v, COUNT(DISTINCT vid) u FROM hits WHERE day = ?", day),
    q("SELECT COUNT(*) v, COUNT(DISTINCT vid) u FROM hits WHERE day >= ?", since(6)),
    q("SELECT COUNT(*) v, COUNT(DISTINCT vid) u FROM hits WHERE day >= ?", since(29)),
    q("SELECT COUNT(*) v, COUNT(DISTINCT vid) u FROM hits"),
    q("SELECT country k, COUNT(*) v, COUNT(DISTINCT vid) u FROM hits WHERE day >= ? GROUP BY country ORDER BY u DESC, v DESC LIMIT 15", since(29)),
    q("SELECT city k, country c, COUNT(DISTINCT vid) u FROM hits WHERE day >= ? AND city != '' GROUP BY city, country ORDER BY u DESC LIMIT 10", since(29)),
    q("SELECT CASE WHEN ref = '' THEN 'direct' ELSE ref END k, COUNT(DISTINCT vid) u FROM hits WHERE day >= ? GROUP BY k ORDER BY u DESC LIMIT 10", since(29)),
    q("SELECT day k, COUNT(*) v, COUNT(DISTINCT vid) u FROM hits WHERE day >= ? GROUP BY day ORDER BY day", since(29)),
    q("SELECT ts, country, city, path, ref FROM hits ORDER BY id DESC LIMIT 12"),
  ]);
  const one = (r) => r.results[0] || { v: 0, u: 0 };
  return new Response(
    JSON.stringify({
      today: one(today), week: one(week), month: one(month), all: one(all),
      countries: countries.results, cities: cities.results, refs: refs.results,
      daily: daily.results, recent: recent.results,
    }),
    { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } },
  );
}

export default {
  async fetch(req, env) {
    const { pathname } = new URL(req.url);
    if (req.method === "OPTIONS") {
      const o = req.headers.get("Origin") || "";
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED.includes(o) ? o : ORIGIN,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
    if (pathname === "/hit" && req.method === "POST") return hit(req, env);
    if (pathname === "/stats") return stats(req, env);
    if (pathname === "/dashboard") {
      return new Response(DASHBOARD_HTML, {
        headers: { "Content-Type": "text/html;charset=utf-8", "X-Robots-Tag": "noindex", "Cache-Control": "no-store" },
      });
    }
    return spotify(req, env);
  },
};
