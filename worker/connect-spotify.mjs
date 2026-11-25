// Run locally: node connect-spotify.mjs
// Prompts for your Client Secret (hidden), opens Spotify's approval page, catches the
// redirect on 127.0.0.1:8888, then stores the secrets in Cloudflare. Nothing is printed or saved to disk.
import http from "node:http";
import { spawn, execFileSync } from "node:child_process";
import readline from "node:readline";

const CLIENT_ID = "97e5e10fe638482dba4ba7166f5f143f";
const REDIRECT = "http://127.0.0.1:8888/callback";
const SCOPE = "user-read-currently-playing user-read-recently-played user-top-read";

function askHidden(q) {
  return new Promise((res) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(q)) process.stdout.write(s); };
    rl.question(q, (a) => { rl.close(); process.stdout.write("\n"); res(a.trim()); });
  });
}

const secret = await askHidden("Paste your Spotify Client Secret (hidden): ");
if (!secret) process.exit(1);

const authUrl = "https://accounts.spotify.com/authorize?" + new URLSearchParams({
  client_id: CLIENT_ID, response_type: "code", redirect_uri: REDIRECT, scope: SCOPE,
});

const code = await new Promise((resolve, reject) => {
  const srv = http.createServer((req, res) => {
    const u = new URL(req.url, "http://127.0.0.1:8888");
    if (u.pathname !== "/callback") { res.end(); return; }
    res.end("Connected. You can close this tab.");
    srv.close();
    u.searchParams.get("code") ? resolve(u.searchParams.get("code")) : reject(new Error("Authorization denied"));
  }).listen(8888, "127.0.0.1", () => {
    console.log("Opening Spotify...");
    spawn("open", [authUrl], { stdio: "ignore" });
  });
});

const r = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${secret}`).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT }),
});
const j = await r.json();
if (!j.refresh_token) { console.error("Token exchange failed:", j.error_description || j.error); process.exit(1); }

for (const [name, value] of [["SPOTIFY_CLIENT_SECRET", secret], ["SPOTIFY_REFRESH_TOKEN", j.refresh_token]]) {
  execFileSync("npx", ["-y", "wrangler", "secret", "put", name], { input: value, stdio: ["pipe", "inherit", "inherit"] });
}
console.log("Done. Secrets stored in Cloudflare.");
