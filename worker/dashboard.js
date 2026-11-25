export const DASHBOARD_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Visitors</title>
<style>
:root{--bg:#f5f1e8;--card:#fbf8f1;--ink:#1d1b18;--muted:#6d675d;--line:#e2dccd;--clay:#b85a3a;--sage:#dfe3d2}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,sans-serif;padding:32px 20px}
.wrap{max-width:980px;margin:0 auto}h1{font:400 2rem Georgia,serif;margin:0 0 4px}.muted{color:var(--muted);font-size:.85rem}
.grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin:22px 0}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px}
.big{font:400 2.2rem Georgia,serif;color:var(--clay);line-height:1}.lab{font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-top:6px}
h2{font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--clay);margin:0 0 12px;font-weight:600}
.row{display:flex;align-items:center;gap:10px;margin:7px 0;font-size:.9rem}.row .name{flex:0 0 150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bar{flex:1;height:8px;background:var(--sage);border-radius:99px;overflow:hidden}.bar i{display:block;height:100%;background:var(--clay)}
.n{flex:0 0 36px;text-align:right;color:var(--muted)}
.cols{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
.days{display:flex;align-items:flex-end;gap:3px;height:90px}.days i{flex:1;background:var(--clay);border-radius:3px 3px 0 0;min-height:2px;opacity:.85}
form{max-width:340px;margin:20vh auto;text-align:center}input{width:100%;padding:11px 14px;border:1px solid var(--line);border-radius:999px;background:var(--card);font-size:1rem;margin:14px 0}
button{padding:10px 22px;border-radius:999px;border:0;background:var(--ink);color:var(--bg);font-size:.95rem;cursor:pointer}
.dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#4a9a5a;margin-right:6px}
</style></head><body><div class="wrap" id="app">
<form id="login"><h1>Visitors</h1><p class="muted">Enter your stats key.</p><input id="key" type="password" autocomplete="current-password" placeholder="Stats key" autofocus><br><button>Open</button><p id="err" class="muted"></p></form>
</div>
<script>
const $=(s)=>document.querySelector(s);let key=sessionStorage.getItem("sk")||"";
const names=new Intl.DisplayNames(["en"],{type:"region"});
const flag=(c)=>/^[A-Z]{2}$/.test(c)?String.fromCodePoint(...[...c].map(x=>127397+x.charCodeAt())):"🌐";
const cname=(c)=>{try{return c==="??"?"Unknown":names.of(c)}catch{return c}};
const esc=(s)=>String(s).replace(/[&<>"]/g,(m)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
function bars(rows,label){const max=Math.max(1,...rows.map(r=>r.u));return rows.length?rows.map(r=>'<div class="row"><span class="name">'+label(r)+'</span><span class="bar"><i style="width:'+(r.u/max*100)+'%"></i></span><span class="n">'+r.u+'</span></div>').join(""):'<p class="muted">No data yet.</p>'}
async function load(){
  const r=await fetch("/stats",{headers:{Authorization:"Bearer "+key}});
  if(r.status===401){sessionStorage.removeItem("sk");location.reload();return}
  const d=await r.json();const max=Math.max(1,...d.daily.map(x=>x.v));
  const card=(t,o)=>'<div class="card"><div class="big">'+o.u+'</div><div class="lab">'+t+' · '+o.v+' views</div></div>';
  $("#app").innerHTML='<h1>Visitors</h1><p class="muted"><span class="dot"></span>Live · refreshes every 15s · unique visitors are counted per day, no cookies, no IPs stored</p>'+
  '<div class="grid">'+card("Today",d.today)+card("Last 7 days",d.week)+card("Last 30 days",d.month)+card("All time",d.all)+'</div>'+
  '<div class="card"><h2>Last 30 days</h2><div class="days">'+d.daily.map(x=>'<i title="'+x.k+': '+x.u+' visitors, '+x.v+' views" style="height:'+(x.v/max*100)+'%"></i>').join("")+'</div></div>'+
  '<div class="cols" style="margin-top:14px"><div class="card"><h2>Countries</h2>'+bars(d.countries,r=>flag(r.k)+" "+esc(cname(r.k)))+'</div>'+
  '<div class="card"><h2>Cities</h2>'+bars(d.cities,r=>esc(r.k)+", "+esc(r.c))+'</div>'+
  '<div class="card"><h2>Where they came from</h2>'+bars(d.refs,r=>esc(r.k))+'</div>'+
  '<div class="card"><h2>Latest visits</h2>'+d.recent.map(x=>'<div class="row"><span class="name">'+flag(x.country)+" "+esc(x.city||cname(x.country))+'</span><span class="muted" style="flex:1">'+esc(x.path)+(x.ref?" ← "+esc(x.ref):"")+'</span><span class="n" style="flex-basis:70px">'+new Date(x.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})+'</span></div>').join("")+'</div></div>';
}
$("#login").addEventListener("submit",async(e)=>{e.preventDefault();key=$("#key").value.trim();const r=await fetch("/stats",{headers:{Authorization:"Bearer "+key}});if(r.status===401){$("#err").textContent="That key didn't work.";return}sessionStorage.setItem("sk",key);load();setInterval(load,15000)});
if(key){load().then(()=>setInterval(load,15000))}
</script></body></html>`;
