# SebasWeb Studios — Vercel

Una oficina virtual para mirar YouTube + TikTok desde un solo lugar.

## Incluye
- 5 agentes visuales: Milo, Vera, Nora, Atlas y Luz.
- 4 agentes activos y Publishing Desk en espera hasta conectar Metricool.
- Cada agente es clickeable y abre métricas + tarea + informe.
- Datos reales de YouTube y TikTok vía Windsor.ai.
- Refresco automático cada 2 minutos.
- Sin frameworks ni dependencias: no hay npm install ni build.
- Doble fallback: si Windsor o la función fallan, la interfaz conserva una snapshot segura.
- Responsive para celular y escritorio.

## Cómo subirlo a Vercel
1. Crear un proyecto nuevo en Vercel y subir/importar esta carpeta (lo más cómodo es GitHub).
2. Framework Preset: **Other** / sin framework.
3. No hace falta Build Command.
4. En **Settings > Environment Variables** crear `WINDSOR_API_KEY` con tu API key de Windsor.ai.
5. Redeploy.

Al principio puede mostrar **SNAPSHOT SEGURO**. Cuando Vercel tenga `WINDSOR_API_KEY`, el cartel cambia automáticamente a **DATOS EN VIVO** si Windsor responde correctamente.

## Seguridad
La API key solo se usa en `api/studio.js`, que corre del lado servidor en Vercel. El navegador nunca recibe la clave.

## Próxima etapa
La oficina `Publishing Desk` ya está preparada visualmente para incorporar Metricool: calendario, borradores, aprobaciones y publicaciones programadas.
