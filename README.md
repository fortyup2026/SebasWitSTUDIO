# SebasWeb Studios V2

Oficina virtual conectada a Windsor.ai para seguir YouTube, dos cuentas de TikTok, Instagram, Facebook y proyectos web.

## V2
- Fondo universo sutil y animado.
- Agentes ilustrados con rasgos humanos, accesorios y estilos individuales.
- Dos escritorios TikTok separados: SebasWit y SERIES NEXUS IA.
- Instagram Nexus conectado como oficina propia.
- Panel de conexiones con Facebook y Google Analytics.
- Drawer clickeable por agente con métricas, tarea e informe.
- API tolerante a fallos: una fuente caída no derriba toda la oficina.
- Snapshot de seguridad si falta Windsor o una consulta no responde.
- Responsive para celular y escritorio.

## Vercel
No usa frameworks ni build. Vercel sirve los archivos estáticos y `api/studio.js` como función serverless.

### Variable necesaria
En Vercel > Settings > Environment Variables:

`WINDSOR_API_KEY=<tu API key de Windsor.ai>`

No pongas la API key dentro de ningún archivo del repositorio.

## Datos
La interfaz consulta `/api/studio` cada 2 minutos. La función consulta Windsor.ai y devuelve el último dato disponible. Algunas APIs de redes sociales pueden tener demora propia.
