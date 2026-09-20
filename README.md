# SebasWeb Studios V6

Versión isométrica/pseudo-3D con oficina virtual, sectores clickeables, NPCs ilustrados, Facu como centro de coordinación, informes por área y notificaciones locales por 10 días.

## Archivos
- `index.html`
- `styles.css`
- `app.js`
- `studio.js`
- `vercel.json`

## Vercel
Reemplazá los archivos actuales del repositorio por estos cinco archivos. `studio.js` queda en la raíz y `vercel.json` lo expone como `/api/studio`.

### Variable necesaria para datos de Windsor
`WINDSOR_API_KEY`

### Spotify opcional
Si querés datos del perfil de artista vía Spotify Web API:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_ARTIST_ID`

Sin esas variables, la oficina Spotify queda visible en modo parcial.

## Comportamiento
- PC/tablet: vista isométrica completa y clickeable.
- Móvil: tarjetas optimizadas para no cortar contenido ni obligar a arrastrar toda la empresa.
- Los NPCs trabajan casi siempre en su área. Ocasionalmente van a reunión, comedor o baño y luego regresan.
