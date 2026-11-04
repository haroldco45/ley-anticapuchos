# Ley Anticapuchos al Día

App ciudadana (PWA) de **Vibras Positivas HM** de seguimiento al proyecto de Ley Anticapuchos en el Congreso de Colombia.

- Repo: `haroldco45/ley-anticapuchos`
- Sitio: https://ley-anticapuchos.netlify.app

## Qué trae
- Sección **Hoy** (se actualiza cada vez que se entra) y botón **Actualizar**
- **Búsqueda en vivo** de noticias al abrir la app
- **Robot** de GitHub Actions que trae noticias reales cada 30 minutos (`.github/workflows/noticias.yml`)
- Artículos del proyecto, calculadora de multas con el salario mínimo 2026, ruta de los 4 debates, las dos posturas
- **Derecho de petición** que se envía de una sola vez a todas las entidades
- Español e inglés
- Imagen de vista previa con foto real (`img/og.jpg`, la crea el robot en la primera corrida)

## Para actualizar el trámite
Edite `data/contenido.js` → `ESTADO`, `TIMELINE`, `ROAD` y `DEBATES_APROBADOS`.
