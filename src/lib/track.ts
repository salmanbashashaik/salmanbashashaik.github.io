/* Privacy-friendly visit counter. One request per page load, no cookies.
   To exclude your own visits, run this once in the browser console on the site:
     localStorage.setItem("no-track", "1")                                          */
export function trackVisit() {
  const api = import.meta.env.VITE_SPOTIFY_API as string | undefined;
  if (!import.meta.env.PROD || !api || localStorage.getItem("no-track")) return;
  try {
    const body = JSON.stringify({ path: location.pathname, ref: document.referrer });
    navigator.sendBeacon(`${api}/hit`, new Blob([body], { type: "text/plain" }));
  } catch {
    /* never let analytics break the page */
  }
}
