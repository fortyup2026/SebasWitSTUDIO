const SAFE_DATA = {
  source: "safe",
  updatedAt: new Date().toISOString(),
  sectors: {
    youtube: { title:"YouTube Lab", agent:"Chevy", metrics:{ subscribers:2680,totalViews:126321,videos:77,periodViews:119,periodLikes:3,periodComments:1,periodShares:2,topVideo:"LA BRUJA 🔮 Lunes 21 de Septiembre",topVideoViews:85,topRetention:111.2 } },
    tiktokMain: { title:"TikTok SebasWit", agent:"Nora", metrics:{ followers:1108,totalLikes:17580,videos:21,periodViews:63,periodLikes:5,periodComments:0,periodShares:0,profileViews:1 } },
    tiktokDual: { title:"TikTok DUAL / Nexus", agent:"Luca", metrics:{ followers:25,totalLikes:206,videos:10,periodViews:1,periodLikes:0,periodComments:0,periodShares:0,profileViews:0 } },
    instagram: { title:"Instagram Nexus", agent:"Iris", metrics:{ account:"nexus.series.ia",followers:3,mediaCount:2,reach:0,likes:0,comments:0,shares:0,engaged:0 } },
    spotify: { title:"Spotify", agent:"Echo", connected:false, metrics:{ artist:"SebasWit",followers:null,popularity:null,releases:null } },
    strategy: { title:"Sala de Estrategia", agent:"Atlas", metrics:{} },
    publishing: { title:"Publishing", agent:"Luz", metrics:{} }
  }
};

const PEOPLE = {
  sebas:{name:"Sebas",role:"Director General",home:"sebas",avatar:"/assets/avatar-sebas.png"},
  facu:{name:"Facu",role:"Coordinación y Notificaciones",home:"facu",avatar:"/assets/avatar-facu.png"},
  chevy:{name:"Chevy",role:"YouTube Analytics",home:"youtube",avatar:"/assets/avatar-chevy.png"},
  vera:{name:"Vera",role:"YouTube Contenido",home:"youtube",avatar:"/assets/avatar-vera.png"},
  nora:{name:"Nora",role:"TikTok SebasWit",home:"tiktokMain",avatar:"/assets/avatar-nora.png"},
  luca:{name:"Luca",role:"TikTok DUAL / Nexus",home:"tiktokDual",avatar:"/assets/avatar-luca.png"},
  iris:{name:"Iris",role:"Instagram",home:"instagram",avatar:"/assets/avatar-iris.png"},
  echo:{name:"Echo",role:"Spotify",home:"spotify",avatar:"/assets/avatar-echo.png"},
  atlas:{name:"Atlas",role:"Estrategia",home:"strategy",avatar:"/assets/avatar-atlas.png"},
  luz:{name:"Luz",role:"Publishing",home:"publishing",avatar:"/assets/avatar-luz.png"}
};

const LOCATIONS = {
  sebas:{x:22.5,y:18.5,label:"Dirección"}, facu:{x:50,y:18,label:"Coordinación"}, youtube:{x:75,y:18.5,label:"YouTube Lab"},
  tiktokMain:{x:15.5,y:43,label:"TikTok SebasWit"}, tiktokDual:{x:34.5,y:43,label:"TikTok DUAL"}, instagram:{x:48.8,y:43,label:"Instagram"},
  spotify:{x:61,y:43,label:"Spotify"}, strategy:{x:75,y:43,label:"Estrategia"}, publishing:{x:88.5,y:43,label:"Publishing"},
  meeting:{x:23,y:67,label:"Sala de reuniones"}, cafeteria:{x:52,y:67,label:"Comedor"}, restroom:{x:82,y:67,label:"Baño"}, entrance:{x:50,y:87,label:"Entrada"}
};

const SECTOR_ORDER = ["youtube","tiktokMain","tiktokDual","instagram","spotify","strategy","publishing"];
let data = structuredClone(SAFE_DATA);
let notifications = [];
let previousSnapshot = null;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = n => Number(n ?? 0).toLocaleString("es-AR");
const clock = d => d.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"});
const dateKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

function hashString(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return Math.abs(h>>>0)}
function mins(h,m){return h*60+m}
function currentMinutes(d){return d.getHours()*60+d.getMinutes()}
function inWindow(now,start,end){const m=currentMinutes(now);return m>=start&&m<end}
function dayIndex(now){const d=now.getDay();return d===0?7:d}

const LUNCH = {
  chevy:[12,0,12,45], nora:[12,0,12,45], vera:[12,45,13,30], iris:[12,45,13,30],
  facu:[13,0,13,45], luca:[13,30,14,15], echo:[13,30,14,15], sebas:[14,0,14,45], atlas:[14,15,15,0], luz:[14,15,15,0]
};

function meetingFor(id,now){
  const m=currentMinutes(now), dow=dayIndex(now);
  const slots=[
    {start:mins(10,15),end:mins(10,45),members:["chevy","vera","atlas"],title:"Revisión YouTube"},
    {start:mins(11,15),end:mins(11,45),members:["nora","luca","atlas"],title:"Revisión TikTok"},
    {start:mins(16,30),end:mins(17,0),members:["sebas","facu"],title:"Cierre Dirección"}
  ];
  const afternoon={
    1:{members:["chevy","vera","nora","atlas","facu"],title:"Contenido semanal"},
    2:{members:["luca","iris","atlas","facu"],title:"DUAL / Nexus"},
    3:{members:["echo","nora","luz","atlas","facu"],title:"Música y lanzamientos"},
    4:{members:["chevy","nora","luca","iris","atlas","facu"],title:"Estrategia cruzada"},
    5:{members:["chevy","vera","nora","luca","iris","echo","atlas","luz","facu"],title:"Editorial semanal"}
  }[dow];
  if(afternoon) slots.push({start:mins(15,15),end:mins(16,0),...afternoon});
  return slots.find(s=>s.members.includes(id)&&m>=s.start&&m<s.end)||null;
}

function bathroomWindow(id,now){
  if(["sebas","facu"].includes(id)) return null;
  const seed=hashString(`${dateKey(now)}-${id}`);
  const base=mins(10,0)+(seed%(mins(7,0))); // 10:00..16:59
  const start=base-(base%5), end=start+7;
  const m=currentMinutes(now);
  if(m>=start&&m<end) return {start,end};
  return null;
}

function presence(id,now=new Date()){
  const m=currentMinutes(now), dow=dayIndex(now);
  if(dow>5 || m<mins(9,0) || m>=mins(18,15)) return {state:"offline",location:PEOPLE[id].home,label:"Fuera de horario",until:null};
  const meeting=meetingFor(id,now);
  if(meeting) return {state:"meeting",location:"meeting",label:meeting.title,until:meeting.end};
  const l=LUNCH[id];
  if(l && inWindow(now,mins(l[0],l[1]),mins(l[2],l[3]))) return {state:"lunch",location:"cafeteria",label:"Almuerzo",until:mins(l[2],l[3])};
  const bath=bathroomWindow(id,now);
  if(bath) return {state:"restroom",location:"restroom",label:"Pausa breve",until:bath.end};
  return {state:"working",location:PEOPLE[id].home,label:"Trabajando",until:null};
}

function untilText(minute){if(minute==null)return "";const h=Math.floor(minute/60),m=minute%60;return `hasta ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`}

function loadNotes(){
  try{const arr=JSON.parse(localStorage.getItem("sw_final_notifications")||"[]");const cutoff=Date.now()-10*86400000;return arr.filter(n=>new Date(n.createdAt).getTime()>=cutoff)}catch{return []}
}
function saveNotes(){localStorage.setItem("sw_final_notifications",JSON.stringify(notifications))}
function addNote(note){
  if(notifications.some(n=>n.id===note.id)) return;
  notifications.unshift({...note,createdAt:note.createdAt||new Date().toISOString(),read:false});
  notifications=notifications.filter(n=>new Date(n.createdAt).getTime()>=Date.now()-10*86400000).slice(0,100);saveNotes();
}
function noteId(prefix,text){return `${prefix}-${hashString(text)}`}

function sectorAnalysis(key){
  const s=data.sectors[key]||{}; const m=s.metrics||{};
  if(key==="youtube"){
    const strong=(m.topRetention||0)>=70; return {summary:`${fmt(m.subscribers)} suscriptores y ${fmt(m.periodViews)} vistas en la ventana reciente. ${m.topVideo?`La pieza con más movimiento es “${m.topVideo}”.`:""}`,rec: strong?"Conviene reutilizar el arranque y el lenguaje visual de la pieza con mejor retención en un nuevo Short.":"Conviene probar aperturas más rápidas y comparar retención durante los primeros segundos."};
  }
  if(key==="tiktokMain") return {summary:`${fmt(m.followers)} seguidores, ${fmt(m.totalLikes)} likes acumulados y ${fmt(m.periodViews)} vistas recientes.`,rec:(m.periodViews||0)<100?"Publicar un clip musical corto con gancho inmediato y medir la respuesta durante 24 horas.":"Replicar el formato de los clips que están sosteniendo el alcance."};
  if(key==="tiktokDual") return {summary:`${fmt(m.followers)} seguidores y ${fmt(m.periodViews)} vistas recientes en DUAL / Nexus.`,rec:"Mantener una secuencia serial de personajes, escenas y cliffhangers para que el proyecto gane continuidad propia."};
  if(key==="instagram") return {summary:`Cuenta ${m.account||"Nexus"}. ${fmt(m.followers)} seguidores y ${fmt(m.mediaCount)} piezas registradas.`,rec:"Usar Instagram como vidriera visual y acompañar las publicaciones principales con reels cortos."};
  if(key==="spotify") return {summary:m.connected?`${m.artist||"SebasWit"}: ${fmt(m.followers)} seguidores en Spotify y ${fmt(m.releases)} lanzamientos recuperados.`:"Spotify está preparado, pero faltan las credenciales de la API para datos directos.",rec:m.connected?"Destacar el lanzamiento más reciente en el resto de las redes.":"Agregar SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET y SPOTIFY_ARTIST_ID en Vercel."};
  if(key==="strategy") return {summary:"Atlas cruza YouTube, TikTok, Instagram y Spotify para priorizar acciones.",rec:priorities()[0]||"Mantener el ritmo y revisar los datos de cada sector."};
  if(key==="publishing") return {summary:"Luz concentra lo que está listo para calendarizar y publicar.",rec:"Cuando conectes la capa operativa de publicación, las recomendaciones aprobadas pueden pasar a calendario."};
  return {summary:"Sector activo.",rec:"Seguir monitoreando."};
}

function priorities(){
  const y=data.sectors.youtube.metrics||{}, t=data.sectors.tiktokMain.metrics||{}, d=data.sectors.tiktokDual.metrics||{};
  const out=[];
  if((y.topRetention||0)>=70) out.push(`Aprovechar la retención de “${y.topVideo||"la mejor pieza de YouTube"}” y crear una versión corta relacionada.`);
  if((t.periodViews||0)<100) out.push("Reactivar TikTok SebasWit con un clip musical breve y directo.");
  if((d.periodViews||0)<25) out.push("DUAL necesita una pieza serial nueva para recuperar continuidad.");
  if(!data.sectors.spotify.metrics?.connected) out.push("Completar la integración de Spotify para que Echo pueda trabajar con datos directos.");
  return out.slice(0,4);
}

function generateNotifications(){
  const now=new Date(), dk=dateKey(now);
  for(const key of ["youtube","tiktokMain","tiktokDual","instagram","spotify"]){
    const a=sectorAnalysis(key); addNote({id:noteId(`${dk}-${key}`,a.rec),sector:key,from:data.sectors[key].agent,title:`Informe de ${data.sectors[key].agent}`,message:a.rec,kind:"recommendation"});
  }
  // Meeting conclusions become visible shortly after a scheduled meeting finishes.
  const m=currentMinutes(now), dow=dayIndex(now);
  const meetings=[
    {end:mins(10,45),title:"Revisión YouTube",message:"Chevy, Vera y Atlas cerraron la revisión de YouTube. Facu recibió el resumen del sector."},
    {end:mins(11,45),title:"Revisión TikTok",message:"Nora, Luca y Atlas terminaron la revisión de TikTok. Facu recibió las recomendaciones."},
    {end:mins(16,0),title:"Reunión estratégica",message:"La reunión estratégica terminó. Facu consolidó las prioridades para Dirección."},
    {end:mins(17,0),title:"Cierre Dirección",message:"Facu entregó a Sebas el cierre del día con alertas y recomendaciones pendientes."}
  ];
  meetings.forEach(x=>{if(m>=x.end&&m<x.end+30)addNote({id:`${dk}-meeting-${x.end}`,sector:"strategy",from:"Facu",title:x.title,message:x.message,kind:"meeting"})});
  if(m>=mins(17,0)) addNote({id:`${dk}-daily-summary`,sector:"facu",from:"Facu",title:"Resumen del día",message:priorities().slice(0,2).join(" ")||"No hay alertas importantes para hoy.",kind:"summary"});
}

function compareSnapshots(prev,cur){
  if(!prev)return;
  const paths=[
    ["youtube","periodViews","Vistas de YouTube"],["tiktokMain","periodViews","Vistas de TikTok SebasWit"],["tiktokDual","periodViews","Vistas de TikTok DUAL"],["instagram","followers","Seguidores de Instagram"]
  ];
  paths.forEach(([sector,metric,label])=>{
    const a=Number(prev?.sectors?.[sector]?.metrics?.[metric]||0),b=Number(cur?.sectors?.[sector]?.metrics?.[metric]||0);
    if(a>0&&b!==a){const pct=((b-a)/a)*100;if(Math.abs(pct)>=10)addNote({id:noteId(`${dateKey(new Date())}-${sector}-${metric}`,`${a}-${b}`),sector,from:cur.sectors[sector].agent,title:`Cambio en ${label}`,message:`Pasó de ${fmt(a)} a ${fmt(b)} (${pct>0?"+":""}${pct.toFixed(1)}%). Facu lo marcó para revisar.`,kind:"change"})}
  });
}

function sectorIcon(key){return ({youtube:"▶",tiktokMain:"♪",tiktokDual:"♪",instagram:"◎",spotify:"●",strategy:"▥",publishing:"▤"})[key]||"•"}
function sectorShort(key){return ({youtube:"YouTube",tiktokMain:"TikTok",tiktokDual:"DUAL",instagram:"Instagram",spotify:"Spotify",strategy:"Estrategia",publishing:"Publishing"})[key]||key}
function sectorMetrics(key){
  const m=data.sectors[key]?.metrics||{};
  if(key==="youtube")return [["Suscriptores",fmt(m.subscribers)],["Vistas canal",fmt(m.totalViews)],["Vistas recientes",fmt(m.periodViews)],["Top video",m.topVideo||"-"]];
  if(key==="tiktokMain"||key==="tiktokDual")return [["Seguidores",fmt(m.followers)],["Likes",fmt(m.totalLikes)],["Videos",fmt(m.videos)],["Vistas recientes",fmt(m.periodViews)]];
  if(key==="instagram")return [["Cuenta",m.account||"-"],["Seguidores",fmt(m.followers)],["Posts",fmt(m.mediaCount)],["Alcance",fmt(m.reach)]];
  if(key==="spotify")return [["Artista",m.artist||"SebasWit"],["Seguidores",m.connected?fmt(m.followers):"Pendiente"],["Popularidad",m.connected?fmt(m.popularity):"Pendiente"],["Lanzamientos",m.connected?fmt(m.releases):"Pendiente"]];
  if(key==="strategy")return [["Prioridades",priorities().length],["Sectores",5],["Reuniones hoy",dayIndex(new Date())<=5?3:0],["Estado","Activo"]];
  return [["Estado","Preparado"],["Cola","Pendiente"],["Aprobaciones","Local"],["Calendario","Próxima etapa"]];
}

function render(){
  const now=new Date(); const states=Object.fromEntries(Object.keys(PEOPLE).map(id=>[id,presence(id,now)]));
  const counts={working:0,meeting:0,lunch:0,restroom:0,offline:0};Object.values(states).forEach(s=>counts[s.state]++);
  const unread=notifications.filter(n=>!n.read).length;
  const p=priorities();
  $("#app").innerHTML=`<div class="shell">
    <header class="topbar"><div class="brand"><div class="brand-logo">SW</div><div><h1>SebasWeb Studios</h1><p>Dirección · contenido · estrategia · música</p></div></div><div class="top-actions"><div class="chip"><small>${now.toLocaleDateString("es-AR",{weekday:"short",day:"2-digit",month:"short"})}</small><b id="clock">${clock(now)}</b></div><div class="chip"><small>Datos</small><b>${data.source==="live"?"EN VIVO":"SEGURO"}</b></div><button class="btn" id="refresh">↻ Actualizar</button><button class="btn bell" id="bell">🔔 Facu${unread?`<span class="bell-count">${unread}</span>`:""}</button></div></header>
    <section class="hero"><article class="panel director-panel"><span class="eyebrow">DIRECCIÓN GENERAL</span><h2>Centro de decisiones</h2><p>Los sectores analizan sus datos, Atlas cruza oportunidades y Facu concentra lo que necesita tu atención.</p><div class="kpis"><div class="kpi"><small>TRABAJANDO</small><strong>${counts.working}</strong></div><div class="kpi"><small>EN REUNIÓN</small><strong>${counts.meeting}</strong></div><div class="kpi"><small>ALMUERZO</small><strong>${counts.lunch}</strong></div><div class="kpi"><small>AVISOS NUEVOS</small><strong>${unread}</strong></div></div></article>
    <article class="panel facu-card"><div><div class="facu-head"><img src="${PEOPLE.facu.avatar}" alt="Facu"><div><h3>Facu</h3><p>Coordinación y Centro de Notificaciones</p></div></div><div class="facu-summary">${unread?`Tenés ${unread} aviso${unread===1?"":"s"} nuevo${unread===1?"":"s"}.`:"No hay avisos nuevos."} ${p[0]||"La operación está estable."}</div></div><div class="facu-actions"><button class="btn primary" id="facuCenter">Abrir centro</button><button class="btn" id="askFacu">Consultar</button></div></article></section>
    <div class="section-head"><div><h2>La empresa ahora</h2><p>Los NPC siguen horarios reales. Trabajan, almuerzan por turnos, se reúnen cuando corresponde y vuelven a sus puestos.</p></div><div class="live-summary">${clock(now)} · ${counts.working} trabajando · ${counts.meeting} reunión · ${counts.lunch} almuerzo</div></div>
    <section class="panel map-card"><div class="studio-map" id="studioMap"><img src="/assets/studio-map.png" alt="Mapa de SebasWeb Studios"><div class="map-vignette"></div>${renderHotspots()}${renderNpcs(states)}</div><div class="legend"><span><i style="background:#67d99b"></i>Trabajando</span><span><i style="background:#9c8cff"></i>Reunión</span><span><i style="background:#f6bb68"></i>Almuerzo</span><span><i style="background:#58bdf7"></i>Pausa</span><span><i style="background:#687386"></i>Fuera de horario</span></div></section>
    <div class="section-head"><div><h2>Informes por sector</h2><p>Cada área tiene su lectura propia. Facu recibe las recomendaciones y las eleva a Dirección.</p></div></div>
    <section class="cards">${SECTOR_ORDER.map(renderSectorCard).join("")}</section>
    <section class="activity-grid"><article class="panel activity-list"><h3>Qué está haciendo el equipo</h3>${renderActivity(states)}</article><article class="panel priority-list"><h3>Prioridades para Dirección</h3>${p.map((x,i)=>`<div class="priority-item"><div class="priority-num">${i+1}</div><div><b>Recomendación</b><p>${esc(x)}</p></div></div>`).join("")||`<p style="color:var(--muted);font-size:11px">Sin prioridades críticas en este momento.</p>`}</article></section>
    <div id="drawerRoot"></div></div>`;
  wire();
}

function renderHotspots(){
  const keys=["sebas","facu","youtube","tiktokMain","tiktokDual","instagram","spotify","strategy","publishing","meeting","cafeteria","restroom"];
  return keys.map(k=>{const l=LOCATIONS[k];const reportKey=(["youtube","tiktokMain","tiktokDual","instagram","spotify","strategy","publishing"].includes(k)?k:null);return `<button class="hotspot" style="left:${l.x}%;top:${l.y}%" data-location="${k}" ${reportKey?`data-report="${reportKey}"`:k==="facu"?`data-facu="1"`:k==="sebas"?`data-direction="1"`:""}><span>${esc(l.label)}</span></button>`}).join("")
}
function renderNpcs(states){
  return Object.entries(states).map(([id,s])=>{const person=PEOPLE[id],loc=LOCATIONS[s.location]||LOCATIONS[person.home];const jitter=(hashString(id)%7)-3;return `<button class="npc" data-person="${id}" data-state="${s.state}" style="left:calc(${loc.x}% + ${jitter}px);top:calc(${loc.y}% + ${(hashString(id+"y")%5)-2}px)"><img src="${person.avatar}" alt="${esc(person.name)}"><i class="dot"></i><span class="npc-label">${esc(person.name)} · ${esc(s.label)}</span></button>`}).join("")
}
function renderSectorCard(key){
  const s=data.sectors[key],a=sectorAnalysis(key),metrics=sectorMetrics(key).slice(0,4);return `<article class="panel sector-card"><div><div class="sector-top"><div class="sector-name"><div class="platform-icon">${sectorIcon(key)}</div><div><h3>${esc(s.title)}</h3><p>${esc(s.agent)} · ${key==="strategy"?"cruce de datos":key==="publishing"?"calendario y lanzamientos":"análisis del sector"}</p></div></div><span class="state-badge">${data.source==="live"?"ACTIVO":"MODO SEGURO"}</span></div><div class="sector-metrics">${metrics.map(([l,v])=>`<div class="mini"><small>${esc(l)}</small><b title="${esc(v)}">${esc(v)}</b></div>`).join("")}</div></div><div class="sector-actions"><button class="small-btn" data-report="${key}">Ver informe</button>${key!=="strategy"&&key!=="publishing"?`<button class="small-btn" data-person="${Object.keys(PEOPLE).find(id=>PEOPLE[id].home===key)||"atlas"}">Ver agente</button>`:""}</div></article>`
}
function renderActivity(states){
  return Object.entries(states).map(([id,s])=>{const p=PEOPLE[id];return `<div class="activity-item"><img class="avatar-sm" src="${p.avatar}" alt=""><div><b>${esc(p.name)} · ${esc(s.label)}</b><p>${esc(p.role)}${s.until?` · ${untilText(s.until)}`:""}</p></div></div>`}).join("")
}

function wire(){
  $("#refresh")?.addEventListener("click",()=>refresh(true));$("#bell")?.addEventListener("click",openFacu);$("#facuCenter")?.addEventListener("click",openFacu);$("#askFacu")?.addEventListener("click",openFacu);
  $$('[data-report]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();openReport(b.dataset.report)}));
  $$('[data-person]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();openPerson(b.dataset.person)}));
  $$('[data-facu]').forEach(b=>b.addEventListener('click',openFacu));$$('[data-direction]').forEach(b=>b.addEventListener('click',openDirection));
}
function openDrawer(html){$("#drawerRoot").innerHTML=`<div class="drawer-backdrop" id="backdrop"><aside class="drawer"><button class="drawer-close" id="closeDrawer">×</button>${html}</aside></div>`;$("#closeDrawer").onclick=closeDrawer;$("#backdrop").onclick=e=>{if(e.target.id==="backdrop")closeDrawer()}}
function closeDrawer(){$("#drawerRoot").innerHTML=""}
function openPerson(id){const p=PEOPLE[id],s=presence(id,new Date()),homeSector=SECTOR_ORDER.includes(p.home)?p.home:(id==="facu"?"strategy":null);const report=homeSector?sectorAnalysis(homeSector):null;openDrawer(`<div class="drawer-title"><img src="${p.avatar}" alt=""><div><h2>${esc(p.name)}</h2><p class="sub">${esc(p.role)}</p></div></div><div class="metric-grid"><div class="metric"><span>ESTADO</span><strong>${esc(s.label)}</strong></div><div class="metric"><span>UBICACIÓN</span><strong>${esc(LOCATIONS[s.location]?.label||"Oficina")}</strong></div></div><div class="block"><h4>Tarea actual</h4><p>${esc(taskFor(id,s))}</p></div>${report?`<div class="block"><h4>Su lectura</h4><p>${esc(report.summary)}</p></div><div class="block"><h4>Recomendación</h4><p>${esc(report.rec)}</p></div>`:""}`)}
function taskFor(id,s){if(s.state==="meeting")return `Participando de ${s.label.toLowerCase()} ${untilText(s.until)}.`;if(s.state==="lunch")return `Almuerzo programado ${untilText(s.until)}. Después vuelve a su sector.`;if(s.state==="restroom")return "Pausa breve. Vuelve automáticamente a su puesto.";if(s.state==="offline")return "Fuera del horario laboral.";return ({sebas:"Revisando prioridades y decisiones pendientes.",facu:"Consolidando informes de los sectores y preparando notificaciones para Dirección.",chevy:"Analizando rendimiento, retención y señales de YouTube.",vera:"Revisando contenido y oportunidades para nuevas piezas de YouTube.",nora:"Analizando clips, alcance y crecimiento de TikTok SebasWit.",luca:"Revisando desempeño y continuidad del universo DUAL / Nexus.",iris:"Revisando Instagram y coherencia visual del proyecto.",echo:"Revisando catálogo y oportunidades de promoción musical.",atlas:"Comparando plataformas para definir prioridades.",luz:"Preparando recomendaciones que pueden convertirse en calendario de publicación."})[id]}
function openReport(key){const s=data.sectors[key],a=sectorAnalysis(key),metrics=sectorMetrics(key);openDrawer(`<div class="drawer-title"><div class="platform-icon">${sectorIcon(key)}</div><div><h2>${esc(s.title)}</h2><p class="sub">Informe de ${esc(s.agent)}</p></div></div><div class="metric-grid">${metrics.map(([l,v])=>`<div class="metric"><span>${esc(l)}</span><strong>${esc(v)}</strong></div>`).join("")}</div><div class="block"><h4>Análisis del sector</h4><p>${esc(a.summary)}</p></div><div class="block"><h4>Recomendación para Facu</h4><p>${esc(a.rec)}</p></div><div class="block"><h4>Flujo interno</h4><p>${esc(s.agent)} informa a Atlas cuando hace falta cruzar plataformas. Facu recibe la conclusión y solo eleva a Dirección lo que requiere atención.</p></div>`)}
function openDirection(){const unread=notifications.filter(n=>!n.read);openDrawer(`<div class="drawer-title"><img src="${PEOPLE.sebas.avatar}" alt=""><div><h2>Dirección · Sebas</h2><p class="sub">Decisiones y prioridades</p></div></div><div class="block"><h4>Prioridades actuales</h4><ul>${priorities().map(x=>`<li>${esc(x)}</li>`).join("")||"<li>Sin alertas críticas.</li>"}</ul></div><div class="block"><h4>Facu te dejó</h4><p>${unread.length?`${unread.length} notificación${unread.length===1?"":"es"} sin leer.`:"Todo al día."}</p></div>`)}
function openFacu(){notifications=notifications.map(n=>({...n,read:true}));saveNotes();openDrawer(`<div class="drawer-title"><img src="${PEOPLE.facu.avatar}" alt=""><div><h2>Centro Facu</h2><p class="sub">Coordinación y notificaciones</p></div></div><div class="block"><h4>Últimas notificaciones</h4>${notifications.length?notifications.slice(0,30).map(n=>`<div class="note"><small>${new Date(n.createdAt).toLocaleString("es-AR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})} · ${esc(sectorShort(n.sector))}</small><b>${esc(n.title)}</b><p>${esc(n.message)}</p></div>`).join(""):`<p>No hay notificaciones.</p>`}</div><div class="block"><h4>Consultar a Facu</h4><div class="ask"><input id="facuQuestion" placeholder="Ej.: ¿qué harías hoy?"><button class="small-btn primary" id="facuAsk">Preguntar</button></div><div id="facuAnswer" class="answer" style="display:none"></div></div>`);$("#facuAsk").onclick=answerFacu;$("#facuQuestion").onkeydown=e=>{if(e.key==="Enter")answerFacu()}}
function answerFacu(){const q=($("#facuQuestion").value||"").toLowerCase(),ans=$("#facuAnswer");let text=`Hoy priorizaría: ${priorities().slice(0,3).join(" ")}`;if(q.includes("youtube"))text=sectorAnalysis("youtube").summary+" "+sectorAnalysis("youtube").rec;else if(q.includes("dual")||q.includes("nexus"))text=sectorAnalysis("tiktokDual").summary+" "+sectorAnalysis("tiktokDual").rec;else if(q.includes("tiktok"))text=sectorAnalysis("tiktokMain").summary+" "+sectorAnalysis("tiktokMain").rec;else if(q.includes("spotify")||q.includes("música")||q.includes("musica"))text=sectorAnalysis("spotify").summary+" "+sectorAnalysis("spotify").rec;else if(q.includes("instagram"))text=sectorAnalysis("instagram").summary+" "+sectorAnalysis("instagram").rec;else if(q.includes("reun"))text=meetingSummary();ans.style.display="block";ans.textContent=text}
function meetingSummary(){const now=new Date(),active=Object.entries(PEOPLE).filter(([id])=>presence(id,now).state==="meeting").map(([id])=>PEOPLE[id].name);return active.length?`${active.join(", ")} están en reunión ahora. Cuando termine, vuelven a sus puestos y Facu recibe el resumen.`:"No hay una reunión activa ahora. Las reuniones están escalonadas durante el día."}

async function refresh(user=false){
  const before=data;
  try{const res=await fetch(`/api/studio?t=${Date.now()}`,{cache:"no-store"});if(!res.ok)throw new Error("api");const json=await res.json();data=json}catch{data=structuredClone(SAFE_DATA)}
  previousSnapshot=before;compareSnapshots(before,data);generateNotifications();render();if(user)toast(data.source==="live"?"Datos actualizados":"La API no respondió. Mantengo el modo seguro.")
}
function toast(msg){const old=$(".toast");if(old)old.remove();const el=document.createElement("div");el.className="toast";el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),2500)}

function tick(){const c=$("#clock");if(c)c.textContent=clock(new Date());const oldStates=$$('.npc').map(x=>`${x.dataset.person}:${x.dataset.state}`).join('|');const now=new Date();const newStates=Object.fromEntries(Object.keys(PEOPLE).map(id=>[id,presence(id,now)]));const newSig=Object.entries(newStates).map(([id,s])=>`${id}:${s.state}:${s.location}`).join('|');if(window.__presenceSig!==newSig){window.__presenceSig=newSig;render()}}

window.addEventListener("DOMContentLoaded",async()=>{notifications=loadNotes();render();await refresh(false);window.__presenceSig="";setInterval(tick,30000);setInterval(()=>refresh(false),300000)});
