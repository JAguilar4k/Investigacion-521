# Guion De Presentacion Ejecutiva: Tailwind CSS

Este guion acompana la presentacion visual `tailwind-css-presentacion.html`. Esta pensado para una audiencia de desarrolladores Mid/Senior, pero incluye una seccion final de preguntas para aclarar conceptos que un profesor o estudiantes podrian mencionar durante la exposicion.

## Diapositiva 1: Tailwind CSS Como API De Diseno Compilada

Quiero abrir con una idea importante: Tailwind no es simplemente escribir estilos en el HTML. Tailwind funciona mejor cuando lo entendemos como una API de diseno compilada.

En lugar de inventar clases semanticas globales para cada componente, usamos tokens, variantes y utilidades que luego se convierten en CSS estatico, ordenado y optimizado.

La tesis de esta presentacion es que Tailwind no elimina la arquitectura frontend. La desplaza hacia componentes, design tokens, convenciones de equipo y un pipeline de build muy eficiente.

**Transicion:** Para entender por que este cambio importa, comparemos primero los paradigmas que han dominado CSS.

## Diapositiva 2: BEM/OOCSS vs CSS-in-JS vs Utility-First

BEM y OOCSS resolvieron un problema real: dar estructura al CSS global. El costo aparece con el tiempo: nombres que envejecen, clases huerfanas y especificidad acumulada.

CSS-in-JS trajo otra promesa: estilos colocados junto al componente y logica dinamica. Pero tambien introdujo costos de runtime, SSR, hidratacion y dependencia del ecosistema.

Tailwind propone otro punto de equilibrio: clases utilitarias, baja especificidad y generacion por uso real. La semantica no desaparece; vive en el componente, no necesariamente en el nombre de la clase CSS.

**Transicion:** Ahora veamos que dolores concretos intenta mitigar.

## Diapositiva 3: El Problema Era Mantener CSS

El problema historico de CSS en aplicaciones grandes no era escribir una regla. Era saber si podiamos borrarla seis meses despues.

El bundle crece porque nadie esta seguro de que clase sigue en uso. La especificidad se rompe porque cada excepcion exige un selector mas fuerte. Y los nombres semanticos envejecen: una clase llamada `hero-primary` puede terminar aplicada en una tarjeta secundaria.

Tailwind reduce estos problemas porque genera CSS a partir de clases detectadas en el codigo fuente y mantiene selectores muy planos.

**Transicion:** Eso nos lleva al motor que hace posible este modelo.

## Diapositiva 4: Como Piensa El Motor JIT

El motor JIT de Tailwind escanea archivos fuente, detecta strings que parecen clases, resuelve variantes como `hover`, `md` o `dark`, y genera solo el CSS necesario.

Un punto clave: Tailwind no entiende nuestra logica de negocio. No va a inferir una clase escrita como `text-${color}-600`. Necesita ver clases completas como strings.

Por eso, en proyectos reales, los mapas de variantes son una practica senior. En vez de concatenar clases dinamicas, definimos contratos explicitos entre estado de componente y clases validas.

**Transicion:** La consecuencia practica de este pipeline es rendimiento, tanto en desarrollo como en produccion.

## Diapositiva 5: Performance En Tailwind v4

Tailwind v4 mejora mucho el tiempo de build. En benchmarks oficiales sobre Catalyst, un full build baja de 378 milisegundos a 100 milisegundos. Los builds incrementales con CSS nuevo bajan a 5 milisegundos.

El dato mas interesante es el incremental sin CSS nuevo: 192 microsegundos. Eso cambia la experiencia diaria del desarrollador porque guardar un archivo deja de sentirse como esperar al build.

Aqui el valor no es solo velocidad absoluta. Es feedback inmediato, menos friccion y ciclos de UI mas cortos.

**Transicion:** Pero rendimiento no es solo build time. Tambien importa el CSS que llega al navegador.

## Diapositiva 6: Bundle Final, Purga Y Gzip

En produccion, Tailwind genera CSS estatico basado en uso real. En dashboards medianos, una estimacion razonable puede estar entre 25 y 45 KB minificados, o alrededor de 6 a 12 KB gzip. En apps mas grandes, con mas tokens y plugins, puede crecer, pero sigue siendo controlable.

Ordenar clases ayuda a lectura, revision de PRs y consistencia. Puede beneficiar marginalmente a gzip por repeticion de patrones, pero la gran optimizacion es generar menos CSS.

La pregunta correcta no es "cuantas clases escribimos", sino "cuanto CSS final estamos enviando".

**Transicion:** Para controlar eso bien, necesitamos hablar de configuracion y tokens.

## Diapositiva 7: Configuracion Avanzada

En Tailwind v3, `tailwind.config.js` era el centro: `content`, `theme`, `extend`, plugins y dark mode. Una distincion importante es `extend` versus sobrescritura. `extend` suma tokens sin borrar la escala base; sobrescribir reemplaza una parte del sistema.

En Tailwind v4, la direccion es CSS-first: `@theme`, `@custom-variant`, `@utility`, `@source`. Esto acerca los tokens al lenguaje nativo de CSS.

La idea senior aqui es gobernanza: no crear colores por pantalla, sino tokens por intencion. `brand`, `surface`, `risk`, `success`, `muted` escalan mejor que `dashboard-blue-card`.

**Transicion:** Cuando los tokens no alcanzan, entran los plugins.

## Diapositiva 8: Plugins Como Extension Del Lenguaje Visual

Un plugin de Tailwind debe extender el lenguaje visual del equipo, no convertirse en otro framework encima del framework.

`addUtilities` sirve para utilidades estaticas. `matchUtilities` permite generar utilidades dinamicas conectadas al tema. `addComponents` puede ser util para primitivos compartidos, pero debe usarse con cuidado. `matchVariant` ayuda cuando necesitamos variantes parametrizadas.

La pregunta que haria en un PR es: esta abstraccion reduce repeticion real o solo es magia nueva que el equipo tendra que aprender?

**Transicion:** Ahora conectemos esto con accesibilidad, donde Tailwind puede ayudar bastante.

## Diapositiva 9: Accesibilidad Y Estados

Tailwind facilita expresar estados accesibles de forma consistente: `focus-visible`, `focus-within`, `motion-safe`, `motion-reduce`, `aria-selected`, `aria-expanded`, `data-state`.

Pero Tailwind no reemplaza HTML semantico. Si un tab no tiene `role="tab"` y `aria-selected`, la clase `aria-selected:bg-*` no arregla la semantica. Lo mismo con botones, formularios, tablas y navegacion por teclado.

La combinacion correcta es HTML accesible primero, Tailwind para hacer visibles y consistentes esos estados.

**Transicion:** Con eso podemos definir reglas practicas de adopcion.

## Diapositiva 10: Patrones Senior

Para que Tailwind escale, necesitamos convenciones. Primero: evitar interpolar fragmentos de clases. Segundo: extraer componentes cuando una combinacion de utilidades expresa una intencion estable. Tercero: limitar valores arbitrarios a casos justificados.

Tambien debemos tratar los tokens como contrato del sistema de diseno. Si cada pantalla inventa su propio azul, Tailwind no nos salva del caos; solo lo hace mas rapido.

La arquitectura esta en componentes, variantes, tokens, revision de accesibilidad y limites claros de abstraccion.

**Transicion:** Veamos ahora como esos conceptos aparecen en una interfaz concreta.

## Diapositiva 11: Demo Guiada Del Dashboard

En la demo vamos a ver un dashboard de analiticas con modo claro y oscuro. El cambio de tema se hace agregando o quitando `.dark` en el elemento raiz, y Tailwind aplica las variantes correspondientes.

Despues abrimos filtros para ver transiciones controladas por clases. El toggle usa `peer`, los KPIs usan `group` y `data-*`, los tabs usan `aria-selected`, y la tabla muestra estados de foco y hover.

La idea es demostrar que Tailwind no solo sirve para pintar componentes, sino para modelar estados interactivos, responsive design y accesibilidad visual de forma declarativa.

**Transicion:** Cerremos con los criterios que deberiamos llevarnos al trabajo diario.

## Diapositiva 12: Cierre

La conclusion es que Tailwind escala cuando se gobierna como sistema. No basta con instalarlo y escribir utilidades: necesitamos tokens bien nombrados, componentes con intencion, reglas para variantes, accesibilidad verificable y builds de produccion.

Utility-first reduce CSS muerto, reduce especificidad accidental y acelera la iteracion. Pero su valor real aparece cuando el equipo lo usa como lenguaje compartido.

Mi recomendacion final: adopten Tailwind como una capa de diseno compilada, no como una bolsa infinita de clases. Ahi es donde se vuelve una herramienta senior.

# Preguntas Probables Y Respuestas Cortas

## Que Es La Metodologia Utility-First?

Utility-first es una forma de construir interfaces usando clases pequenas y de proposito unico. En vez de crear una clase como `.card-principal`, componemos el estilo con utilidades como `p-4`, `rounded-lg`, `bg-white`, `shadow-sm` o `dark:bg-slate-900`.

La ventaja es que el CSS deja de crecer con nombres personalizados para cada pantalla. La semantica vive en el componente, por ejemplo `PricingCard`, y el estilo se expresa con utilidades reutilizables.

## Utility-First No Es Lo Mismo Que Estilos Inline?

No. Los estilos inline van en el atributo `style` y suelen tener alta prioridad, poca reutilizacion y limitaciones para responsive, pseudo-clases y media queries.

Tailwind usa clases CSS reales. Eso permite usar `hover:`, `focus-visible:`, `md:`, `dark:`, `motion-safe:` y otras variantes. Ademas, el resultado final es CSS estatico generado por el build.

## Que Es JIT?

JIT significa Just-In-Time. En Tailwind, se refiere a generar las clases CSS cuando el motor las detecta en los archivos fuente, en lugar de generar una hoja enorme con todas las clases posibles.

Por ejemplo, si el codigo usa `bg-brand-500`, Tailwind genera esa utilidad. Si nunca usamos `bg-purple-900`, no tiene por que terminar en el CSS final.

## Como Se Aplica JIT A Tailwind?

Tailwind escanea archivos como HTML, JSX, TSX, Vue, Svelte o Markdown. Busca strings que parezcan clases, resuelve variantes y genera CSS para esas clases.

Por eso es importante escribir clases completas. Esto funciona:

```js
const tone = {
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-rose-100 text-rose-700",
};
```

Esto es problematico:

```js
const className = `text-${color}-700`;
```

Tailwind puede no detectar esas clases porque no aparecen completas en el codigo fuente.

## Que Es JSX?

JSX es una sintaxis usada normalmente con React que permite escribir una estructura parecida a HTML dentro de JavaScript o TypeScript.

Ejemplo:

```jsx
function Button() {
  return <button className="rounded-md bg-slate-950 px-4 py-2 text-white">Guardar</button>;
}
```

Aunque se parece a HTML, JSX se transforma a llamadas de JavaScript que crean elementos de UI.

## Que Es TSX?

TSX es JSX usando TypeScript. Es decir, permite escribir componentes con sintaxis tipo HTML y ademas tener tipado estatico.

Ejemplo:

```tsx
type ButtonProps = {
  label: string;
};

function Button({ label }: ButtonProps) {
  return <button className="px-4 py-2">{label}</button>;
}
```

## Que Es Un AST?

AST significa Abstract Syntax Tree, o arbol de sintaxis abstracta. Es una representacion estructurada del codigo que usan compiladores, linters y herramientas de analisis.

Por ejemplo, una herramienta puede leer una funcion JavaScript y convertirla en un arbol de nodos: declaracion de funcion, parametros, cuerpo, llamadas, literales, etc.

En el contexto de Tailwind, es importante mencionar que Tailwind no necesita entender todo el AST de tu aplicacion para detectar clases. Principalmente analiza el contenido fuente y extrae candidatos de clase como texto.

## Que Es Una Variante En Tailwind?

Una variante es un prefijo que modifica cuando se aplica una utilidad.

Ejemplos:

```html
<button class="bg-slate-900 hover:bg-slate-700 focus-visible:ring-4 md:px-6">
  Guardar
</button>
```

Aqui `hover:` aplica el estilo al pasar el mouse, `focus-visible:` cuando el elemento recibe foco visible, y `md:` desde cierto breakpoint responsive.

## Que Es Dark Mode En Tailwind?

Dark mode en Tailwind se maneja con la variante `dark:`. Por ejemplo:

```html
<section class="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
  Contenido
</section>
```

En Tailwind v4 se puede definir una variante personalizada para que `dark:` dependa de una clase `.dark` en el HTML:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Asi, JavaScript puede cambiar el tema agregando o quitando `.dark` en el elemento raiz.

## Que Son `group` Y `peer`?

`group` permite cambiar estilos de un hijo cuando el padre esta en cierto estado.

```html
<article class="group">
  <span class="group-hover:scale-105">KPI</span>
</article>
```

`peer` permite cambiar estilos de un elemento hermano segun el estado de otro.

```html
<input class="peer" type="checkbox" />
<span class="peer-checked:bg-brand-500"></span>
```

Son utiles para interactividad visual sin escribir JavaScript adicional.

## Que Son Clases Arbitrarias?

Son clases donde usamos un valor especifico que no esta necesariamente en la escala del tema.

Ejemplos:

```html
<span class="top-[13px] bg-[#1a202c]/50"></span>
```

Son utiles para casos puntuales, pero si se repiten mucho probablemente deberian convertirse en tokens del sistema de diseno.

## Tailwind Reemplaza CSS?

No completamente. Tailwind reduce la necesidad de escribir CSS personalizado para la mayoria de layouts, estados y estilos comunes. Pero todavia puede ser necesario CSS para animaciones complejas, integraciones con terceros, estilos globales, temas avanzados o casos muy especificos.

La idea no es dejar de saber CSS. Al contrario: Tailwind se usa mejor cuando se entiende bien CSS.

## Tailwind Es Bueno Para Proyectos Grandes?

Si, pero con convenciones. En proyectos grandes hay que definir tokens, componentes, reglas de variantes, ordenamiento de clases y criterios de accesibilidad.

Sin disciplina, Tailwind puede volverse ruido en el markup. Con disciplina, reduce CSS muerto, acelera iteracion y hace mas predecibles los cambios visuales.

## Por Que No Usar El CDN En Produccion?

El CDN de Tailwind es excelente para prototipos, clases, demos o archivos HTML autocontenidos. Pero en produccion conviene usar Vite, CLI, PostCSS u otra integracion de build.

El build de produccion permite optimizar deteccion de clases, minificar, integrar con el pipeline del proyecto y evitar depender del compilador en el navegador del usuario.

## Que Es Purge O Purging?

Purge es el proceso de eliminar CSS que no se usa. En versiones modernas, Tailwind genera principalmente lo que detecta en los archivos fuente, asi que el concepto se integra al pipeline de generacion.

El resultado es que el CSS final suele ser mucho mas pequeno que una libreria tradicional que envia todos sus estilos posibles.

## Que Diferencia Hay Entre `extend` Y Sobrescribir El Tema?

En Tailwind v3, `theme.extend` agrega valores a la escala existente. Por ejemplo, podemos agregar `brand` sin borrar los colores por defecto.

Sobrescribir directamente una clave de `theme` reemplaza esa escala. Eso puede ser correcto en un design system muy controlado, pero tambien puede romper utilidades que el equipo espera tener disponibles.

## Como Responder Si Preguntan: "No Ensucia El HTML?"

Respuesta sugerida:

Puede verse mas denso, pero no necesariamente mas desordenado. En Tailwind, el HTML muestra explicitamente las decisiones visuales del componente. En proyectos reales, esa densidad se controla extrayendo componentes y usando mapas de variantes.

La comparacion justa no es una linea de HTML contra una clase BEM corta. La comparacion justa incluye el CSS externo, su mantenimiento, su especificidad y el riesgo de reglas huerfanas.

## Como Responder Si Preguntan: "Entonces Ya No Necesito BEM?"

Respuesta sugerida:

No de la misma forma. Tailwind reduce la necesidad de crear clases BEM para cada bloque visual. Pero la idea de componentes con responsabilidad clara sigue siendo valida.

En vez de `.pricing-card__title`, probablemente tengamos un componente `PricingCardTitle` o una estructura semantica dentro de `PricingCard`.

## Como Responder Si Preguntan: "Tailwind Es Una Mala Practica Porque Mezcla HTML Y CSS?"

Respuesta sugerida:

Tailwind mezcla estructura y presentacion de forma controlada, pero no mezcla comportamiento complejo ni reglas globales impredecibles. Es un intercambio consciente.

En frameworks modernos, los componentes ya agrupan markup, estado y comportamiento. Tailwind coloca las decisiones visuales cerca del componente y deja que el build genere CSS estatico.

## Como Responder Si Preguntan: "Que Pasa Si Cambio El Diseno Completo?"

Respuesta sugerida:

Si el proyecto uso tokens correctamente, muchos cambios se hacen modificando el tema: colores, spacing, fuentes, radios, sombras o breakpoints. Si el proyecto abuso de valores arbitrarios y clases sin convencion, el cambio sera mas costoso.

La facilidad de redisenar depende menos de Tailwind en si y mas de la calidad del sistema de tokens y componentes.

## Como Responder Si Preguntan: "Cual Es La Principal Desventaja?"

Respuesta sugerida:

La principal desventaja es que exige disciplina visual y convenciones de equipo. Sin componentes, sin tokens y sin reglas, el markup puede volverse dificil de leer.

Tambien requiere que los desarrolladores entiendan CSS. Tailwind acelera, pero no sustituye fundamentos.

## Cierre Para Preguntas

Si aparece una pregunta tecnica inesperada, una buena forma de responder es volver a estos tres principios:

1. Tailwind genera CSS estatico a partir de clases detectadas.
2. La semantica de negocio debe vivir en componentes y HTML accesible.
3. La escalabilidad depende de tokens, convenciones y revisiones de equipo.

# Agregado: Explicacion Del Refactor Del Codigo

Esta seccion sirve para explicar que se hizo tecnicamente en el repositorio despues de pasar de una demo inicial a una version mas cercana a produccion.

La idea central del refactor fue separar responsabilidades. Antes, los archivos HTML tenian configuracion de Tailwind, estilos y JavaScript directamente dentro del documento. Eso funcionaba para una demo rapida, pero no era ideal para una defensa donde se evalua arquitectura. Ahora el HTML describe la estructura, `styles.css` contiene el sistema visual procesado por Tailwind y `app.js` contiene todo el comportamiento interactivo.

## 1. Estructura General Del Proyecto

Se agregaron y organizaron estos archivos:

```text
index.html
tailwind-css-presentacion.html
tailwind-analytics-dashboard-demo.html
styles.css
app.js
dist/styles.css
package.json
package-lock.json
.gitignore
```

`index.html` funciona como punto de entrada del proyecto. Desde ahi se puede abrir la presentacion o el dashboard. Esto ayuda a que el repositorio se vea como una entrega completa, no como dos archivos sueltos.

`tailwind-css-presentacion.html` quedo como el deck de diapositivas. Su responsabilidad es declarar contenido semantico: `header`, `nav`, `main`, `article`, `section`, `aside` y `footer`.

`tailwind-analytics-dashboard-demo.html` quedo como la demo interactiva. Tambien usa HTML semantico y atributos accesibles para tabs, filtros, formularios, tablas y navegacion.

`styles.css` es la entrada real de Tailwind. Alli se definen tokens, variantes, estilos base, componentes y utilidades propias.

`app.js` concentra toda la logica de interaccion: tema claro/oscuro, navegacion de slides, notas del orador, pantalla completa, filtros, tabs, busqueda, exportacion simulada y mensajes accesibles.

`dist/styles.css` es el CSS compilado. Es el archivo que consumen los HTML en el navegador.

`package.json` agrega scripts para compilar Tailwind y levantar el servidor local.

`.gitignore` evita subir `node_modules`, que es una carpeta generada por npm.

## 2. Que Cambio En Los HTML

El cambio mas importante fue eliminar todo lo que no pertenecia al HTML.

Se quitaron:

```html
<script>
  // logica dentro del HTML
</script>

<style type="text/tailwindcss">
  /* configuracion dentro del HTML */
</style>

style="height: 52%"
```

Tambien se evitaron manejadores inline como:

```html
onclick="..."
onchange="..."
oninput="..."
```

Ahora los documentos solo enlazan recursos externos:

```html
<script src="./app.js"></script>
<link rel="stylesheet" href="./dist/styles.css?v=20260621" />
```

La version en el `href` del CSS ayuda a evitar cache durante la defensa. Si se recompila el CSS, el navegador tiene una senal clara para pedir la version nueva.

Otra mejora fue usar marcas semanticas. En vez de depender de contenedores genericos, la estructura comunica intencion:

```html
<header>
  <nav></nav>
</header>

<main>
  <article></article>
  <section></section>
</main>

<footer></footer>
```

En la presentacion, cada diapositiva es un `article` porque representa una unidad independiente de contenido. Las notas del orador viven en un `aside` porque complementan el contenido principal.

En el dashboard, el panel lateral es un `aside`, la zona principal es `main`, los KPIs son `article`, la tabla tiene `caption`, `thead`, `tbody`, `th scope="col"` y `th scope="row"`.

## 3. Que Cambio En `styles.css`

`styles.css` demuestra el modelo moderno de Tailwind CSS v4.

En Tailwind v3 se usaban normalmente estas directivas:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

En Tailwind v4 el modelo recomendado es CSS-first:

```css
@import "tailwindcss";
```

Despues se declaran las fuentes que Tailwind debe escanear:

```css
@source "./*.html";
@source "./app.js";
```

Esto es importante porque el motor de Tailwind necesita detectar clases completas en los archivos fuente para generar el CSS final.

Tambien se define la variante de modo oscuro:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Con esto, las clases `dark:*` dependen de que exista una clase `.dark` en el elemento raiz. JavaScript solo cambia el estado; Tailwind decide como se ve ese estado.

Los tokens visuales viven en `@theme`:

```css
@theme {
  --color-brand-500: #06b6d4;
  --color-risk-700: #be123c;
  --color-focus: #f59e0b;
  --shadow-panel: 0 18px 50px -30px rgb(15 23 42 / 0.45);
}
```

La ventaja de esto es que los colores no se nombran por pantalla, sino por intencion. Por ejemplo, `brand`, `success`, `risk` y `focus` explican el rol visual dentro del sistema.

Luego se usan capas:

```css
@layer base {}
@layer components {}
@layer utilities {}
```

En `@layer base` se definieron reglas globales de bajo nivel: fondo, color de texto, tipografia, seleccion de texto, foco visible y reduccion de movimiento.

El foco visible es clave para accesibilidad:

```css
button,
input,
select,
a {
  @apply focus-visible:outline-none focus-visible:ring-4;
}
```

Esto garantiza que los usuarios que navegan con teclado puedan ver donde estan.

En `@layer components` se agruparon clases semanticas reutilizables, como:

```css
.button
.button-primary
.button-secondary
.site-header
.deck-slide
.surface-card
.dashboard-sidebar
.tab-button
.metric-card
```

Esto evita repetir cadenas enormes de utilidades cuando el patron ya tiene una intencion estable.

En `@layer utilities` se agregaron utilidades puntuales:

```css
.text-balance
.content-auto
.animate-slide-in
.animate-fade-in
```

Tambien se movieron animaciones a CSS:

```css
@keyframes slideIn {}
@keyframes fadeIn {}
```

Una decision importante fue no usar `style="height: 52%"` en las barras del dashboard. En su lugar, se usan clases Tailwind:

```html
<span class="chart-bar-fill h-[52%]"></span>
```

Asi se mantiene la separacion de responsabilidades y Tailwind puede detectar el valor arbitrario como una clase real.

## 4. Que Cambio En `app.js`

`app.js` se diseno para sobrevivir cambios en vivo durante la defensa.

La parte mas importante esta arriba del archivo:

```js
const LIVE_TUNING = Object.freeze({
  theme: {},
  deck: {},
  dashboard: {},
  messages: {},
});
```

Esta es el area de modificacion rapida. Si el profesor pide cambiar una tecla, el slide inicial, un mensaje de error, el tab por defecto o el tiempo de exportacion, se modifica esa configuracion sin tocar el resto de la logica.

Tambien se definio un objeto de selectores:

```js
const SELECTORS = Object.freeze({
  shared: {},
  deck: {},
  dashboard: {},
});
```

Esto evita tener selectores repartidos por todo el archivo. Si cambia un atributo en el HTML, se actualiza en un solo lugar.

La aplicacion detecta que pagina esta abierta con:

```js
const pageName = root.dataset.app || "index";
```

Cada HTML declara su tipo:

```html
<html data-app="presentation">
<html data-app="dashboard">
```

Gracias a eso, el mismo `app.js` puede inicializar solo la logica que corresponde a cada pagina.

## 5. Tema Claro/Oscuro

El tema se maneja agregando o quitando la clase `.dark` en el elemento raiz:

```js
root.classList.toggle("dark", shouldUseDark);
```

El estado se guarda en `localStorage`, pero con `try/catch` para evitar que el sitio falle si el navegador bloquea almacenamiento:

```js
try {
  window.localStorage.setItem(key, value);
} catch (error) {
  console.warn("No se pudo escribir localStorage.", error);
}
```

Esta es una practica defensiva. En una demo academica muestra que se pensaron estados inesperados.

## 6. Logica De La Presentacion

La presentacion tiene un modulo propio dentro de `app.js`.

Primero se capturan las diapositivas:

```js
const slides = Array.from(deck.querySelectorAll("[data-slide]"));
```

Luego se genera la navegacion de puntos automaticamente:

```js
buildSlideDots(dots, slides.length);
```

Esto significa que si se agrega una diapositiva nueva en vivo, no hay que escribir manualmente otro boton en el footer. El JavaScript lee la cantidad de slides y crea los controles.

La funcion principal es:

```js
function showSlide(index, options = {}) {}
```

Esa funcion:

1. Calcula el indice correcto.
2. Oculta las diapositivas inactivas.
3. Muestra la diapositiva activa.
4. Sincroniza las notas del orador.
5. Actualiza los puntos de navegacion.
6. Actualiza el contador.
7. Opcionalmente mueve el foco a la diapositiva.

Tambien se soportan atajos de teclado:

```text
ArrowRight / PageDown / Space: siguiente
ArrowLeft / PageUp: anterior
Home: primera diapositiva
End: ultima diapositiva
N: notas
D: tema
F: pantalla completa
```

Estos atajos estan en `LIVE_TUNING.deck.shortcuts`, por eso se pueden cambiar rapidamente.

## 7. Notas Del Orador Y Focus Trap

Las notas del orador se implementaron como un dialogo accesible:

```html
<aside role="dialog" aria-modal="true">
```

Cuando se abren las notas, el foco se mueve al boton "Cerrar". Cuando se cierran, el foco vuelve al elemento anterior.

Tambien se implemento una trampa de foco:

```js
trapFocusInsideDialog(event, notesDialog, closeNotesCallback);
```

Esto evita que el usuario quede navegando con Tab por elementos detras del dialogo. Es importante para accesibilidad y para demostrar manejo de foco.

## 8. Pantalla Completa

La presentacion incluye modo de pantalla completa con la Fullscreen API:

```js
await root.requestFullscreen();
await document.exitFullscreen();
```

Si el navegador no soporta esa API, el boton se deshabilita y se comunica el estado:

```js
fullscreenToggle.disabled = true;
fullscreenToggle.textContent = "No disponible";
```

Esto demuestra manejo de capacidades del navegador y estados de error.

## 9. Logica Del Dashboard

El dashboard tiene tres interacciones principales: filtros, tabs y controles de formulario.

El panel de filtros usa `aria-expanded`, `aria-hidden`, `data-state` e `inert`.

```js
filtersToggle.setAttribute("aria-expanded", String(shouldOpen));
filtersPanel.dataset.state = shouldOpen ? "open" : "closed";
filtersPanel.setAttribute("aria-hidden", String(!shouldOpen));
filtersPanel.inert = !shouldOpen;
```

`inert` evita que el teclado entre a controles ocultos. Esto mejora accesibilidad porque no basta con ocultar visualmente un panel; tambien hay que evitar foco accidental.

Los tabs usan el patron accesible de tablist:

```html
<nav role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel-overview">
</nav>
```

Cada panel esta enlazado con su tab:

```html
<section role="tabpanel" aria-labelledby="tab-overview">
```

El JavaScript aplica roving tabindex. Solo el tab activo queda con `tabIndex = 0`; los demas quedan en `-1`. Con flechas se cambia de tab:

```text
ArrowRight / ArrowDown
ArrowLeft / ArrowUp
Home
End
```

Esto es mas accesible que hacer tabs que solo funcionan con click.

El rango de confianza actualiza un `output`:

```js
output.textContent = `${range.value}%`;
```

La busqueda valida longitud minima antes de anunciar exito:

```js
if (query.length < LIVE_TUNING.dashboard.searchMinimumLength) {
  announceDashboardStatus("Escribe al menos 2 caracteres para buscar.");
}
```

El boton de exportacion simula un estado de proceso:

```js
exportButton.disabled = true;
window.setTimeout(() => {
  exportButton.disabled = false;
}, LIVE_TUNING.dashboard.exportDelayMs);
```

Esto permite explicar como manejar estados asincronos sin framework.

## 10. Accesibilidad Aplicada

El refactor incluye varias decisiones de accesibilidad:

1. Enlaces de salto al contenido principal.
2. Foco visible global de alto contraste.
3. HTML semantico.
4. Botones reales para acciones.
5. Enlaces reales para navegacion.
6. Tablas con encabezados y `caption`.
7. Tabs con roles ARIA correctos.
8. Dialogo de notas con manejo de foco.
9. `aria-live` para mensajes de estado.
10. `inert` para evitar foco dentro de filtros cerrados.
11. `prefers-reduced-motion` para usuarios sensibles al movimiento.
12. Contraste alto en claro y oscuro.

Una frase util para defender esto:

> Tailwind no hace accesible una interfaz por si solo. Lo que hace es permitir expresar estados accesibles de forma consistente. La accesibilidad empieza en HTML semantico y manejo correcto del foco.

## 11. Produccion Y Build

Se agrego `package.json` con scripts:

```json
{
  "build:css": "tailwindcss -i ./styles.css -o ./dist/styles.css --minify",
  "watch:css": "tailwindcss -i ./styles.css -o ./dist/styles.css --watch",
  "serve": "vite --host 127.0.0.1"
}
```

`build:css` compila Tailwind y genera el CSS minificado.

`watch:css` sirve para desarrollo, recompilando cuando cambian archivos.

`serve` levanta un servidor local con Vite para probar el proyecto como sitio web real.

Esta parte demuestra que ya no dependemos del CDN de Tailwind en el navegador. El resultado final es CSS estatico, compilado y cacheable.

## 12. Como Explicarlo En La Defensa

Una forma corta de presentarlo seria:

> Refactorice la demo para separar estructura, presentacion y comportamiento. Los HTML ahora son documentos semanticos y accesibles. Tailwind vive en `styles.css` usando el modelo CSS-first de v4 con `@theme`, `@custom-variant`, `@source` y `@layer`. Toda la interaccion esta en `app.js`, con constantes de configuracion al inicio para poder modificar parametros rapidamente en vivo. Ademas, agregue controles accesibles de teclado, manejo de foco, estados ARIA, reduccion de movimiento y un build real que genera `dist/styles.css`.

Si el profesor pregunta por que esto es mejor que la version inicial:

> La version inicial era buena como prototipo, pero mezclaba responsabilidades. Esta version es mas mantenible porque cada archivo tiene una responsabilidad clara. Tambien es mas facil de modificar en vivo porque los parametros importantes estan centralizados, y es mas segura para accesibilidad porque los estados de UI estan sincronizados con atributos ARIA y manejo de foco.

Si el profesor pide cambiar algo en vivo:

1. Cambiar texto, orden o contenido: editar el HTML semantico.
2. Cambiar colores, tokens, foco o componentes visuales: editar `styles.css`.
3. Cambiar atajos, mensajes, tab inicial, slide inicial o tiempos: editar `LIVE_TUNING` en `app.js`.
4. Si se agregan clases nuevas: ejecutar `npm.cmd run build:css`.

## 13. Checklist Final De Rubrica

Separacion de responsabilidades:

```text
HTML = estructura y contenido
CSS = Tailwind, tokens, capas y estilos visuales
JS = comportamiento e interaccion
```

HTML semantico:

```text
header, nav, main, section, article, aside, footer, figure, table
```

Accesibilidad:

```text
skip links, focus visible, aria-expanded, aria-selected, aria-live,
role="tablist", role="tab", role="tabpanel", role="dialog", inert
```

Tailwind moderno:

```text
@import "tailwindcss"
@source
@theme
@custom-variant
@layer base/components/utilities
```

Preparacion para live coding:

```text
LIVE_TUNING
SELECTORS centralizados
funciones pequenas
mensajes configurables
controles generados dinamicamente
```
