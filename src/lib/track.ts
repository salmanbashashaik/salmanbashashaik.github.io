/* Privacy-friendly visit counter. One request per page load, no cookies.
   To exclude your own visits, open the site once per browser or device with ?notrack
   at the end of the address. Use ?track to start counting that browser again.       */
/** A small note so you can see the link worked. */
function toast(text: string) {
  const el = document.createElement("div");
  el.textContent = text;
  el.setAttribute("role", "status");
  el.style.cssText =
    "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;padding:10px 18px;" +
    "border-radius:999px;background:#1d1b18;color:#f5f1e8;font:14px system-ui,sans-serif;" +
    "box-shadow:0 6px 24px rgba(0,0,0,.25);transition:opacity .6s";
  document.body.appendChild(el);
  window.setTimeout(() => (el.style.opacity = "0"), 4000);
  window.setTimeout(() => el.remove(), 4800);
}

export function trackVisit() {
  const q = new URLSearchParams(location.search);
  try {
    if (q.has("notrack")) {
      localStorage.setItem("no-track", "1");
      toast("Done. Visits from this browser are no longer counted.");
    }
    if (q.has("track")) {
      localStorage.removeItem("no-track");
      toast("This browser is counted again.");
    }
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
