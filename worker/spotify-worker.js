// Cloudflare Worker: turns your Spotify listening into a small public JSON feed.
// Secrets (set with `wrangler secret put`): SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
const ORIGIN = "https://salmanbashashaik.github.io";

const cors = (origin) => ({
  "Access-Control-Allow-Origin": ["http://localhost:5173", "http://localhost:4173"].includes(origin) ? origin : ORIGIN,
  "Cache-Control": "public, max-age=30",
  "Content-Type": "application/json",
});

async function token(env) {
  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: env.SPOTIFY_REFRESH_TOKEN }),
  });
  return (await r.json()).access_token;
}

const shape = (t) => ({
  title: t.name,
  artist: t.artists.map((a) => a.name).join(", "),
  url: t.external_urls.spotify,
  image: t.album?.images?.[1]?.url,
});

export default {
  async fetch(req, env) {
    const headers = cors(req.headers.get("Origin"));
    const t = await token(env);
    if (!t) return new Response(JSON.stringify({ error: "spotify auth failed" }), { status: 503, headers });
    const get = (p) => fetch("https://api.spotify.com/v1" + p, { headers: { Authorization: `Bearer ${t}` } });

    const items = async (path) => {
      const r = await get(path);
      return r.ok ? (await r.json()).items || [] : [];
    };
    const firstNonEmpty = async (kind, limit) => {
      for (const range of ["short_term", "medium_term", "long_term"]) {
        const got = await items(`/me/top/${kind}?limit=${limit}&time_range=${range}`);
        if (got.length) return got;
      }
      return [];
    };

    const [nowR, recent, topTracks, topArtists] = await Promise.all([
      get("/me/player/currently-playing"),
      items("/me/player/recently-played?limit=30"),
      firstNonEmpty("tracks", 5),
      firstNonEmpty("artists", 4),
    ]);

    let now = null;
    if (nowR.status === 200) {
      const j = await nowR.json();
      if (j.item) now = { ...shape(j.item), playing: !!j.is_playing };
    }
    if (!now && recent[0]) now = { ...shape(recent[0].track), playing: false };

    // No top-track history yet? Fall back to distinct recent plays.
    let top = topTracks.map(shape);
    if (!top.length) {
      const seen = new Set();
      top = recent.map((i) => i.track).filter((t) => !seen.has(t.id) && seen.add(t.id)).slice(0, 5).map(shape);
    }
    let artists = topArtists.map((a) => a.name);
    if (!artists.length) artists = [...new Set(recent.flatMap((i) => i.track.artists.map((a) => a.name)))].slice(0, 4);

    return new Response(JSON.stringify({ now, top, artists }), { headers });
  },
};
