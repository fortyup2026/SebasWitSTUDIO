# SebasWeb Studios V11 Pro

Versión V11 centrada en NPCs integrados al escenario y lógica operativa realista.

## Qué cambia respecto de V10
- NPCs más chicos y apoyados visualmente sobre el piso.
- Sin círculos verdes ni globos sobre las caras.
- Sin animación de “caminar” por encima del mapa.
- Los personajes quedan quietos en el lugar que corresponde a su estado actual.
- Cambian de sector por horario: puesto, reunión, comedor o baño.
- Los sectores generan análisis y recomendaciones automáticamente mediante reglas basadas en datos.
- Atlas cruza señales y Facu centraliza prioridades/notificaciones.
- Notificaciones se conservan 10 días en el navegador.
- Spotify ya tiene cargado el Artist ID de SebasWit: `2cwOzKJ4rzzlurBGmcOUYz`.

## Archivos
Subí TODOS estos archivos a la raíz del repositorio GitHub:
- index.html
- styles.css
- app.js
- studio.js
- vercel.json
- studio-map.png
- npc-sebas.png
- npc-facu.png
- npc-chevy.png
- npc-vera.png
- npc-nora.png
- npc-luca.png
- npc-iris.png
- npc-echo.png
- npc-atlas.png
- npc-luz.png

## Vercel
Para datos Windsor en vivo:
`WINDSOR_API_KEY`

Para Spotify ampliado:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`

`SPOTIFY_ARTIST_ID` es opcional porque V11 ya usa por defecto `2cwOzKJ4rzzlurBGmcOUYz`.

Sin las credenciales Spotify, el perfil queda igualmente identificado y enlazado; con ellas se habilitan datos públicos ampliados disponibles por la Web API.
