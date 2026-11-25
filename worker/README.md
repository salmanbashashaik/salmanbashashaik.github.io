# Connecting Spotify

GitHub Pages is static, so Spotify's secret can't live in the site. A tiny
Cloudflare Worker holds it and exposes only a public feed of what you play.

1. Create an app at https://developer.spotify.com/dashboard.
   Redirect URI: `http://127.0.0.1:8888/callback`. Note the Client ID and Secret.
2. Get a refresh token with scopes `user-read-currently-playing user-read-recently-played user-top-read`
   (authorize once at `https://accounts.spotify.com/authorize?...`, then exchange the code at `/api/token`).
3. Deploy `spotify-worker.js` as a Cloudflare Worker and add the secrets
   `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`.
4. Create `.env.production` in the repo root: `VITE_SPOTIFY_API=https://<your-worker>.workers.dev`
5. Rebuild the site. The card on the page lights up.

## Visitor stats

The same Worker counts visits (D1 database `salman-stats`): country, city and referrer, with no
cookies and no IP addresses stored. Unique visitors are a daily hash, so they are counted per day.

- Dashboard: `https://salman-spotify.royal-snow-f0a6.workers.dev/dashboard` (asks for your stats key)
- Your key is in `worker/.stats-key` (git-ignored) and stored as the `STATS_KEY` secret.
- Skip your own visits: open `https://salmanbashashaik.github.io/?notrack` once in each browser or device.
- Spotify answers are cached in D1 and the Worker backs off when Spotify returns 429.
