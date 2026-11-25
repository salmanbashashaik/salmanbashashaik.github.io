/* Privacy-friendly visit counter. One request per page load, no cookies.
   To exclude your own visits, open the site once per browser or device with ?notrack
   at the end of the address. Use ?track to start counting that browser again.       */
export function trackVisit() {
  const q = new URLSearchParams(location.search);
  try {
    if (q.has("notrack")) localStorage.setItem("no-track", "1");
    if (q.has("track")) localStorage.removeItem("no-track");
  } catch {
    /* storage blocked: nothing to remember */
  }
  const api = import.meta.env.VITE_SPOTIFY_API as string | undefined;
  if (!import.meta.env.PROD || !api || localStorage.getItem("no-track")) return;
  try {
    const body = JSON.stringify({ path: location.pathname, ref: document.referrer });
    navigator.sendBeacon(`${api}/hit`, new Blob([body], { type: "text/plain" }));
  } catch {
    /* never let analytics break the page */
  }
}
