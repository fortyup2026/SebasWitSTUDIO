const FALLBACK = {
  source: "safe",
  updatedAt: new Date().toISOString(),
  company: { name: "SebasWeb Studios", director: "Sebas", coordinator: "Facu" },
  sectors: {
    youtube: {
      title: "YouTube Lab", agent: "Milo", status: "activo",
      summary: "YouTube conectado y analizando videos del canal.",
      metrics: [
        { label: "Suscriptores", value: "2680" },
        { label: "Vistas canal", value: "126321" },
        { label: "Top video", value: "LA BRUJA" },
        { label: "Retención top", value: "111.2%" }
      ],
      recommendations: [
        "Reutilizar el formato visual del teaser de LA BRUJA.",
        "Crear más clips cortos con apertura fuerte en los primeros 3 segundos."
      ]
    },
    tiktokMain: {
      title: "TikTok SebasWit", agent: "Nora", status: "activo",
      summary: "TikTok principal con señales moderadas de actividad.",
      metrics: [
        { label: "Seguidores", value: "1108" },
        { label: "Likes totales", value: "17580" },
        { label: "Videos", value: "21" },
        { label: "Vistas 30d", value: "63" }
      ],
      recommendations: [
        "Aprovechar fragmentos de videoclips y adelantos.",
        "Subir contenido vertical de making-of y teasers musicales."
      ]
    },
    tiktokDual: {
      title: "TikTok DUAL / Nexus", agent: "Kai", status: "activo",
      summary: "Cuenta DUAL conectada con base chica pero identidad temática clara.",
      metrics: [
        { label: "Seguidores", value: "25" },
        { label: "Likes totales", value: "206" },
        { label: "Videos", value: "10" },
        { label: "Vistas 30d", value: "1" }
      ],
      recommendations: [
        "Potenciar escenas cortas con personajes y universo DUAL.",
        "Publicar clips serializados para continuidad."
      ]
    },
    instagram: {
      title: "Instagram Nexus", agent: "Iris", status: "activo",
      summary: "Instagram Nexus conectado. Perfil todavía chico.",
      metrics: [
        { label: "Cuenta", value: "nexus.series.ia" },
        { label: "Seguidores", value: "3" },
        { label: "Posts", value: "2" },
        { label: "Engagement", value: "básico" }
      ],
      recommendations: [
        "Mantener coherencia visual en el feed.",
        "Acompañar cada post con reels cortos."
      ]
    },
    spotify: {
      title: "Spotify", agent: "Echo", status: "pendiente",
      summary: "Spotify visible como sector, a la espera de datos ampliados.",
      metrics: [
        { label: "Estado", value: "listo para integrar" },
        { label: "Perfil", value: "SebasWit" },
        { label: "Catálogo", value: "visible" },
        { label: "Datos", value: "parciales" }
      ],
      recommendations: [
        "Mostrar últimos lanzamientos y accesos rápidos.",
        "Cuando conectemos datos ampliados, sumar resumen musical."
      ]
    },
    strategy: {
      title: "Sala de Estrategia", agent: "Atlas", status: "activo",
      summary: "Cruza plataformas y define prioridades del día.",
      metrics: [
        { label: "Foco", value: "YouTube + TikTok" },
        { label: "Tarea", value: "comparar rendimiento" },
        { label: "Riesgo", value: "bajo" },
        { label: "Señal", value: "LA BRUJA" }
      ],
      recommendations: [
        "Cruzar los mejores clips de YouTube con TikTok principal.",
        "Separar la identidad musical del universo DUAL."
      ]
    },
    publishing: {
      title: "Publishing", agent: "Luz", status: "pendiente",
      summary: "Preparado para programación y aprobaciones futuras.",
      metrics: [
        { label: "Estado", value: "en espera" },
        { label: "Cola", value: "vacía" },
        { label: "Aprobaciones", value: "0" },
        { label: "Calendario", value: "pendiente" }
      ],
      recommendations: [
        "Conectar luego la capa operativa de publicación.",
        "Centralizar aprobaciones desde tu oficina."
      ]
    }
  },
  notifications: [
    {
      id: "n1", sector: "youtube", title: "YouTube detectó señal fuerte",
      message: "LA BRUJA muestra el mejor rendimiento reciente.",
      date: new Date().toISOString(), priority: "high"
    },
    {
      id: "n2", sector: "strategy", title: "Atlas recomienda acción",
      message: "Conviene recortar el teaser más fuerte para TikTok.",
      date: new Date().toISOString(), priority: "medium"
    }
  ]
};

const AGENTS = {
  sebas: { name: "Sebas", color: "#8d7cff", hair: "#2e2a44", skin: "#efc8a3", home: "sebasOffice" },
  facu: { name: "Facu", color: "#43d7ca", hair: "#272a39", skin: "#edc4a2", home: "facuCenter" },
  milo: { name: "Milo", color: "#ff7f83", hair: "#30263d", skin: "#f0c09e", home: "youtube" },
  vera: { name: "Vera", color: "#ffb86c", hair: "#4a2c22", skin: "#f2c5a6", home: "youtube" },
  nora: { name: "Nora", color: "#58d0ff", hair: "#2a2437", skin: "#f1c7a3", home: "tiktokMain" },
  kai: { name: "Kai", color: "#8b85ff", hair: "#24243b", skin: "#efc39c", home: "tiktokDual" },
  iris: { name: "Iris", color: "#ff86b5", hair: "#3b2942", skin: "#f0c7a6", home: "instagram" },
  echo: { name: "Echo", color: "#72de8f", hair: "#28383a", skin: "#edc39d", home: "spotify" },
  atlas: { name: "Atlas", color: "#64a8ff", hair: "#293045", skin: "#efc39a", home: "strategy" },
  luz: { name: "Luz", color: "#ffd36a", hair: "#3a3223", skin: "#efc39d", home: "publishing" }
};

function desk(x,y){ return {type:"desk",x,y}; }
function chair(x,y){ return {type:"chair",x,y}; }
function tableRound(x,y){ return {type:"table-round",x,y}; }
function tableRect(x,y){ return {type:"table-rect",x,y}; }
function sofa(x,y){ return {type:"sofa",x,y}; }
function coffee(x,y){ return {type:"coffee",x,y}; }
function plant(x,y){ return {type:"plant",x,y}; }
function toilet(x,y){ return {type:"toilet",x,y}; }
function sink(x,y){ return {type:"sink",x,y}; }
function door(x,y){ return {type:"door",x,y}; }

const ROOM_LAYOUTS = {
  youtube: {
    label:"YouTube",
    furniture:[desk(24,58),chair(20,110),chair(88,110),desk(156,58),chair(152,110),chair(220,110),plant(224,24),door(110,204)],
    anchors:{work1:{x:52,y:85},work2:{x:184,y:85},idle:{x:120,y:168}}
  },
  tiktokMain: {
    label:"TikTok SebasWit",
    furniture:[desk(34,70),chair(66,120),plant(220,30),sofa(160,150),coffee(204,168),door(120,204)],
    anchors:{work:{x:64,y:98},idle:{x:184,y:164}}
  },
  tiktokDual: {
    label:"TikTok DUAL",
    furniture:[desk(28,62),chair(24,116),desk(146,62),chair(212,116),plant(224,162),door(112,204)],
    anchors:{work1:{x:56,y:88},work2:{x:174,y:88},idle:{x:182,y:160}}
  },
  instagram: {
    label:"Instagram",
    furniture:[desk(92,72),chair(124,124),plant(214,30),door(106,204)],
    anchors:{work:{x:122,y:100},idle:{x:190,y:158}}
  },
  spotify: {
    label:"Spotify",
    furniture:[desk(90,72),chair(122,124),plant(32,158),door(106,204)],
    anchors:{work:{x:118,y:100},idle:{x:58,y:162}}
  },
  strategy: {
    label:"Estrategia",
    furniture:[desk(88,72),chair(120,124),tableRound(184,42),plant(32,34),door(108,204)],
    anchors:{work:{x:116,y:100},idle:{x:184,y:88}}
  },
  publishing: {
    label:"Publishing",
    furniture:[desk(84,72),chair(116,124),plant(214,162),door(108,204)],
    anchors:{work:{x:112,y:100},idle:{x:196,y:162}}
  },
  sebasOffice: {
    label:"Oficina de Sebas",
    furniture:[desk(98,58),chair(130,110),sofa(28,152),sofa(126,152),coffee(110,164),plant(218,26),door(110,204)],
    anchors:{work:{x:126,y:86},relax:{x:112,y:165}}
  },
  facuCenter: {
    label:"Centro Facu",
    furniture:[desk(98,58),chair(130,110),tableRound(198,146),plant(30,32),plant(220,32),door(110,204)],
    anchors:{work:{x:126,y:86},review:{x:198,y:172}}
  },
  meeting: {
    label:"Sala de reuniones",
    furniture:[tableRect(58,70),chair(66,44),chair(126,44),chair(186,44),chair(66,146),chair(126,146),chair(186,146),plant(222,26),door(108,204)],
    anchors:{a:{x:82,y:96},b:{x:126,y:96},c:{x:170,y:96},d:{x:126,y:136}}
  },
  lounge: {
    label:"Comedor / café",
    furniture:[tableRound(42,46),tableRound(154,46),tableRound(98,126),plant(222,160),door(108,204)],
    anchors:{a:{x:70,y:76},b:{x:182,y:76},c:{x:126,y:156}}
  },
  restroom: {
    label:"Baño",
    furniture:[sink(44,26),sink(152,26),toilet(54,108),toilet(160,108),door(108,204)],
    anchors:{a:{x:70,y:138},b:{x:176,y:138}}
  }
};

let studioData = null;
let agentState = {};
let scheduleTimer = null;

const $ = sel => document.querySelector(sel);
const $all = sel => [...document.querySelectorAll(sel)];
const shortDate = d => new Date(d).toLocaleDateString("es-AR", {day:"2-digit",month:"short"});
const escapeHtml = str => String(str ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

function toast(msg){
  const old=$('.toast'); if(old) old.remove();
  const el=document.createElement('div'); el.className='toast'; el.textContent=msg; document.body.appendChild(el);
  setTimeout(()=>el.remove(),2600);
}

function readStoredNotifications(){
  const raw=localStorage.getItem('sebasweb_notifications_v4');
  if(!raw) return [];
  try{
    const items=JSON.parse(raw);
    const limit=Date.now()-(10*24*60*60*1000);
    return items.filter(x=>new Date(x.date).getTime()>=limit);
  }catch{return []}
}
function saveNotifications(items){ localStorage.setItem('sebasweb_notifications_v4',JSON.stringify(items)); }
function mergeNotifications(serverNotes){
  const stored=readStoredNotifications();
  const map=new Map(stored.map(n=>[n.id,n]));
  serverNotes.forEach(n=>{ if(!map.has(n.id)) map.set(n.id,{...n,read:false}); });
  const merged=[...map.values()].sort((a,b)=>new Date(b.date)-new Date(a.date));
  saveNotifications(merged); return merged;
}

async function loadData(showToast=false){
  try{
    const res=await fetch(`/api/studio?t=${Date.now()}`,{cache:'no-store'});
    if(!res.ok) throw new Error('API');
    studioData=await res.json();
  }catch{
    studioData=structuredClone(FALLBACK);
  }
  studioData.notifications=mergeNotifications(studioData.notifications||[]);
  render();
  if(!scheduleTimer){ initAgents(); startSchedules(); }
  if(showToast) toast(studioData.source==='live'?'Studio actualizado':'Modo seguro: mantengo la última información');
}

function sectorMetric(key,label){
  const metric=studioData.sectors[key]?.metrics?.find(m=>m.label===label);
  return metric?metric.value:'-';
}

function render(){
  const notesUnread=(studioData.notifications||[]).filter(n=>!n.read).length;
  $('#app').innerHTML=`
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">SW</div>
          <div><h1>SebasWeb Studios</h1><p>Centro creativo · redes · estrategia · música</p></div>
        </div>
        <div class="top-actions">
          <div class="pill"><small>Modo</small><b>${studioData.source==='live'?'EN VIVO':'SEGURO'}</b></div>
          <div class="pill"><small>Actualizado</small><b>${shortDate(studioData.updatedAt)}</b></div>
          <button class="refresh-btn" id="refreshBtn">↻ Actualizar</button>
          <button class="secondary-btn" id="openFacuBtn">🔔 Facu ${notesUnread?`(${notesUnread})`:''}</button>
        </div>
      </header>

      <section class="summary">
        <article class="stat-card"><small>YOUTUBE</small><strong>${sectorMetric('youtube','Suscriptores')}</strong><p>${escapeHtml(sectorMetric('youtube','Top video'))} · top actual</p></article>
        <article class="stat-card"><small>TIKTOK PRINCIPAL</small><strong>${sectorMetric('tiktokMain','Seguidores')}</strong><p>${sectorMetric('tiktokMain','Likes totales')} likes acumulados</p></article>
        <article class="stat-card"><small>DUAL / NEXUS</small><strong>${sectorMetric('tiktokDual','Seguidores')}</strong><p>${sectorMetric('tiktokDual','Videos')} piezas publicadas</p></article>
        <article class="stat-card"><small>NOTIFICACIONES</small><strong>${studioData.notifications.length}</strong><p>${notesUnread} nuevas · duran 10 días</p></article>
      </section>

      <div class="section-title">
        <div><h2>Studio top-down</h2><p>Salas vistas desde arriba. Los agentes trabajan normalmente y solo se mueven a reunión, baño o comedor de vez en cuando.</p></div>
        <div class="right-note">sin arrastrar toda la pantalla · click en cada sector</div>
      </div>

      <section class="office-grid">
        ${renderRoomCard('sebasOffice','span-4','S','Oficina de Sebas','Tu oficina y decisiones del día',`<div class="info-strip"><span><b>Sebas</b> dirige el studio</span><span><b>Acceso</b> a todos los sectores</span></div>`,[{label:'Ver informe',action:'report',sector:'strategy'}])}
        ${renderFacuCard(notesUnread)}
        ${renderSectorCard('youtube','span-4')}
        ${renderSectorCard('tiktokMain','span-4')}
        ${renderSectorCard('tiktokDual','span-4')}
        ${renderSectorCard('instagram','span-3')}
        ${renderSectorCard('spotify','span-3')}
        ${renderSectorCard('strategy','span-3')}
        ${renderSectorCard('publishing','span-3')}
        ${renderRoomCard('meeting','span-4','RM','Sala de reuniones','Acá se juntan cuando Atlas necesita cruzar información.','',[])}
        ${renderRoomCard('lounge','span-4','☕','Comedor / café','Pausa natural del equipo.','',[])}
        ${renderRoomCard('restroom','span-4','WC','Baño','Movimiento ocasional y normal del equipo.','',[])}
      </section>
    </div>
    <div id="drawerRoot"></div>`;

  $('#refreshBtn').addEventListener('click',()=>loadData(true));
  $('#openFacuBtn').addEventListener('click',openFacuCenter);
  $all('[data-report]').forEach(btn=>btn.addEventListener('click',()=>openReport(btn.dataset.report)));
  $all('[data-facu]').forEach(btn=>btn.addEventListener('click',openFacuCenter));
  renderAgents();
}

function renderSectorCard(key,spanClass){
  const sec=studioData.sectors[key];
  return renderRoomCard(
    key,spanClass,sec.agent.slice(0,1).toUpperCase(),sec.title,sec.summary,
    `<div class="info-strip">${sec.metrics.slice(0,4).map(m=>`<span><b>${escapeHtml(m.label)}:</b> ${escapeHtml(m.value)}</span>`).join('')}</div>`,
    [{label:'Ver informe',action:'report',sector:key}]
  );
}

function renderFacuCard(unread){
  return renderRoomCard('facuCenter','span-4','F','Centro Facu','Notificaciones, coordinación general y resumen ejecutivo.',`
    <div class="notifications-preview">
      ${(studioData.notifications||[]).slice(0,3).map(n=>`<div class="note-row"><small>${escapeHtml(n.sector)} · ${shortDate(n.date)}</small><b>${escapeHtml(n.title)}</b><p>${escapeHtml(n.message)}</p></div>`).join('')||'<p class="empty">Sin notificaciones nuevas.</p>'}
    </div>
    <div class="info-strip"><span><b>Nuevas:</b> ${unread}</span><span><b>Total:</b> ${(studioData.notifications||[]).length}</span></div>`,
    [{label:'Ver notificaciones',action:'facu'},{label:'Consultar a Facu',action:'facu'}]
  );
}

function renderRoomCard(roomKey,spanClass,icon,title,subtitle,extraHtml,actions){
  const room=ROOM_LAYOUTS[roomKey];
  return `<article class="card ${spanClass}" data-room="${roomKey}">
    <div class="card-header"><div class="card-title-wrap"><div class="avatar-badge">${icon}</div><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(subtitle)}</p></div></div><span class="badge">${escapeHtml(room.label)}</span></div>
    <div class="room"><div class="room-floor"></div><div class="room-label">${escapeHtml(room.label)}</div><div class="room-topview" id="room-${roomKey}">${renderFurniture(room.furniture)}</div></div>
    ${extraHtml||''}
    ${actions.length?`<div class="card-actions">${actions.map(a=>a.action==='report'?`<button class="primary-btn" data-report="${a.sector}">${a.label}</button>`:`<button class="primary-btn" data-facu="1">${a.label}</button>`).join('')}</div>`:''}
  </article>`;
}

function renderFurniture(items){ return items.map(item=>`<div class="${item.type}" style="left:${item.x}px;top:${item.y}px"></div>`).join(''); }

function initAgents(){
  agentState={
    sebas:makeAgentState('sebas','sebasOffice','work'),
    facu:makeAgentState('facu','facuCenter','work'),
    milo:makeAgentState('milo','youtube','work1'),
    vera:makeAgentState('vera','youtube','work2'),
    nora:makeAgentState('nora','tiktokMain','work'),
    kai:makeAgentState('kai','tiktokDual','work1'),
    iris:makeAgentState('iris','instagram','work'),
    echo:makeAgentState('echo','spotify','work'),
    atlas:makeAgentState('atlas','strategy','work'),
    luz:makeAgentState('luz','publishing','work')
  };
}
function makeAgentState(id,room,anchor){ return {id,room,anchor,status:'working',home:AGENTS[id].home}; }

function renderAgents(){
  Object.values(agentState).forEach(agent=>{
    $all(`[data-agent="${agent.id}"]`).forEach(el=>el.remove());
    const roomEl=document.getElementById(`room-${agent.room}`); if(!roomEl) return;
    const pos=anchorPosition(agent.room,agent.anchor); const data=AGENTS[agent.id];
    const node=document.createElement('button');
    node.className=`agent ${agent.status}`; node.dataset.agent=agent.id;
    node.style.left=`${pos.x}px`; node.style.top=`${pos.y}px`;
    node.style.setProperty('--shirt',data.color); node.style.setProperty('--hair',data.hair); node.style.setProperty('--skin',data.skin);
    node.innerHTML=`<span class="agent-bubble">${escapeHtml(data.name)} · ${escapeHtml(bubbleText(agent))}</span><span class="shadow"></span><span class="hair"></span><span class="head"></span><span class="body"></span><span class="laptop"></span>`;
    node.addEventListener('click',()=>openAgentMiniReport(agent.id));
    roomEl.appendChild(node);
  });
}
function bubbleText(agent){ return ({working:'trabajando',meeting:'reunión',lunch:'comiendo',restroom:'baño'})[agent.status]||'activo'; }
function anchorPosition(room,anchor){ return ROOM_LAYOUTS[room]?.anchors?.[anchor]||{x:120,y:120}; }

function startSchedules(){ scheduleTimer=setInterval(runSchedules,9000); }
function runSchedules(){
  const candidates=['milo','vera','nora','kai','iris','echo','atlas','luz'];
  const id=candidates[Math.floor(Math.random()*candidates.length)];
  const roll=Math.random();
  if(roll<0.7) sendHome(id);
  else if(roll<0.82) sendToMeeting(id);
  else if(roll<0.94) sendToLounge(id);
  else sendToRestroom(id);
  renderAgents();
}
function homeAnchor(home,id){ if(home==='youtube') return id==='milo'?'work1':'work2'; if(home==='tiktokDual') return 'work1'; return 'work'; }
function sendHome(id){ const a=agentState[id]; if(!a)return; a.room=a.home; a.status='working'; a.anchor=homeAnchor(a.home,id); renderAgents(); }
function sendToMeeting(id){ const a=agentState[id]; if(!a)return; a.room='meeting'; a.status='meeting'; a.anchor=['a','b','c','d'][Math.floor(Math.random()*4)]; renderAgents(); setTimeout(()=>sendHome(id),9000+Math.random()*5000); }
function sendToLounge(id){ const a=agentState[id]; if(!a)return; a.room='lounge'; a.status='lunch'; a.anchor=['a','b','c'][Math.floor(Math.random()*3)]; renderAgents(); setTimeout(()=>sendHome(id),8000+Math.random()*5000); }
function sendToRestroom(id){ const a=agentState[id]; if(!a)return; a.room='restroom'; a.status='restroom'; a.anchor=Math.random()<.5?'a':'b'; renderAgents(); setTimeout(()=>sendHome(id),5000+Math.random()*3000); }

function openAgentMiniReport(id){
  const home=AGENTS[id].home;
  if(['youtube','tiktokMain','tiktokDual','instagram','spotify','strategy','publishing'].includes(home)) openReport(home,AGENTS[id].name);
  else if(home==='facuCenter') openFacuCenter();
  else openReport('strategy','Sebas');
}

function openReport(key,forcedAgent){
  const sec=studioData.sectors[key]; if(!sec)return;
  openDrawer(`<button class="close" id="drawerClose">×</button><h3>${escapeHtml(sec.title)}</h3><p class="sub">Agente: ${escapeHtml(forcedAgent||sec.agent)} · ${escapeHtml(sec.summary)}</p>
  <div class="metrics">${sec.metrics.map(m=>`<div class="metric"><span>${escapeHtml(m.label)}</span><strong>${escapeHtml(m.value)}</strong></div>`).join('')}</div>
  <div class="block"><h4>Lectura del sector</h4><p>${escapeHtml(sec.summary)}</p></div>
  <div class="block"><h4>Recomendaciones</h4><ul class="report-list">${(sec.recommendations||[]).map(r=>`<li>${escapeHtml(r)}</li>`).join('')}</ul></div>`);
}

function openFacuCenter(){
  const notes=studioData.notifications||[];
  openDrawer(`<button class="close" id="drawerClose">×</button><h3>Centro Facu</h3><p class="sub">Notificaciones, resumen y consulta rápida.</p>
  <div class="block"><h4>Últimas notificaciones</h4>${notes.length?notes.map(n=>`<div class="note-row" style="margin-bottom:8px"><small>${escapeHtml(n.sector)} · ${shortDate(n.date)} · ${n.read?'leída':'nueva'}</small><b>${escapeHtml(n.title)}</b><p>${escapeHtml(n.message)}</p></div>`).join(''):'<p class="empty">No hay notificaciones.</p>'}</div>
  <div class="block"><h4>Consultar a Facu</h4><p>Probá: “¿Qué pasa con YouTube?”, “¿Cómo está DUAL?”, “¿Qué harías hoy?”, “¿Cómo está Spotify?”</p><div class="input-row"><input id="facuQuestion" placeholder="Escribile a Facu..."><button class="primary-btn" id="askFacuBtn">Preguntar</button></div><div id="facuAnswer" class="answer" style="display:none"></div></div>`);
  const merged=readStoredNotifications().map(n=>({...n,read:true})); saveNotifications(merged); studioData.notifications=merged;
  $('#askFacuBtn').addEventListener('click',answerFacu); $('#facuQuestion').addEventListener('keydown',e=>{if(e.key==='Enter')answerFacu();});
}

function answerFacu(){
  const q=($('#facuQuestion')?.value||'').trim().toLowerCase();
  let answer='Estoy revisando todo el studio. Hoy priorizaría sostener YouTube y mejorar la regularidad entre TikTok y DUAL.';
  if(q.includes('youtube')) answer=`YouTube está ${studioData.sectors.youtube.status}. El punto fuerte actual es ${sectorMetric('youtube','Top video')} y la mejor señal de retención es ${sectorMetric('youtube','Retención top')}.`;
  else if(q.includes('dual')) answer=`DUAL está activo, pero todavía chico. Tiene ${sectorMetric('tiktokDual','Seguidores')} seguidores y ${sectorMetric('tiktokDual','Likes totales')} likes. Reforzaría piezas serializadas.`;
  else if(q.includes('spotify')) answer='Spotify ya figura como sector del studio. Por ahora está preparado para crecer cuando sumemos datos ampliados y destaquemos mejor tus lanzamientos.';
  else if(q.includes('hoy')||q.includes('har')) answer='Hoy haría tres cosas: aprovechar la señal de LA BRUJA, mantener vivo TikTok SebasWit con clips musicales y seguir separando bien la identidad de DUAL.';
  else if(q.includes('resumen')) answer='Resumen general: YouTube es la señal más fuerte, TikTok principal acompaña, DUAL necesita más empuje propio, Instagram Nexus todavía es pequeño y Publishing queda preparado para la siguiente etapa.';
  const el=$('#facuAnswer'); el.style.display='block'; el.textContent=answer;
}

function openDrawer(html){
  $('#drawerRoot').innerHTML=`<div class="drawer-backdrop" id="drawerBackdrop"><aside class="drawer">${html}</aside></div>`;
  $('#drawerBackdrop').addEventListener('click',e=>{if(e.target.id==='drawerBackdrop')closeDrawer();});
  $('#drawerClose')?.addEventListener('click',closeDrawer);
}
function closeDrawer(){ $('#drawerRoot').innerHTML=''; }

setInterval(()=>loadData(false),120000);
window.addEventListener('DOMContentLoaded',()=>loadData(false));
