const WINDSOR = "https://connectors.windsor.ai";
const num = v => Number.isFinite(Number(v)) ? Number(v) : 0;
const sum = (rows,key) => rows.reduce((a,r)=>a+num(r[key]),0);

async function windsor(connector, fields, preset){
  const key=process.env.WINDSOR_API_KEY;
  if(!key) throw new Error("WINDSOR_API_KEY missing");
  const qs=new URLSearchParams({api_key:key,fields:fields.join(","),_renderer:"json"});
  if(preset) qs.set("date_preset",preset);
  const res=await fetch(`${WINDSOR}/${connector}?${qs}`,{headers:{"User-Agent":"SebasWeb-Studios-Final/1.0"}});
  if(!res.ok) throw new Error(`${connector}:${res.status}`);
  const j=await res.json();
  return Array.isArray(j)?j:Array.isArray(j?.result)?j.result:Array.isArray(j?.data)?j.data:[];
}

async function spotify(){
  const id=process.env.SPOTIFY_CLIENT_ID, secret=process.env.SPOTIFY_CLIENT_SECRET, artistId=process.env.SPOTIFY_ARTIST_ID;
  if(!id||!secret||!artistId) return {connected:false,artist:"SebasWit",followers:null,popularity:null,releases:null};
  const tokenRes=await fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{Authorization:`Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials"});
  if(!tokenRes.ok) throw new Error(`spotify-token:${tokenRes.status}`);
  const {access_token}=await tokenRes.json();
  const headers={Authorization:`Bearer ${access_token}`};
  const [artistRes,albumsRes]=await Promise.all([
    fetch(`https://api.spotify.com/v1/artists/${artistId}`,{headers}),
    fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=50`,{headers})
  ]);
  if(!artistRes.ok) throw new Error(`spotify-artist:${artistRes.status}`);
  const artist=await artistRes.json(); const albums=albumsRes.ok?await albumsRes.json():{items:[]};
  return {connected:true,artist:artist.name,followers:num(artist.followers?.total),popularity:num(artist.popularity),releases:(albums.items||[]).length};
}

function safePayload(){
  return {
    source:"safe",updatedAt:new Date().toISOString(),
    sectors:{
      youtube:{title:"YouTube Lab",agent:"Chevy",metrics:{subscribers:2680,totalViews:126321,videos:77,periodViews:119,periodLikes:3,periodComments:1,periodShares:2,topVideo:"LA BRUJA 🔮 Lunes 21 de Septiembre",topVideoViews:85,topRetention:111.2}},
      tiktokMain:{title:"TikTok SebasWit",agent:"Nora",metrics:{followers:1108,totalLikes:17580,videos:21,periodViews:63,periodLikes:5,periodComments:0,periodShares:0,profileViews:1}},
      tiktokDual:{title:"TikTok DUAL / Nexus",agent:"Luca",metrics:{followers:25,totalLikes:206,videos:10,periodViews:1,periodLikes:0,periodComments:0,periodShares:0,profileViews:0}},
      instagram:{title:"Instagram Nexus",agent:"Iris",metrics:{account:"nexus.series.ia",followers:3,mediaCount:2,reach:0,likes:0,comments:0,shares:0,engaged:0}},
      spotify:{title:"Spotify",agent:"Echo",metrics:{connected:false,artist:"SebasWit",followers:null,popularity:null,releases:null}},
      strategy:{title:"Sala de Estrategia",agent:"Atlas",metrics:{}}, publishing:{title:"Publishing",agent:"Luz",metrics:{}}
    }
  };
}

module.exports=async function handler(req,res){
  res.setHeader("Content-Type","application/json; charset=utf-8");
  res.setHeader("Cache-Control","s-maxage=120, stale-while-revalidate=300");
  try{
    const [yt,tt,ig,sp]=await Promise.all([
      windsor("youtube",["account_name","subscriber_count","view_count","video_count","views","likes","comments","shares","average_view_percentage","video_title"],"last_30dT"),
      windsor("tiktok_organic",["account_name","total_followers_count","total_likes","videos_count","video_views","likes","comments","shares","profile_views"],"last_30dT"),
      windsor("instagram",["account_name","followers_count","media_count","reach","likes","comments","shares","accounts_engaged"],"last_30dT"),
      spotify().catch(()=>({connected:false,artist:"SebasWit",followers:null,popularity:null,releases:null}))
    ]);
    const y0=yt[0]||{}, top=[...yt].sort((a,b)=>num(b.views)-num(a.views))[0]||{}, retention=Math.max(0,...yt.map(r=>num(r.average_view_percentage)));
    const main=tt.find(r=>String(r.account_name||"").toLowerCase().includes("sebaswit"))||{};
    const dual=tt.find(r=>String(r.account_name||"").toLowerCase().includes("series nexus ia"))||{};
    const igInfo=[...ig].reverse().find(r=>r.followers_count!=null||r.media_count!=null)||ig[0]||{};
    res.status(200).json({source:"live",updatedAt:new Date().toISOString(),sectors:{
      youtube:{title:"YouTube Lab",agent:"Chevy",metrics:{subscribers:num(y0.subscriber_count),totalViews:num(y0.view_count),videos:num(y0.video_count),periodViews:sum(yt,"views"),periodLikes:sum(yt,"likes"),periodComments:sum(yt,"comments"),periodShares:sum(yt,"shares"),topVideo:String(top.video_title||"Sin datos"),topVideoViews:num(top.views),topRetention:retention}},
      tiktokMain:{title:"TikTok SebasWit",agent:"Nora",metrics:{followers:num(main.total_followers_count),totalLikes:num(main.total_likes),videos:num(main.videos_count),periodViews:num(main.video_views),periodLikes:num(main.likes),periodComments:num(main.comments),periodShares:num(main.shares),profileViews:num(main.profile_views)}},
      tiktokDual:{title:"TikTok DUAL / Nexus",agent:"Luca",metrics:{followers:num(dual.total_followers_count),totalLikes:num(dual.total_likes),videos:num(dual.videos_count),periodViews:num(dual.video_views),periodLikes:num(dual.likes),periodComments:num(dual.comments),periodShares:num(dual.shares),profileViews:num(dual.profile_views)}},
      instagram:{title:"Instagram Nexus",agent:"Iris",metrics:{account:String(igInfo.account_name||"nexus.series.ia"),followers:num(igInfo.followers_count),mediaCount:num(igInfo.media_count),reach:sum(ig,"reach"),likes:sum(ig,"likes"),comments:sum(ig,"comments"),shares:sum(ig,"shares"),engaged:sum(ig,"accounts_engaged")}},
      spotify:{title:"Spotify",agent:"Echo",metrics:sp}, strategy:{title:"Sala de Estrategia",agent:"Atlas",metrics:{}}, publishing:{title:"Publishing",agent:"Luz",metrics:{}}
    }});
  }catch(err){console.error(err?.message||err);res.setHeader("Cache-Control","no-store");res.status(200).json(safePayload())}
};
