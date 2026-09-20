const FALLBACK={
 source:"safe",updatedAt:new Date().toISOString(),
 youtube:{subscribers:2680,totalViews:126321,videos:77,periodViews:119,periodLikes:3,topVideo:"LA BRUJA 🔮 Lunes 21 de Septiembre",topVideoViews:85,topRetention:111.23},
 tiktok:[
  {name:"SebasWit",followers:1108,totalLikes:17580,videos:21,periodViews:63,periodLikes:5},
  {name:"SERIES NEXUS IA",followers:25,totalLikes:206,videos:10,periodViews:1,periodLikes:0}
 ],
 instagram:{name:"nexus.series.ia",followers:3,media:2,engagement:0},
 facebook:{name:"Un montón de historias.",fans:14353},
 spotify:{status:"pending",artist:"SebasWit"}
};

const SECTORS={
 youtube:{title:"YouTube Lab",icon:"▶",accent:"#ff6277",agents:["milo","vera"],subtitle:"Analytics + contenido"},
 tiktokMain:{title:"TikTok SebasWit",icon:"♪",accent:"#4bd9cf",agents:["nora"],subtitle:"Música y clips"},
 tiktokDual:{title:"TikTok DUAL / Nexus",icon:"N",accent:"#8377ff",agents:["kai"],subtitle:"Universo DUAL"},
 instagram:{title:"Instagram Nexus",icon:"◎",accent:"#ef77b3",agents:["iris"],subtitle:"Vitrina visual"},
 spotify:{title:"Spotify",icon:"♫",accent:"#58d27f",agents:["echo"],subtitle:"Música y lanzamientos"},
 strategy:{title:"Sala de Estrategia",icon:"✦",accent:"#6ca7ff",agents:["atlas"],subtitle:"Cruce de plataformas"},
 publishing:{title:"Publishing",icon:"↗",accent:"#e5b95f",agents:["luz"],subtitle:"Aprobaciones y calendario"}
};

const PEOPLE={
 sebas:{name:"Sebas",shirt:"#7b69ff",skin:"#efc39f",hair:"#2d2737",class:"glasses"},
 facu:{name:"Facu",shirt:"#43d4c8",skin:"#efc29d",hair:"#2a2b33",class:""},
 milo:{name:"Milo",shirt:"#f06c73",skin:"#f1c5a1",hair:"#31273a",class:"headphones"},
 vera:{name:"Vera",shirt:"#f5aa63",skin:"#f0c4a5",hair:"#4b2d24",class:"glasses"},
 nora:{name:"Nora",shirt:"#4fc7ed",skin:"#efc7a7",hair:"#2a2436",class:"cap"},
 kai:{name:"Kai",shirt:"#8176ef",skin:"#efc19b",hair:"#292638",class:""},
 iris:{name:"Iris",shirt:"#e97dac",skin:"#f0c6a6",hair:"#45273e",class:"glasses"},
 echo:{name:"Echo",shirt:"#66ca81",skin:"#edbf98",hair:"#263739",class:"headphones"},
 atlas:{name:"Atlas",shirt:"#639df0",skin:"#efc09b",hair:"#2d3447",class:"glasses"},
 luz:{name:"Luz",shirt:"#d4a84d",skin:"#efc39c",hair:"#3b3326",class:""}
};

const ROOM={
 youtube:{desk1:[20,46],chair1:[45,110],desk2:[165,46],chair2:[190,110],plant:[276,26],door:[145,196]},
 tiktokMain:{desk1:[28,50],chair1:[56,114],sofa:[180,142],coffee:[223,153],plant:[276,28],door:[145,196]},
 tiktokDual:{desk1:[24,46],chair1:[50,110],desk2:[166,46],chair2:[192,110],plant:[274,142],door:[145,196]},
 instagram:{desk1:[100,50],chair1:[127,114],plant:[278,26],door:[145,196]},
 spotify:{desk1:[98,50],chair1:[126,114],plant:[24,142],door:[145,196]},
 strategy:{desk1:[92,48],chair1:[120,111],meeting:[205,62],plant:[25,26],door:[145,196]},
 publishing:{desk1:[96,48],chair1:[124,111],plant:[276,144],door:[145,196]},
 sebas:{desk1:[105,42],chair1:[132,105],sofa:[18,145],coffee:[123,155],plant:[276,25],door:[145,196]},
 facu:{desk1:[103,42],chair1:[130,105],meeting:[212,134],plant:[25,26],plant2:[276,26],door:[145,196]},
 meeting:{meeting:[95,60],chairA:[72,38],chairB:[138,38],chairC:[72,137],chairD:[138,137],plant:[277,25],door:[145,196]},
 lounge:{meeting:[34,52],meeting2:[188,52],sofa:[100,137],coffee:[140,146],plant:[275,140],door:[145,196]},
 restroom:{toilet1:[70,92],toilet2:[205,92],sink1:[66,28],sink2:[202,28],door:[145,196]}
};

let DATA=null; let agents={}; let motionTimer=null;
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const fmt=n=>Number(n||0).toLocaleString("es-AR");
function toast(t){const o=$(".toast");if(o)o.remove();const e=document.createElement("div");e.className="toast";e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),2200)}

function sectorData(key){
 if(key==="youtube")return {metrics:[["Suscriptores",fmt(DATA.youtube.subscribers)],["Vistas canal",fmt(DATA.youtube.totalViews)],["Top video",DATA.youtube.topVideo],["Vistas top",fmt(DATA.youtube.topVideoViews)]],summary:`${DATA.youtube.topVideo} es la mejor señal reciente.`,recs:["Reutilizar el arranque y la estética de la mejor pieza.","Seguir probando Shorts con gancho rápido."]};
 if(key==="tiktokMain"){const t=DATA.tiktok[0]||{};return {metrics:[["Seguidores",fmt(t.followers)],["Likes",fmt(t.totalLikes)],["Videos",fmt(t.videos)],["Vistas 30d",fmt(t.periodViews)]],summary:"La cuenta principal acompaña la identidad musical.",recs:["Clips verticales de videoclips y adelantos.","Mantener una línea visual reconocible."]}}
 if(key==="tiktokDual"){const t=DATA.tiktok[1]||{};return {metrics:[["Seguidores",fmt(t.followers)],["Likes",fmt(t.totalLikes)],["Videos",fmt(t.videos)],["Vistas 30d",fmt(t.periodViews)]],summary:"DUAL todavía es chico, pero tiene identidad propia.",recs:["Publicar escenas serializadas.","Dar continuidad a personajes y lore."]}}
 if(key==="instagram")return {metrics:[["Cuenta",DATA.instagram.name],["Seguidores",fmt(DATA.instagram.followers)],["Posts",fmt(DATA.instagram.media)],["Engagement",fmt(DATA.instagram.engagement)]],summary:"Instagram Nexus funciona como vidriera visual.",recs:["Reels cortos y consistencia visual.","Conectar más adelante sebaswit.oficial."]};
 if(key==="spotify")return {metrics:[["Artista",DATA.spotify.artist||"SebasWit"],["Estado",DATA.spotify.status==="live"?"Conectado":"Pendiente"],["Catálogo","visible"],["Analytics","parcial"]],summary:"Spotify ya tiene su sector, pero la analítica privada requiere otra fuente.",recs:["Destacar lanzamientos y portadas.","Agregar analítica cuando tengamos fuente compatible."]};
 if(key==="strategy")return {metrics:[["Foco","YouTube + TikTok"],["Señal",DATA.youtube.topVideo],["Prioridad","alta"],["Agente","Atlas"]],summary:"Atlas cruza resultados y propone prioridades.",recs:["Usar YouTube como motor y TikTok como amplificador.","Separar bien música y DUAL."]};
 return {metrics:[["Estado","En espera"],["Cola","0"],["Aprobaciones","0"],["Calendario","pendiente"]],summary:"Publishing queda listo para la siguiente integración.",recs:["Conectar la capa operativa más adelante."]};
}

function roomFurniture(key){const r=ROOM[key];if(!r)return"";let h='<div class="room-wall wall-top"></div><div class="room-wall wall-left"></div><div class="room-wall wall-right"></div>';
 for(const [name,v] of Object.entries(r)){if(name==="door"){h+=`<div class="room-door" style="left:${v[0]}px"></div>`;continue}let cls="";if(name.startsWith("desk"))cls="desk";else if(name.startsWith("chair"))cls="chair";else if(name.startsWith("plant"))cls="plant";else if(name.startsWith("meeting"))cls="meeting-table";else if(name.startsWith("sofa"))cls="sofa";else if(name.startsWith("coffee"))cls="coffee";else if(name.startsWith("toilet"))cls="toilet";else if(name.startsWith("sink"))cls="sink";if(cls)h+=`<div class="${cls}" style="left:${v[0]}px;top:${v[1]}px"></div>`}return h}

function sectorCard(key){const cfg=SECTORS[key],d=sectorData(key);return `<article class="sector-card" data-sector="${key}" style="--accent:${cfg.accent}"><div class="sector-head"><div class="sector-title"><div class="sector-icon">${cfg.icon}</div><div><h3>${cfg.title}</h3><p>${cfg.subtitle}</p></div></div><span class="status">${DATA.source==="live"?"ACTIVO":"MODO SEGURO"}</span></div><div class="room-preview" id="room-${key}">${roomFurniture(key)}</div><div class="sector-meta">${d.metrics.slice(0,4).map(m=>`<div class="meta"><span>${esc(m[0])}</span><strong>${esc(m[1])}</strong></div>`).join("")}</div><div class="sector-actions"><button class="primary" data-report="${key}">Ver informe</button></div></article>`}

function officeCard(type,title,subtitle,icon,extraAction){return `<article class="sector-card"><div class="sector-head"><div class="sector-title"><div class="sector-icon" style="--accent:#7d6cff">${icon}</div><div><h3>${title}</h3><p>${subtitle}</p></div></div><span class="status">OFICINA</span></div><div class="room-preview" id="room-${type}">${roomFurniture(type)}</div><div class="sector-actions">${extraAction||""}</div></article>`}

function render(){const unread=notifications().filter(n=>!n.read).length;document.getElementById("app").innerHTML=`<div class="shell"><header class="topbar"><div class="brand"><div class="brand-mark">SW</div><div><h1>SebasWeb Studios</h1><p>Estudio creativo y centro de operaciones</p></div></div><div class="top-actions"><div class="chip"><small>Modo</small><b>${DATA.source==="live"?"EN VIVO":"SEGURO"}</b></div><button class="btn" id="refreshBtn">↻ Actualizar</button><button class="btn" id="facuBtn">🔔 Facu ${unread?`(${unread})`:""}</button></div></header><section class="hero"><div class="hero-card"><h2>Dirección General</h2><p>Vos tomás las decisiones. Los sectores analizan, Facu centraliza y Atlas cruza lo que pasa entre plataformas.</p><div class="hero-stats"><div class="hero-stat"><small>YOUTUBE</small><strong>${fmt(DATA.youtube.subscribers)}</strong></div><div class="hero-stat"><small>TIKTOK</small><strong>${fmt((DATA.tiktok[0]||{}).followers)}</strong></div><div class="hero-stat"><small>AVISOS</small><strong>${notifications().length}</strong></div></div></div><div class="hero-card facu-hero"><div class="facu-head"><div class="facu-avatar">F</div><div><h3>Facu</h3><p>Coordinación y centro de notificaciones</p></div></div><div class="facu-actions"><button class="primary" id="facuOpen">Abrir centro</button><button class="secondary" id="facuAsk">Consultar</button></div></div></section><div class="section-head"><div><h2>Oficinas</h2><p>Vista superior clara, sin mover toda la empresa. Cada tarjeta abre su informe.</p></div><span>Los agentes trabajan casi siempre en su puesto.</span></div><section class="cards">${officeCard("sebas","Oficina de Sebas","Dirección General","S",'<button class="secondary" data-report="strategy">Ver decisiones</button>')}${officeCard("facu","Oficina de Facu","Notificaciones y coordinación","F",'<button class="primary" id="facuCardBtn">Ver notificaciones</button>')}${Object.keys(SECTORS).map(sectorCard).join("")}</section><div class="section-head"><div><h2>Áreas comunes</h2><p>Reunión, café y baño. Los NPC van solo de vez en cuando y vuelven a trabajar.</p></div></div><section class="common-grid"><article class="common-card"><div class="common-head"><h3>Sala de reuniones</h3><p>Cuando Atlas necesita cruzar información.</p></div><div class="room-preview" id="room-meeting">${roomFurniture("meeting")}</div></article><article class="common-card"><div class="common-head"><h3>Comedor / café</h3><p>Pausas breves del equipo.</p></div><div class="room-preview" id="room-lounge">${roomFurniture("lounge")}</div></article><article class="common-card"><div class="common-head"><h3>Baño</h3><p>Movimiento ocasional y natural.</p></div><div class="room-preview" id="room-restroom">${roomFurniture("restroom")}</div></article></section></div><div id="drawerRoot"></div>`;
 $("#refreshBtn").onclick=()=>load(true);$("#facuBtn").onclick=openFacu;$("#facuOpen").onclick=openFacu;$("#facuAsk").onclick=openFacu;$("#facuCardBtn").onclick=openFacu;$$('[data-report]').forEach(b=>b.onclick=()=>openReport(b.dataset.report));renderAgents()}

function human(id){const p=PEOPLE[id];return `<button class="human working ${p.class}" data-agent="${id}" style="--shirt:${p.shirt};--skin:${p.skin};--hair:${p.hair};--hat:${p.shirt}"><span class="name-tag">${p.name}</span><span class="human-ear l"></span><span class="human-ear r"></span><span class="human-hair"></span><span class="human-head"></span><span class="eye l"></span><span class="eye r"></span><span class="nose"></span><span class="mouth"></span><span class="human-body"></span><span class="arm l"></span><span class="arm r"></span><span class="leg l"></span><span class="leg r"></span></button>`}
function initAgents(){agents={sebas:{room:"sebas",x:135,y:85,home:"sebas",hx:135,hy:85},facu:{room:"facu",x:134,y:85,home:"facu",hx:134,hy:85},milo:{room:"youtube",x:50,y:82,home:"youtube",hx:50,hy:82},vera:{room:"youtube",x:194,y:82,home:"youtube",hx:194,hy:82},nora:{room:"tiktokMain",x:58,y:86,home:"tiktokMain",hx:58,hy:86},kai:{room:"tiktokDual",x:54,y:82,home:"tiktokDual",hx:54,hy:82},iris:{room:"instagram",x:129,y:86,home:"instagram",hx:129,hy:86},echo:{room:"spotify",x:128,y:86,home:"spotify",hx:128,hy:86},atlas:{room:"strategy",x:121,y:84,home:"strategy",hx:121,hy:84},luz:{room:"publishing",x:124,y:84,home:"publishing",hx:124,hy:84}}}
function renderAgents(){for(const a of Object.values(agents)){const host=document.getElementById(`room-${a.room}`);if(!host)continue;const old=document.querySelector(`[data-agent="${Object.keys(agents).find(k=>agents[k]===a)}"]`);if(old)old.remove();const id=Object.keys(agents).find(k=>agents[k]===a);const wrap=document.createElement("div");wrap.innerHTML=human(id);const el=wrap.firstChild;el.style.left=`${a.x}px`;el.style.top=`${a.y}px`;el.onclick=()=>{if(id==="facu")openFacu();else if(id==="sebas")openReport("strategy");else openReport(agents[id].home)};host.appendChild(el)}}
function move(id,room,x,y,duration=9000){const a=agents[id];if(!a)return;a.room=room;a.x=x;a.y=y;renderAgents();setTimeout(()=>{a.room=a.home;a.x=a.hx;a.y=a.hy;renderAgents()},duration)}
function startMotion(){if(motionTimer)return;motionTimer=setInterval(()=>{const ids=["milo","vera","nora","kai","iris","echo","atlas","luz"];const id=ids[Math.floor(Math.random()*ids.length)];const r=Math.random();if(r<.72)return;if(r<.84)move(id,"meeting",120+Math.random()*65,95+Math.random()*35,9000);else if(r<.94)move(id,"lounge",85+Math.random()*130,95+Math.random()*55,7000);else move(id,"restroom",Math.random()<.5?88:220,112,5000)},12000)}

function notifications(){let items=[];try{items=JSON.parse(localStorage.getItem("sw-notes-v5")||"[]")}catch{}const cutoff=Date.now()-10*86400000;items=items.filter(n=>new Date(n.date).getTime()>=cutoff);if(!items.length){items=[{id:"yt",sector:"YouTube",title:"Señal fuerte en YouTube",message:`${DATA.youtube.topVideo} lidera el período reciente.`,date:new Date().toISOString(),read:false},{id:"str",sector:"Estrategia",title:"Atlas recomienda foco",message:"Usar YouTube como motor y TikTok como amplificador.",date:new Date().toISOString(),read:false}]};localStorage.setItem("sw-notes-v5",JSON.stringify(items));return items}
function markNotes(){const a=notifications().map(n=>({...n,read:true}));localStorage.setItem("sw-notes-v5",JSON.stringify(a))}
function openFacu(){const notes=notifications();drawer(`<button class="close">×</button><h3>Centro Facu</h3><p class="sub">Últimas notificaciones, resumen ejecutivo y consulta rápida.</p><div class="report-box"><h4>Últimas notificaciones</h4>${notes.map(n=>`<div class="note"><small>${esc(n.sector)} · ${new Date(n.date).toLocaleDateString("es-AR")}</small><b>${esc(n.title)}</b><p>${esc(n.message)}</p></div>`).join("")}</div><div class="report-box"><h4>Consultar a Facu</h4><div class="ask"><input id="qFacu" placeholder="Ej: ¿Qué harías hoy?"/><button class="primary" id="askBtn">Preguntar</button></div><div id="facuAnswer"></div></div>`);markNotes();$("#askBtn").onclick=answerFacu;$("#qFacu").addEventListener("keydown",e=>{if(e.key==="Enter")answerFacu()})}
function answerFacu(){const q=$("#qFacu").value.toLowerCase();let a="Hoy mantendría el foco en YouTube y usaría TikTok para amplificar lo que mejor funciona.";if(q.includes("dual"))a="DUAL tiene una base chica, así que priorizaría continuidad: clips serializados y personajes reconocibles.";else if(q.includes("youtube"))a=`YouTube es la señal más fuerte ahora. ${DATA.youtube.topVideo} lidera el período reciente.`;else if(q.includes("spotify"))a="Spotify está contemplado en el studio, pero todavía tiene analítica parcial. Conviene usarlo para mostrar catálogo y lanzamientos.";else if(q.includes("instagram"))a="Instagram Nexus está conectado. Lo usaría como vidriera visual, con reels y una estética muy consistente.";const el=$("#facuAnswer");el.className="answer";el.textContent=a}
function openReport(key){const d=sectorData(key);drawer(`<button class="close">×</button><h3>${esc(SECTORS[key]?.title||"Dirección")}</h3><p class="sub">${esc(d.summary)}</p><div class="report-grid">${d.metrics.map(m=>`<div class="report-metric"><span>${esc(m[0])}</span><strong>${esc(m[1])}</strong></div>`).join("")}</div><div class="report-box"><h4>Lectura del sector</h4><p>${esc(d.summary)}</p></div><div class="report-box"><h4>Recomendaciones</h4><ul>${d.recs.map(r=>`<li>${esc(r)}</li>`).join("")}</ul></div>`)}
function drawer(html){$("#drawerRoot").innerHTML=`<div class="drawer-backdrop"><aside class="drawer">${html}</aside></div>`;$("#drawerRoot .close").onclick=()=>$("#drawerRoot").innerHTML="";$("#drawerRoot .drawer-backdrop").onclick=e=>{if(e.target.classList.contains("drawer-backdrop"))$("#drawerRoot").innerHTML=""}}

async function load(showToast=false){try{const r=await fetch(`/api/studio?t=${Date.now()}`,{cache:"no-store"});if(!r.ok)throw 0;DATA=await r.json()}catch{DATA=structuredClone(FALLBACK)}render();if(!Object.keys(agents).length)initAgents();renderAgents();startMotion();if(showToast)toast(DATA.source==="live"?"Datos actualizados":"Sigo usando la última información segura")}
window.addEventListener("DOMContentLoaded",()=>load(false));setInterval(()=>load(false),120000);
