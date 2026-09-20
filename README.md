# SebasWeb Studios V3

Empresa virtual interactiva para Vercel.

## Qué incluye
- Edificio top-down sin techo, movible y con zoom.
- Oficina de Sebas, Centro Facus, ascensor, entrada/salida, comedor y sala de reunión.
- Sectores: YouTube, TikTok SebasWit, TikTok DUAL/Nexus, Instagram, Spotify, Estrategia y Publishing.
- NPCs que caminan entre oficinas, Facus, comedor, ascensor y sala de reunión.
- Informe individual por sector y por agente.
- Centro Facus con notificaciones persistentes en el navegador durante 10 días.
- Auto-refresh cada 2 minutos y al abrir la página.
- Fallback seguro si una fuente falla.

## Estructura
```
index.html
styles.css
app.js
api/studio.js
vercel.json
```

## Subir a Vercel
1. Reemplazá los archivos del repo `SebasWitSTUDIO` con estos.
2. IMPORTANTE: `studio.js` ya no va en la raíz. La función debe estar exactamente en `api/studio.js`.
3. En Vercel usa Framework Preset: Other. No requiere build command.
4. En Project Settings > Environment Variables agrega:
   - `WINDSOR_API_KEY` = tu API key de Windsor.ai
5. Redeploy.

## Spotify (opcional)
El sector está preparado. Para activarlo agrega en Vercel:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_ARTIST_ID`

Sin esas variables el edificio sigue funcionando y Spotify queda como pendiente.

## Cómo comprobar la API
Abrí:
`https://TU-PROYECTO.vercel.app/api/studio`

Debe devolver JSON. Si devuelve 404, `api/studio.js` no está en la carpeta correcta.

## Notificaciones
Se guardan en `localStorage` del dispositivo durante 10 días. Esto evita exigir una base de datos para esta versión. Si después querés que las mismas notificaciones se sincronicen entre celular y computadora, la siguiente mejora es moverlas a una base de datos compartida.
