# Entrega Y Rubrica

Este documento resume como esta organizada la entrega y que evidencias puede revisar el profesor directamente en GitHub.

## 1. Separacion De Responsabilidades

La entrega separa estructura, presentacion y comportamiento:

```text
HTML  -> contenido y semantica
CSS   -> Tailwind, tokens, capas y componentes visuales
JS    -> interaccion y estado
```

Evidencias:

- `tailwind-css-presentacion.html` y `tailwind-analytics-dashboard-demo.html` no tienen scripts inline.
- No hay handlers como `onclick`, `onchange` u `oninput`.
- No hay bloques `<style>` dentro del HTML.
- El comportamiento esta concentrado en `app.js`.
- El sistema visual esta concentrado en `styles.css`.

## 2. HTML5 Semantico

La entrega usa etiquetas semanticas para comunicar intencion:

```text
header, nav, main, section, article, aside, footer, figure, table
```

Evidencias:

- Cada slide de la presentacion es un `article`.
- Las notas del orador viven en un `aside`.
- El dashboard usa `main` para contenido principal y `aside` para navegacion contextual.
- La tabla del dashboard tiene `caption`, encabezados de columna y encabezados de fila.

## 3. Tailwind CSS Moderno

`styles.css` usa Tailwind CSS v4 con configuracion CSS-first:

```css
@import "tailwindcss";
@source "./*.html";
@source "./app.js";
@custom-variant dark (&:where(.dark, .dark *));
@theme {}
@layer base {}
@layer components {}
@layer utilities {}
```

Evidencias:

- Los tokens visuales estan centralizados en `@theme`.
- El modo oscuro se controla con la variante `dark`.
- Las clases semanticamente repetidas se agrupan en `@layer components`.
- El CSS final se genera en `dist/styles.css`.

## 4. Preparacion Para Live Coding

`app.js` tiene una zona clara para cambios en vivo:

```js
const LIVE_TUNING = Object.freeze({
  theme: {},
  deck: {},
  dashboard: {},
  messages: {},
});
```

Evidencias:

- Atajos de teclado configurables.
- Slide inicial configurable.
- Tab inicial configurable.
- Mensajes de error y estado centralizados.
- Tiempos de simulacion configurables.
- Selectores centralizados en `SELECTORS`.

## 5. Accesibilidad

La entrega aplica patrones de accesibilidad para teclado y lectores de pantalla.

Evidencias:

- Enlaces de salto al contenido principal.
- Foco visible global.
- `aria-live` para mensajes de estado.
- Tabs con `role="tablist"`, `role="tab"` y `role="tabpanel"`.
- Navegacion de tabs con flechas, Home y End.
- Dialogo de notas con `role="dialog"` y manejo de foco.
- `aria-expanded` y `aria-hidden` sincronizados en filtros y notas.
- Uso de `inert` para evitar foco en controles ocultos.
- Respeto a `prefers-reduced-motion`.

## 6. Comandos De Verificacion

```bash
npm install
npm run build:css
node --check app.js
npm run serve
```

Validaciones realizadas durante el refactor:

- Compilacion correcta de Tailwind.
- Revision de sintaxis de JavaScript.
- Verificacion de que no existan scripts, estilos o handlers inline.
- Prueba de interacciones principales en navegador local.
- Verificacion de layout movil sin overflow horizontal.

## 7. Como Presentar La Arquitectura

Frase recomendada:

> La entrega esta organizada para que cada tecnologia tenga una responsabilidad clara. HTML declara estructura accesible, Tailwind define el sistema visual compilado y JavaScript maneja estado e interaccion de forma modular. Esto permite defender el codigo, modificarlo en vivo y mantenerlo sin mezclar responsabilidades.
