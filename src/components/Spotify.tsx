import { useEffect, useState } from "react";

type Track = { title: string; artist: string; url: string; image?: string };
type Data = { now?: (Track & { playing: boolean }) | null; top?: Track[]; artists?: string[] };

/* Set VITE_SPOTIFY_API to the deployed worker URL (see worker/README.md). */
const API = import.meta.env.VITE_SPOTIFY_API as string | undefined;

export default function Spotify() {
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(!API);

  useEffect(() => {
    if (!API) return;
    const load = () =>
      fetch(API)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d) => { setData(d); setFailed(!d.now && !(d.top && d.top.length)); })
        .catch(() => setFailed(true));
    load();
    const id = window.setInterval(load, 30000);
    return () => window.clearInterval(id);
  }, []);

  if (failed || !data) {
    return (
      <article className="card p-6">
        <p className="eyebrow">Music</p>
        <h3 className="serif text-[1.25rem] mt-2">Spotify isn't connected yet</h3>
        <p className="mt-2 text-[0.94rem]" style={{ color: "var(--ink-2)" }}>
          This card will show what I'm listening to right now and what I play most.
        </p>
      </article>
    );
  }

  const { now, top = [], artists = [] } = data;
  return (
    <article className="card p-6">
      <p className="eyebrow">{now?.playing ? "Listening right now" : "Last played"}</p>
      {now && (
        <a className="now" href={now.url} target="_blank" rel="noreferrer">
          {now.image && <img src={now.image} alt="" />}
          <span>
            <strong>{now.title}</strong>
            <span className="meta">{now.artist}</span>
          </span>
        </a>
      )}
      {top.length > 0 && (
        <>
          <p className="eyebrow mt">On repeat lately</p>
          <ol className="tops">
            {top.slice(0, 5).map((t) => (
              <li key={t.url}>
                <a href={t.url} target="_blank" rel="noreferrer">{t.title}</a>
                <span className="meta"> · {t.artist}</span>
              </li>
            ))}
          </ol>
        </>
      )}
      {artists.length > 0 && <p className="muted mt">Most played: {artists.slice(0, 4).join(", ")}</p>}
    </article>
  );
}
