# SebasWeb Studios V5

Versión móvil y escritorio con tarjetas de oficina top-down, personajes humanos ilustrados, Facu como centro de notificaciones, informes por sector y NPCs con pausas ocasionales.

## Importante
Esta versión deja `studio.js` en la raíz a propósito. `vercel.json` lo convierte en una función Node y enruta `/api/studio` hacia ese archivo. Así no necesitás crear una carpeta `api` en GitHub.

## Vercel
Agregá la variable privada `WINDSOR_API_KEY` en el proyecto. Sin ella, el sitio funciona en modo seguro con la última snapshot.

## Archivos
- index.html
- styles.css
- app.js
- studio.js
- vercel.json
