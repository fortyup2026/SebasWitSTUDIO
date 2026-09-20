const API = "https://connectors.windsor.ai";

const SNAPSHOT = {
  source: "snapshot",
  updatedAt: "2026-09-20T17:38:00.000Z",
  health: { youtube: false, tiktok: false, instagram: false, facebook: false, analytics: false },
  youtube: { account:"SebasWit", subscribers:2680, totalViews:126321, videos:77, periodViews:119, periodLikes:2, periodComments:1, periodShares:2, topVideo:"LA BRUJA 🔮 Lunes 21 de Septiembre", topVideoViews:85, topRetention:111.23 },
  tiktok: { accounts:[
    { name:"SebasWit", followers:1108, totalLikes:17580, videos:21, periodViews:63, periodLikes:5, comments:0, shares:0, profileViews:1 },
    { name:"SERIES NEXUS IA", followers:25, totalLikes:206, videos:10, periodViews:1, periodLikes:0, comments:0, shares:0, profileViews:0 }
  ]},
  instagram:{ accounts:[{ name:"nexus.series.ia", followers:3, media:2, reach:0, likes:0, comments:0, shares:0, engaged:0, linkTaps:0 }] },
  facebook:{ accounts:[{ name:"Un montón de historias.", fans:14353, impressions:0 }] },
  analytics:{ accounts:[{ name:"fortyup-9dfe7", sessions:0, users:0, views:0, engagementRate:0 },{ name:"servigoar", sessions:0, users:0, views:0, engagementRate:0 }] }
};

const num = v => Number.isFinite(Number(v)) ? Number(v) : 0;
const sum = (rows, field) => rows.reduce((a,r)=>a+num(r?.[field]),0);
const max = (rows, field) => rows.reduce((a,r)=>Math.max(a,num(r?.[field])),0);

function normalize(json) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.result)) return json.result;
  if (Array.isArray(json?.rows)) return json.rows;
  return [];
}

async function windsor(connector, fields, datePreset) {
  const key = process.env.WINDSOR_API_KEY;
  if (!key) throw new Error("WINDSOR_API_KEY missing");
  const params = new URLSearchParams({ api_key:key, fields:fields.join(","), _renderer:"json" });
  if (datePreset) params.set("date_preset", datePreset);
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(), 9000);
  try {
    const res = await fetch(`${API}/${connector}?${params.toString()}`, {
      signal:controller.signal,
      headers:{"User-Agent":"SebasWeb-Studios/2.0"}
    });
    if (!res.ok) throw new Error(`${connector}:${res.status}`);
    return normalize(await res.json());
  } finally { clearTimeout(timer); }
}

async function safe(name, fn) {
  try { return { name, ok:true, rows:await fn() }; }
  catch (error) { console.error(`[${name}]`, error?.message || error); return { name, ok:false, rows:[] }; }
}

function groupRows(rows, nameField="account_name") {
  const map = new Map();
  for (const row of rows) {
    const name = String(row?.[nameField] || "Cuenta");
    if (!map.has(name)) map.set(name, []);
    map.get(name).push(row);
  }
  return [...map.entries()].map(([name,items])=>({name,items}));
}

async function live() {
  const [ytChannel,ytVideo,tt,ig,fb,ga] = await Promise.all([
    safe("youtube",()=>windsor("youtube",["account_name","subscriber_count","view_count","video_count"])),
    safe("youtubeVideo",()=>windsor("youtube",["video","video_title","views","likes","comments","shares","average_view_percentage"],"last_30d")),
    safe("tiktok",()=>windsor("tiktok_organic",["account_name","total_followers_count","total_likes","videos_count","video_views","likes","comments","shares","profile_views"],"last_30d")),
    safe("instagram",()=>windsor("instagram",["account_name","followers_count","media_count","reach","likes","comments","shares","accounts_engaged","profile_links_taps"],"last_30d")),
    safe("facebook",()=>windsor("facebook_organic",["account_name","page_fans","post_impressions"],"last_30d")),
    safe("analytics",()=>windsor("googleanalytics4",["account_name","sessions","active_users","screen_page_views","engagement_rate"],"last_30d"))
  ]);

  const channel = ytChannel.rows.find(r=>r.account_name) || {};
  const videoRows = ytVideo.rows || [];
  const ranked = [...videoRows].sort((a,b)=>num(b.views)-num(a.views));
  const top = ranked[0] || {};
  const ret = videoRows.map(r=>num(r.average_view_percentage)).filter(v=>v>0);
  const youtube = ytChannel.ok || ytVideo.ok ? {
    account:String(channel.account_name || SNAPSHOT.youtube.account),
    subscribers:num(channel.subscriber_count) || SNAPSHOT.youtube.subscribers,
    totalViews:num(channel.view_count) || SNAPSHOT.youtube.totalViews,
    videos:num(channel.video_count) || SNAPSHOT.youtube.videos,
    periodViews:sum(videoRows,"views"), periodLikes:sum(videoRows,"likes"), periodComments:sum(videoRows,"comments"), periodShares:sum(videoRows,"shares"),
    topVideo:String(top.video_title || "Sin actividad reciente"), topVideoViews:num(top.views), topRetention:ret.length?Math.max(...ret):0
  } : SNAPSHOT.youtube;

  const tiktokAccounts = tt.ok ? groupRows(tt.rows).map(({name,items})=>({
    name, followers:max(items,"total_followers_count"), totalLikes:max(items,"total_likes"), videos:max(items,"videos_count"),
    periodViews:sum(items,"video_views"), periodLikes:sum(items,"likes"), comments:sum(items,"comments"), shares:sum(items,"shares"), profileViews:sum(items,"profile_views")
  })) : SNAPSHOT.tiktok.accounts;

  const instagramAccounts = ig.ok ? groupRows(ig.rows).map(({name,items})=>({
    name, followers:max(items,"followers_count"), media:max(items,"media_count"), reach:sum(items,"reach"), likes:sum(items,"likes"), comments:sum(items,"comments"), shares:sum(items,"shares"), engaged:sum(items,"accounts_engaged"), linkTaps:sum(items,"profile_links_taps")
  })) : SNAPSHOT.instagram.accounts;

  const facebookAccounts = fb.ok ? groupRows(fb.rows).map(({name,items})=>({ name, fans:max(items,"page_fans"), impressions:sum(items,"post_impressions") })) : SNAPSHOT.facebook.accounts;
  const analyticsAccounts = ga.ok && ga.rows.length ? groupRows(ga.rows).map(({name,items})=>({ name, sessions:sum(items,"sessions"), users:sum(items,"active_users"), views:sum(items,"screen_page_views"), engagementRate:max(items,"engagement_rate") })) : SNAPSHOT.analytics.accounts;

  const health = { youtube:ytChannel.ok || ytVideo.ok, tiktok:tt.ok, instagram:ig.ok, facebook:fb.ok, analytics:ga.ok };
  const okCount = Object.values(health).filter(Boolean).length;
  return {
    source: okCount === 5 ? "live" : okCount > 0 ? "partial" : "snapshot",
    updatedAt:new Date().toISOString(), health,
    youtube,
    tiktok:{accounts:tiktokAccounts.length?tiktokAccounts:SNAPSHOT.tiktok.accounts},
    instagram:{accounts:instagramAccounts.length?instagramAccounts:SNAPSHOT.instagram.accounts},
    facebook:{accounts:facebookAccounts.length?facebookAccounts:SNAPSHOT.facebook.accounts},
    analytics:{accounts:analyticsAccounts}
  };
}

module.exports = async function handler(req,res) {
  res.setHeader("Content-Type","application/json; charset=utf-8");
  res.setHeader("Cache-Control","s-maxage=120, stale-while-revalidate=300");
  try {
    if (!process.env.WINDSOR_API_KEY) {
      res.setHeader("Cache-Control","no-store");
      return res.status(200).json({...SNAPSHOT,updatedAt:new Date().toISOString()});
    }
    return res.status(200).json(await live());
  } catch (error) {
    console.error("Studio fallback",error?.message || error);
    res.setHeader("Cache-Control","no-store");
    return res.status(200).json({...SNAPSHOT,updatedAt:new Date().toISOString()});
  }
};
