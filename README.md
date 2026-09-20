# SebasWeb Studios V4

Versión con salas top-down en tarjetas, agentes ilustrados, Centro Facu, informes por sector y movimiento ocasional entre trabajo, reunión, comedor y baño.

## Archivos

- `index.html`
- `styles.css`
- `app.js`
- `vercel.json`
- `api/studio.js`

## Vercel

Cargar como proyecto estático con Functions. La función principal está en `api/studio.js`.

Para datos en vivo desde Windsor, agregar en Vercel:

`WINDSOR_API_KEY`

Si no está disponible o falla Windsor, la interfaz usa datos seguros de respaldo para no romperse.
