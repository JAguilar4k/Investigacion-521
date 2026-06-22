# ISW-521: Defensa Tailwind CSS

Repositorio de demostracion para la defensa live coding del curso **ISW-521: Programacion en Ambiente Web I**.

El objetivo de esta entrega es demostrar Tailwind CSS con una arquitectura limpia, accesible y facil de modificar en vivo: HTML semantico, estilos procesados desde Tailwind y JavaScript vanilla separado.

## Demo

Abrir desde el indice local:

```bash
npm install
npm run build:css
npm run serve
```

Luego visitar:

```text
http://127.0.0.1:5173/index.html
```

Tambien puede publicarse como sitio estatico con **GitHub Pages** usando la raiz del repositorio. La pagina de entrada es:

```text
index.html
```

Paginas principales:

- `index.html`: portada de la entrega.
- `tailwind-css-presentacion.html`: presentacion tecnica sobre Tailwind CSS.
- `tailwind-analytics-dashboard-demo.html`: dashboard interactivo de demostracion.

## Estructura

```text
.
|-- index.html
|-- tailwind-css-presentacion.html
|-- tailwind-analytics-dashboard-demo.html
|-- styles.css
|-- app.js
|-- dist/
|   `-- styles.css
|-- docs/
|   |-- README.md
|   |-- entrega-y-rubrica.md
|   `-- guion-presentacion-tailwind-css.md
|-- package.json
|-- package-lock.json
`-- .gitignore
```

## Responsabilidades Por Archivo

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` | Portada navegable de la entrega. |
| `tailwind-css-presentacion.html` | Markup semantico del deck. No contiene scripts ni estilos inline. |
| `tailwind-analytics-dashboard-demo.html` | Markup semantico del dashboard. No contiene handlers inline ni estilos crudos. |
| `styles.css` | Entrada Tailwind v4: `@import`, `@source`, `@theme`, `@custom-variant`, `@layer`. |
| `dist/styles.css` | CSS compilado y minificado para abrir la demo sin depender del CDN. |
| `app.js` | Logica modular vanilla JS: tema, slides, notas, fullscreen, filtros, tabs y estados accesibles. |
| `docs/` | Guion, explicacion de entrega y checklist de rubrica. |

## Rubrica Cubierta

- Separacion de responsabilidades: HTML, CSS y JavaScript viven en archivos independientes.
- HTML5 semantico: uso de `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `figure` y tablas accesibles.
- Tailwind CSS moderno: configuracion CSS-first con Tailwind v4.
- Live coding friendly: `app.js` tiene una zona `LIVE_TUNING` para cambios rapidos.
- Accesibilidad: skip links, foco visible, ARIA, tabs con teclado, dialogo con manejo de foco, `aria-live`, `inert` y reduccion de movimiento.
- Produccion: CSS compilado en `dist/styles.css`, sin CDN ni JavaScript inline.

## Scripts

```bash
npm run build:css
```

Compila `styles.css` hacia `dist/styles.css`.

```bash
npm run watch:css
```

Recompila Tailwind mientras se edita.

```bash
npm run serve
```

Levanta la demo local con Vite.

## Ruta Recomendada Para Revisar

1. Leer este `README.md`.
2. Abrir `index.html`.
3. Revisar la presentacion en `tailwind-css-presentacion.html`.
4. Revisar la demo en `tailwind-analytics-dashboard-demo.html`.
5. Leer [docs/entrega-y-rubrica.md](./docs/entrega-y-rubrica.md).
6. Usar [docs/guion-presentacion-tailwind-css.md](./docs/guion-presentacion-tailwind-css.md) como apoyo para la exposicion.

## Nota De Defensa

La version inicial era una demo autocontenida. Esta version esta organizada como una entrega mantenible: el HTML comunica estructura, Tailwind gobierna el sistema visual y JavaScript controla comportamiento sin mezclar responsabilidades.
