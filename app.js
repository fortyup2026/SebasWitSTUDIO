const SNAPSHOT = {
  source: "snapshot",
  updatedAt: "2026-09-20T17:38:00.000Z",
  health: { youtube: true, tiktok: true, instagram: true, facebook: true, analytics: true },
  youtube: {
    account: "SebasWit", subscribers: 2680, totalViews: 126321, videos: 77,
    periodViews: 119, periodLikes: 2, periodComments: 1, periodShares: 2,
    topVideo: "LA BRUJA 🔮 Lunes 21 de Septiembre", topVideoViews: 85, topRetention: 111.23
  },
  tiktok: { accounts: [
    { name: "SebasWit", followers: 1108, totalLikes: 17580, videos: 21, periodViews: 63, periodLikes: 5, comments: 0, shares: 0, profileViews: 1 },
    { name: "SERIES NEXUS IA", followers: 25, totalLikes: 206, videos: 10, periodViews: 1, periodLikes: 0, comments: 0, shares: 0, profileViews: 0 }
  ]},
  instagram: { accounts: [
    { name: "nexus.series.ia", followers: 3, media: 2, reach: 0, likes: 0, comments: 0, shares: 0, engaged: 0, linkTaps: 0 }
  ]},
  facebook: { accounts: [{ name: "Un montón de historias.", fans: 14353, impressions: 0 }] },
  analytics: { accounts: [
    { name: "fortyup-9dfe7", sessions: 0, users: 0, views: 0, engagementRate: 0 },
    { name: "servigoar", sessions: 0, users: 0, views: 0, engagementRate: 0 }
  ]}
};

let studioData = structuredClone(SNAPSHOT);
let refreshing = false;
let selectedAgentId = null;

const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const n = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;
const fmt = (v) => n(v).toLocaleString("es-AR");
const compact = (v) => new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 }).format(n(v));
const pct = (v) => `${(n(v) * (n(v) <= 1 ? 100 : 1)).toFixed(1)}%`;

function seedStars() {
  const root = document.getElementById("starfield");
  if (!root || root.children.length) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 95; i++) {
    const star = document.createElement("i");
    star.className = "star";
    const size = Math.random() * 1.9 + .55;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--op", (Math.random() * .55 + .16).toFixed(2));
    star.style.setProperty("--dur", `${(Math.random() * 5 + 3).toFixed(1)}s`);
    star.style.animationDelay = `${(-Math.random() * 6).toFixed(1)}s`;
    frag.appendChild(star);
  }
  root.appendChild(frag);
}

const avatarProfiles = {
  milo:  { skin:"#d8a27e", shirt:"#d74f68", pants:"#303b54", hair:"#241f28", accessory:"#89e9df", hairType:"side", glasses:true, beard:true },
  vera:  { skin:"#e2aa83", shirt:"#f0b95f", pants:"#38405a", hair:"#8a493c", accessory:"#68e5d8", hairType:"curly", headset:true },
  nora:  { skin:"#c98b68", shirt:"#48d4c8", pants:"#29364d", hair:"#171b28", accessory:"#7d6cff", hairType:"pony", cap:true },
  teo:   { skin:"#d4a079", shirt:"#8b77ff", pants:"#26344c", hair:"#3a2d29", accessory:"#66e3d7", hairType:"short", beanie:true, stubble:true },
  maia:  { skin:"#bd7f5f", shirt:"#ee73b1", pants:"#343752", hair:"#171722", accessory:"#ffb9d9", hairType:"long", glasses:true },
  atlas: { skin:"#d6a17d", shirt:"#7567db", pants:"#2b3450", hair:"#5c5661", accessory:"#71e6db", hairType:"wave", glasses:true },
  luz:   { skin:"#e2ae88", shirt:"#63d99a", pants:"#334254", hair:"#d5b36e", accessory:"#9b8aff", hairType:"bob", headset:true }
};

function avatarSVG(key, compactMode = false) {
  const p = avatarProfiles[key] || avatarProfiles.milo;
  const style = `--skin:${p.skin};--shirt:${p.shirt};--pants:${p.pants};--hair:${p.hair};--accessory:${p.accessory}`;
  const hair = {
    side:`<path class="hair" d="M31 30c3-17 36-20 42 1-8-5-13-8-25-5-6 2-10 6-17 9z"/><path class="hair" d="M31 31c-2 9 0 18 2 22l7-17z"/>`,
    curly:`<g class="hair"><circle cx="34" cy="31" r="11"/><circle cx="44" cy="24" r="12"/><circle cx="56" cy="24" r="12"/><circle cx="67" cy="31" r="11"/><circle cx="31" cy="44" r="10"/><circle cx="70" cy="44" r="10"/></g>`,
    pony:`<path class="hair" d="M31 29c8-17 35-18 43 3l-4 19-10-18-26 2-3 17z"/><ellipse class="hair" cx="76" cy="43" rx="9" ry="17" transform="rotate(-18 76 43)"/>`,
    short:`<path class="hair" d="M31 31c4-17 36-19 42 1-10-4-17-7-28-3-5 2-9 5-14 9z"/>`,
    long:`<path class="hair" d="M28 33c5-20 40-22 47 0l2 40-14-10-3-28-19 0-3 29-13 9z"/>`,
    wave:`<path class="hair" d="M30 33c2-19 39-22 45 0-6-2-10-8-18-6-7 2-11 8-18 5-3-1-6 2-9 7z"/>`,
    bob:`<path class="hair" d="M29 32c4-19 40-21 46 1l-3 33-11-3-2-29-19 1-1 28-11 2z"/>`
  }[p.hairType] || "";
  const accessoryTop = p.cap ? `<path class="accessory" d="M29 28c8-14 35-15 45 0l-3 7H31z"/><path class="accessory" d="M70 31h16c-5 5-10 7-16 7z"/>` : p.beanie ? `<path class="accessory" d="M30 29c7-17 37-18 44 0l-2 7H31z"/><rect class="accessory" x="31" y="31" width="41" height="7" rx="3"/>` : "";
  const glasses = p.glasses ? `<rect class="glasses" x="35" y="39" width="13" height="9" rx="4"/><rect class="glasses" x="54" y="39" width="13" height="9" rx="4"/><path class="line" d="M48 43h6"/>` : "";
  const facial = `${p.beard ? `<path d="M39 54c7 8 18 8 25 0-1 14-23 14-25 0z" fill="#47342e" opacity=".72"/>` : ""}${p.stubble ? `<path d="M40 55c6 5 17 5 23 0" class="line" opacity=".45"/>` : ""}`;
  const headset = p.headset ? `<path class="line" style="stroke:var(--accessory);stroke-width:3" d="M32 39c0-20 38-20 38 0"/><rect class="accessory" x="27" y="39" width="7" height="16" rx="3"/><rect class="accessory" x="68" y="39" width="7" height="16" rx="3"/>` : "";
  return `<svg class="avatar-svg" style="${style}" viewBox="0 0 100 140" aria-hidden="true">
    <ellipse class="shadow-ellipse" cx="50" cy="132" rx="30" ry="6"/>
    <path class="pants" d="M39 95h24l7 34H58l-7-25-7 25H32z"/>
    <path class="shirt" d="M31 72c5-10 13-14 20-14s16 4 20 14l-3 34H34z"/>
    <path class="skin" d="M32 77c-7 6-10 17-12 29l8 2c4-13 8-20 14-25z"/>
    <path class="skin" d="M70 77c7 6 10 17 12 29l-8 2c-4-13-8-20-14-25z"/>
    <ellipse class="skin" cx="50" cy="44" rx="22" ry="25"/>
    <ellipse class="skin-dark" cx="28" cy="45" rx="4" ry="7"/><ellipse class="skin-dark" cx="72" cy="45" rx="4" ry="7"/>
    ${hair}${accessoryTop}
    <ellipse class="white" cx="41" cy="43" rx="4.5" ry="3.3"/><ellipse class="white" cx="60" cy="43" rx="4.5" ry="3.3"/>
    <circle class="eye" cx="42" cy="43" r="1.7"/><circle class="eye" cx="59" cy="43" r="1.7"/>
    <path class="line" d="M38 37c3-2 6-2 9 0M55 37c3-2 6-2 9 0"/>
    <path class="line" d="M51 44l-2 7 4 1"/>
    <path class="mouth" d="M43 57c5 4 10 4 15 0"/>
    ${facial}${glasses}${headset}
    <path class="skin" d="M43 65h15v8H43z"/>
    <path d="M33 80c10 7 24 8 36 0" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="1.4"/>
    ${compactMode ? "" : `<circle cx="50" cy="87" r="3" fill="rgba(255,255,255,.35)"/>`}
  </svg>`;
}

function accountByName(accounts, needle) {
  return (accounts || []).find(a => String(a.name || "").toLowerCase().includes(needle.toLowerCase())) || (accounts || [])[0] || {};
}

function buildAgents(d) {
  const yt = d.youtube || {};
  const ttSebas = accountByName(d.tiktok?.accounts, "SebasWit");
  const ttNexus = accountByName(d.tiktok?.accounts, "NEXUS");
  const ig = accountByName(d.instagram?.accounts, "nexus");
  return [
    {id:"milo",avatar:"milo",name:"Milo",role:"YouTube Analytics",room:"youtube",status:"working",task:"Midiendo crecimiento, vistas y rendimiento del canal",metrics:[
      ["Suscriptores",fmt(yt.subscribers)],["Vistas canal",fmt(yt.totalViews)],["Vistas 30 días",fmt(yt.periodViews)],["Videos",fmt(yt.videos)]
    ],insight:yt.topVideoViews?`“${yt.topVideo}” es la pieza con más movimiento del período, con ${fmt(yt.topVideoViews)} vistas.`:"Estoy esperando más actividad reciente para detectar una pieza dominante."},
    {id:"vera",avatar:"vera",name:"Vera",role:"YouTube Content",room:"youtube",status:"watching",task:"Buscando aperturas, loops y piezas que puedan convertirse en Shorts",metrics:[
      ["Mejor retención",`${n(yt.topRetention).toFixed(1)}%`,yt.topRetention>100?"Puede incluir repeticiones/loops":""],["Likes 30d",fmt(yt.periodLikes)],["Comentarios",fmt(yt.periodComments)],["Compartidos",fmt(yt.periodShares)]
    ],insight:n(yt.topRetention)>=70?"La mejor pieza tiene una señal fuerte de retención. Conviene estudiar sus primeros segundos y reutilizar ese lenguaje visual.":"Voy a priorizar piezas con arranque más rápido para mejorar retención."},
    {id:"nora",avatar:"nora",name:"Nora",role:"TikTok · SebasWit",room:"tiktok-sebas",status:"working",task:"Vigilando el TikTok musical de SebasWit",metrics:[
      ["Seguidores",fmt(ttSebas.followers)],["Likes totales",fmt(ttSebas.totalLikes)],["Vistas 30d",fmt(ttSebas.periodViews)],["Videos",fmt(ttSebas.videos)]
    ],insight:`La cuenta musical tiene ${fmt(ttSebas.followers)} seguidores. Estoy buscando cualquier aceleración para avisar a Atlas.`},
    {id:"teo",avatar:"teo",name:"Teo",role:"TikTok · SERIES NEXUS IA",room:"tiktok-nexus",status:"working",task:"Siguiendo la cuenta de la serie y detectando formatos que puedan escalar",metrics:[
      ["Seguidores",fmt(ttNexus.followers)],["Likes totales",fmt(ttNexus.totalLikes)],["Vistas 30d",fmt(ttNexus.periodViews)],["Videos",fmt(ttNexus.videos)]
    ],insight:`SERIES NEXUS IA ya está conectada como una unidad independiente. Esto permite comparar la audiencia de ficción con la musical.`},
    {id:"maia",avatar:"maia",name:"Maia",role:"Instagram · Nexus",room:"instagram",status:"watching",task:"Leyendo la cuenta de Instagram que Meta permitió conectar",metrics:[
      ["Cuenta",ig.name || "nexus.series.ia"],["Seguidores",fmt(ig.followers)],["Publicaciones",fmt(ig.media)],["Alcance 30d",fmt(ig.reach)]
    ],insight:"Instagram Nexus está conectado. El Instagram musical se incorporará cuando Meta lo habilite, sin frenar esta V2."},
    {id:"atlas",avatar:"atlas",name:"Atlas",role:"Estrategia Cross-platform",room:"strategy",status:"working",task:"Comparando YouTube, TikTok e Instagram para decidir qué contenido reutilizar",metrics:[
      ["YT 30d",`${fmt(yt.periodViews)} vistas`],["TikTok música",`${fmt(ttSebas.periodViews)} vistas`],["TikTok Nexus",`${fmt(ttNexus.periodViews)} vistas`],["Redes observadas","4"]
    ],insight:n(yt.periodViews)>=n(ttSebas.periodViews)+n(ttNexus.periodViews)?"YouTube concentra más actividad reciente. Voy a buscar qué concepto puede viajar a los TikToks con una edición específica para cada cuenta.":"TikTok está mostrando más señal conjunta. Voy a buscar qué piezas merecen versión Short en YouTube."},
    {id:"luz",avatar:"luz",name:"Luz",role:"Publishing Manager",room:"publishing",status:"waiting",task:"Esperando la conexión operativa de Metricool",metrics:[
      ["YouTube","Lectura activa"],["TikTok","2 cuentas"],["Instagram","1 cuenta"],["Publicación","Pendiente"]
    ],insight:"Cuando conectemos Metricool, esta mesa podrá mostrar borradores, calendario, aprobaciones y publicaciones programadas."}
  ];
}

const ROOM_META = {
  youtube:{title:"YouTube Lab",sub:"SebasWit · analytics + contenido",icon:"▶",cls:"youtube",large:true},
  "tiktok-sebas":{title:"TikTok Music",sub:"SebasWit",icon:"♪",cls:"tiktok"},
  "tiktok-nexus":{title:"TikTok Series",sub:"SERIES NEXUS IA",icon:"N",cls:"nexus"},
  instagram:{title:"Instagram",sub:"nexus.series.ia",icon:"◎",cls:"instagram"},
  strategy:{title:"Sala de Estrategia",sub:"Cruce de plataformas",icon:"✦",cls:"strategy"},
  publishing:{title:"Publishing Desk",sub:"Calendario y aprobaciones",icon:"↗",cls:"publishing"}
};

function renderAgent(a) {
  const bubble = a.status === "waiting" ? "…" : a.status === "watching" ? "◎" : "●";
  return `<button class="agent ${a.status}" data-agent="${a.id}" aria-label="Abrir escritorio de ${esc(a.name)}">
    <span class="status-bubble">${bubble}</span>
    <span class="agent-art">${avatarSVG(a.avatar)}</span>
    <span class="agent-name">${esc(a.name)}</span>
    <span class="agent-role">${esc(a.role)}</span>
  </button>`;
}

function roomMarkup(id, agents) {
  const m = ROOM_META[id];
  const active = agents.filter(a => a.status !== "waiting").length;
  return `<article class="room ${m.cls} ${m.large ? "large" : ""}">
    <div class="room-accent"></div><div class="room-floor"></div>
    <div class="room-header"><div class="room-title"><div class="room-icon">${m.icon}</div><div><h3>${m.title}</h3><p>${m.sub}</p></div></div><span class="room-badge">${active ? `${active} activo${active>1?"s":""}` : "en espera"}</span></div>
    <div class="desk"><div class="monitor"><span>${m.icon}</span></div><div class="keyboard"></div><div class="mug"></div></div>
    <div class="plant"><i class="leaf a"></i><i class="leaf b"></i><i class="leaf c"></i><i class="plant-pot"></i></div>
    <div class="agents">${agents.map(renderAgent).join("")}</div>
  </article>`;
}

function sourceLabel(source) {
  if (source === "live") return "DATOS EN VIVO";
  if (source === "partial") return "DATOS PARCIALES";
  return "SNAPSHOT SEGURO";
}

function makeBrief(d, agents) {
  const yt = d.youtube || {};
  const ttSebas = accountByName(d.tiktok?.accounts,"SebasWit");
  const ttNexus = accountByName(d.tiktok?.accounts,"NEXUS");
  const ig = accountByName(d.instagram?.accounts,"nexus");
  return [
    yt.topVideoViews ? `YouTube: “${yt.topVideo}” lidera el período con ${fmt(yt.topVideoViews)} vistas.` : "YouTube está conectado y listo para detectar el próximo pico.",
    `TikTok musical: ${fmt(ttSebas.followers)} seguidores. TikTok Series: ${fmt(ttNexus.followers)} seguidores. Ya se analizan por separado.`,
    `Instagram Nexus está conectado${ig.followers ? ` con ${fmt(ig.followers)} seguidores` : ""}. El Instagram musical queda marcado como pendiente.`,
    `${agents.filter(a=>a.status!=="waiting").length} agentes están activos. Luz espera Metricool para encender la capa de publicación.`
  ];
}

function connectionCards(d) {
  const items = [
    ["▶","YouTube","SebasWit",true],
    ["♪","TikTok","SebasWit",true],
    ["N","TikTok","SERIES NEXUS IA",true],
    ["◎","Instagram","nexus.series.ia",true],
    ["f","Facebook","Un montón de historias.",true],
    ["↗","Analytics","FortyUp + ServiFix",true],
    ["◎","Instagram música","sebaswit.oficial",false],
    ["M","Metricool","Publishing",false]
  ];
  return items.map(([icon,title,sub,ok])=>`<div class="connection ${ok?"":"pending"}"><div class="connection-top"><div class="connection-icon">${icon}</div><i class="dot"></i></div><h4>${title}</h4><p>${sub}<br>${ok?"Conectado":"Pendiente"}</p></div>`).join("");
}

function directorAvatar() {
  return `<svg class="avatar-svg" style="--skin:#d5a07b;--shirt:#171c2d;--pants:#242c42;--hair:#201e25;--accessory:#8d7cff" viewBox="0 0 100 140" aria-hidden="true">
    <ellipse class="shadow-ellipse" cx="50" cy="132" rx="30" ry="6"/><path class="pants" d="M39 95h24l7 34H58l-7-25-7 25H32z"/><path class="shirt" d="M31 72c5-10 13-14 20-14s16 4 20 14l-3 34H34z"/><path class="skin" d="M32 77c-7 6-10 17-12 29l8 2c4-13 8-20 14-25zM70 77c7 6 10 17 12 29l-8 2c-4-13-8-20-14-25z"/><ellipse class="skin" cx="50" cy="44" rx="22" ry="25"/><ellipse class="skin-dark" cx="28" cy="45" rx="4" ry="7"/><ellipse class="skin-dark" cx="72" cy="45" rx="4" ry="7"/><path class="hair" d="M30 31c5-17 35-19 43 0-9-4-17-6-27-3-7 2-10 6-16 10z"/><ellipse class="white" cx="41" cy="43" rx="4.5" ry="3.3"/><ellipse class="white" cx="60" cy="43" rx="4.5" ry="3.3"/><circle class="eye" cx="42" cy="43" r="1.7"/><circle class="eye" cx="59" cy="43" r="1.7"/><path class="line" d="M38 37c3-2 6-2 9 0M55 37c3-2 6-2 9 0M51 44l-2 7 4 1"/><path class="mouth" d="M43 57c5 4 10 4 15 0"/><path d="M39 54c7 8 18 8 25 0-1 13-23 13-25 0z" fill="#45332d" opacity=".65"/><path class="skin" d="M43 65h15v8H43z"/><circle cx="50" cy="87" r="3" fill="#8d7cff"/>
  </svg>`;
}

function render() {
  const d = studioData;
  const agents = buildAgents(d);
  d.agents = agents;
  const byRoom = Object.fromEntries(Object.keys(ROOM_META).map(r => [r, agents.filter(a => a.room === r)]));
  const active = agents.filter(a => a.status !== "waiting").length;
  const yt = d.youtube || {};
  const ttSebas = accountByName(d.tiktok?.accounts,"SebasWit");
  const ttNexus = accountByName(d.tiktok?.accounts,"NEXUS");
  const updated = new Date(d.updatedAt || Date.now());
  const briefs = makeBrief(d, agents);

  document.getElementById("app").innerHTML = `<main class="studio-shell">
    <header class="topbar">
      <div class="brand"><div class="brand-mark">SW</div><div class="brand-word"><b>SEBASWEB</b><span>STUDIOS</span></div></div>
      <div class="top-actions"><div class="pill ${esc(d.source)}"><i></i>${sourceLabel(d.source)}</div><button class="refresh" id="refreshBtn">↻ Actualizar</button><div class="director-chip"><span>S</span><div><small>DIRECTOR GENERAL</small><b>Sebas</b></div></div></div>
    </header>

    <section class="hero"><div class="hero-card">
      <div class="hero-top"><div><span class="eyebrow">CONTROL ROOM · V2</span><h1>Tu productora digital, en órbita.</h1><p>Agentes visuales trabajando sobre datos reales de tus cuentas conectadas.</p></div><div class="hero-status"><span><b>${active}</b> agentes activos</span><span>última sync <b>${updated.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}</b></span></div></div>
      <div class="stats-strip">
        <div class="stat"><small>YOUTUBE</small><strong>${compact(yt.subscribers)}</strong><p>suscriptores</p></div>
        <div class="stat"><small>TIKTOK · MÚSICA</small><strong>${compact(ttSebas.followers)}</strong><p>seguidores</p></div>
        <div class="stat"><small>TIKTOK · SERIES</small><strong>${compact(ttNexus.followers)}</strong><p>seguidores</p></div>
        <div class="stat"><small>YOUTUBE · VISTAS</small><strong>${compact(yt.totalViews)}</strong><p>históricas</p></div>
        <div class="stat"><small>AGENTES</small><strong>${active}<span style="font-size:12px;color:#7f879b"> / ${agents.length}</span></strong><p>trabajando ahora</p></div>
      </div>
    </div></section>

    <section class="section"><div class="section-head"><div><span class="eyebrow">PLANTA PRINCIPAL</span><h2>Oficinas y agentes</h2></div><p>Tocá a una persona para abrir su escritorio.</p></div>
      <div class="office-grid">
        ${roomMarkup("youtube",byRoom.youtube)}
        ${roomMarkup("tiktok-sebas",byRoom["tiktok-sebas"])}
        ${roomMarkup("tiktok-nexus",byRoom["tiktok-nexus"])}
        ${roomMarkup("instagram",byRoom.instagram)}
        ${roomMarkup("strategy",byRoom.strategy)}
        ${roomMarkup("publishing",byRoom.publishing)}
      </div>
    </section>

    <section class="section"><div class="section-head"><div><span class="eyebrow">CONEXIONES</span><h2>Fuentes de SebasWeb Studios</h2></div><p>Lo pendiente no impide que el resto siga trabajando.</p></div><div class="connections">${connectionCards(d)}</div></section>

    <section class="section"><div class="director-card"><div><span class="director-label">DIRECCIÓN GENERAL</span><h2>Sebas</h2><p>Vos decidís qué se aprueba, qué proyecto se empuja y qué se publica. Los agentes filtran el ruido y te dejan las señales que importan.</p></div><div class="director-console"><div class="director-screen">SW</div><div class="director-desk"></div><div class="director-avatar">${directorAvatar()}</div></div></div></section>

    <section class="section"><div class="section-head"><div><span class="eyebrow">BRIEF DEL DIRECTOR</span><h2>Qué está pasando ahora</h2></div><p>Resumen automático de la oficina.</p></div><div class="brief-grid">${briefs.map((b,i)=>`<div class="brief"><span>${String(i+1).padStart(2,"0")}</span><p>${esc(b)}</p></div>`).join("")}</div></section>

    <footer><span>SEBASWEB STUDIOS · V2</span><span>actualización automática cada 2 minutos</span></footer>
    <div id="drawerRoot"></div>
  </main>`;

  document.querySelectorAll("[data-agent]").forEach(el => el.addEventListener("click", () => openAgent(el.dataset.agent)));
  $("#refreshBtn").addEventListener("click", () => refresh(false));
}

function openAgent(id) {
  selectedAgentId = id;
  const a = studioData.agents?.find(x => x.id === id) || buildAgents(studioData).find(x => x.id === id);
  if (!a) return;
  const state = a.status === "working" ? "Trabajando" : a.status === "watching" ? "Vigilando" : "En espera";
  $("#drawerRoot").innerHTML = `<div class="drawer-backdrop" id="backdrop"><aside class="drawer"><button class="close" id="closeDrawer">×</button>
    <div class="drawer-profile"><div class="drawer-avatar">${avatarSVG(a.avatar,true)}</div><div><span class="status-pill ${a.status}">${state}</span><h3>${esc(a.name)}</h3><p>${esc(a.role)}</p></div></div>
    <div class="task-box"><small>TAREA ACTUAL</small><strong>${esc(a.task)}</strong></div>
    <div class="metrics-grid">${a.metrics.map(m=>`<div class="metric"><span>${esc(m[0])}</span><strong>${esc(m[1])}</strong>${m[2]?`<small>${esc(m[2])}</small>`:""}</div>`).join("")}</div>
    <div class="insight"><span>✦ INFORME DEL AGENTE</span><p>${esc(a.insight)}</p></div>
  </aside></div>`;
  $("#closeDrawer").onclick = closeAgent;
  $("#backdrop").onclick = e => { if (e.target.id === "backdrop") closeAgent(); };
}

function closeAgent() { selectedAgentId = null; $("#drawerRoot").innerHTML = ""; }
function toast(msg) { const old=$(".toast"); if(old)old.remove(); const el=document.createElement("div"); el.className="toast"; el.textContent=msg; document.body.appendChild(el); setTimeout(()=>el.remove(),2600); }

async function refresh(silent = true) {
  if (refreshing) return;
  refreshing = true;
  const btn = $("#refreshBtn");
  if (btn) { btn.disabled = true; btn.textContent = "Actualizando…"; }
  try {
    const r = await fetch(`/api/studio?t=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) throw new Error(`API ${r.status}`);
    studioData = await r.json();
    render();
    if (selectedAgentId) openAgent(selectedAgentId);
    if (!silent) toast(studioData.source === "live" ? "Datos actualizados desde Windsor.ai" : studioData.source === "partial" ? "Actualización parcial: mantengo lo disponible" : "Usando snapshot segura");
  } catch (err) {
    if (!studioData) studioData = structuredClone(SNAPSHOT);
    render();
    if (!silent) toast("No hubo conexión: mantengo la última información disponible");
  } finally {
    refreshing = false;
    const b = $("#refreshBtn"); if (b) { b.disabled = false; b.textContent = "↻ Actualizar"; }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  seedStars();
  studioData = structuredClone(SNAPSHOT);
  render();
  refresh(true);
  setInterval(() => refresh(true), 120000);
});
