import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

type Track = { title: string; artist: string; url: string; image?: string; duration?: number };
type Now = Track & { playing: boolean; progress?: number };
type Data = { now?: Now | null; top?: Track[]; artists?: string[] };

/* Set VITE_SPOTIFY_API to the deployed worker URL (see worker/README.md). */
const API = import.meta.env.VITE_SPOTIFY_API as string | undefined;

const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export default function Spotify() {
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(!API);
  const [elapsed, setElapsed] = useState(0);
  const fetchedAt = useRef(Date.now());

  useEffect(() => {
    if (!API) return;
    const load = () =>
      fetch(API)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d: Data) => {
          fetchedAt.current = Date.now();
          setData(d);
          setFailed(!d.now && !(d.top && d.top.length));
        })
        .catch(() => setFailed(true));
    load();
    const id = window.setInterval(load, 30000);
    return () => window.clearInterval(id);
  }, []);

  // Tick the progress bar between fetches while a track is actually playing.
  const now = data?.now;
  useEffect(() => {
    if (!now?.playing) return;
    const tick = () => setElapsed(Date.now() - fetchedAt.current);
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [now]);

  if (failed || !data) {
    return (
      <article className="card p-6 sm:col-span-2">
        <p className="eyebrow">Music</p>
        <h3 className="serif text-[1.25rem] mt-2">Spotify isn't connected yet</h3>
        <p className="mt-2 text-[0.94rem]" style={{ color: "var(--ink-2)" }}>
          This card will show what I'm listening to right now and what I play most.
        </p>
      </article>
    );
  }

  const { top = [], artists = [] } = data;
  const duration = now?.duration ?? 0;
  const progress = now?.playing ? Math.min(duration, (now.progress ?? 0) + elapsed) : 0;
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <article className="sm:col-span-2 grid md:grid-cols-[minmax(0,330px)_1fr] gap-5 items-stretch">
      {/* The player */}
      {now && (
        <div
          className="rounded-[22px] p-5 flex flex-col w-full max-w-[340px] md:max-w-none"
          style={{ background: "#1d1b18", color: "#f5f1e8", boxShadow: "var(--shadow)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "#b85a3a" }}>
              {now.playing ? "Listening right now" : "Last played"}
            </p>
            {now.playing && (
              <span className="eq" aria-hidden>
                <i /><i /><i /><i />
              </span>
            )}
          </div>

          <a href={now.url} target="_blank" rel="noreferrer" className="block">
            {now.image && (
              <img
                src={now.image}
                alt={`Cover art for ${now.title}`}
                className="w-full aspect-square rounded-[14px] object-cover"
              />
            )}
          </a>

          <div className="mt-4 min-w-0">
            <p className="serif text-[1.5rem] leading-tight truncate">{now.title}</p>
            <p className="text-[0.88rem] opacity-70 truncate">{now.artist}</p>
          </div>

          <div className="mt-4">
            <div className="h-[4px] rounded-full overflow-hidden" style={{ background: "rgba(245,241,232,0.18)" }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#d9855f", transition: "width .5s linear" }} />
            </div>
            <div className="mono flex justify-between text-[10px] mt-1.5 opacity-60">
              <span>{now.playing ? mmss(progress) : "0:00"}</span>
              <span>{duration ? mmss(duration) : ""}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-6">
            <SkipBack size={18} className="opacity-60" aria-hidden />
            <a
              href={now.url}
              target="_blank"
              rel="noreferrer"
              aria-label="Open in Spotify"
              className="grid place-items-center h-11 w-11 rounded-full"
              style={{ background: "#f5f1e8", color: "#1d1b18" }}
            >
              {now.playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </a>
            <SkipForward size={18} className="opacity-60" aria-hidden />
          </div>
        </div>
      )}

      {/* The playlist */}
      <div className="card p-6">
        <p className="eyebrow">On repeat lately</p>
        <ol className="mt-4 space-y-3">
          {top.slice(0, 5).map((t, i) => (
            <li key={t.url}>
              <a href={t.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                <span className="mono text-[11px] w-4 text-right" style={{ color: "var(--ink-3)" }}>{i + 1}</span>
                {t.image && <img src={t.image} alt="" className="h-11 w-11 rounded-[8px] object-cover" />}
                <span className="min-w-0">
                  <span className="block truncate group-hover:text-[var(--red)] transition-colors">{t.title}</span>
                  <span className="meta block truncate">{t.artist}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
        {artists.length > 0 && (
          <p className="meta mt-5 pt-4" style={{ borderTop: "1px solid var(--rule-soft)" }}>
            Most played: {artists.slice(0, 4).join(", ")}
          </p>
        )}
      </div>
    </article>
  );
}
