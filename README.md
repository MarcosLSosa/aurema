# Aurema

Catálogo minimalista de tote bags artesanales. Sin backend y sin pasarela de pago: el
carrito se arma en el navegador y el pedido se cierra por WhatsApp.

**Stack:** Vite + React 19 + TypeScript + Tailwind CSS v4 + Zustand.

## Ponerlo en marcha

Pedís Node.js 20 o superior (recomendado el LTS actual). Después:

```bash
npm install
npm run dev
```

Vite levanta en `http://localhost:5173`.

> **Si `npm` no aparece justo después de instalar Node:** el instalador agrega la ruta al
> PATH, pero las terminales que ya estaban abiertas no lo ven. Cerrá la terminal del editor
> (o recargá la ventana) y volvé a intentar. `node -v` y `npm -v` deberían responder.

```bash
npm run build     # genera dist/ listo para subir a cualquier hosting estático
npm run preview   # sirve el build de forma local
npm run typecheck # tsc --noEmit, sin escribir nada en disco
```

## Antes de publicar

Un solo archivo cambia todo: **`src/config.ts`**.

| Campo | Para qué |
| --- | --- |
| `whatsappNumber` | El número que recibe los pedidos, en formato E.164 sin `+` ni espacios (hoy `5492657209503`). |
| `currency` / `locale` | Moneda y formato de los precios (`es-AR` → `$ 28.900`). |
| `shippingFlat` / `freeShippingFrom` | Costo de envío y umbral a partir del cual sale sin cargo. |
| `email`, `instagram`, `location`, `hours` | Pie de página y sección de contacto. |

`src/data/products.ts` es el catálogo. Cada producto puede tener foto real en el campo
`image`; si está vacío, la ficha dibuja un arte SVG generado localmente
(`src/components/ui/ProductArt.tsx`) para que nada dependa de una CDN.

## Cómo cierra una venta

1. El cliente agrega productos; el estado vive en `src/store/cartStore.ts` y persiste en
   `localStorage` (clave `aurema-cart`). Persisten las líneas, el paso del checkout, el
   borrador de los datos y el último pedido armado. No es un detalle fino: el enlace de
   WhatsApp se lleva la pestaña y, al volver con "atrás", el navegador recarga la SPA. Con
   cualquiera de esas partes viviendo sólo en memoria, el cliente volvía y tenía que
   escribir todos sus datos otra vez.
2. En el drawer completa nombre, dirección y ciudad (`CheckoutForm.tsx`). Los campos leen y
   escriben el store, no un `useState` del componente.
3. `src/lib/whatsapp.ts` arma el mensaje con las líneas, el subtotal, el envío y el total y
   lo codifica en dos enlaces: `api.whatsapp.com/send?phone=...&text=...` y su equivalente
   en `web.whatsapp.com/send`. El número sale de `STORE.whatsappNumber` y pasa por
   `normalizePhone`, que también usan los enlaces sueltos de contacto (`buildContactUrl`).
4. `markSent` anota el pedido en el store y recién después se abre el chat: en el celular
   navegando en la misma pestaña, porque el deep link directo a la app rinde mejor que una
   pestaña que cae en el login web; en escritorio clickeando un `<a>` en vez de
   `window.open`, porque si se le pasa `noopener` la spec dice que devuelve `null` incluso
   cuando la ventana abrió, y ese `null` no se puede leer como "el navegador la bloqueó".
5. El panel de confirmación no promete haber abierto nada —un deep link no devuelve esa
   señal— y ofrece tres salidas: reabrir el chat, entrar al chat web (en una PC sin la app
   de escritorio, `api.whatsapp.com` responde "Looks like you don't have WhatsApp
   installed" y no quedaba por dónde seguir) y copiar el mensaje, por si algún dispositivo
   corta el texto precargado. Si la página se recargó, el drawer se reabre solo en el paso
   en que estaba, mientras el pedido no haya vencido (`SENT_ORDER_TTL_MS`).
6. El carrito no se vacía hasta que el cliente aprieta "Ya lo mandé", y tampoco sale nada
   hacia el negocio hasta que apriete enviar en el chat: ahí se confirman precio final y
   medio de pago.

Los totales se calculan en un solo lugar (`computeTotals`) para que el resumen visible y
el mensaje de WhatsApp no puedan divergir.

## El teclado del celular y el botón "Finalizar pedido por WhatsApp"

Había un bug que sólo aparecía en el celular: al escribir los datos personales el
botón del pie desaparecía y no había forma de cerrar el pedido. No era estado ni
render —el botón siempre estaba en el DOM—, era geometría. Chocaban dos cosas
distintas, y cada una necesita su propia defensa:

1. **Android Chrome: el teclado no achica el layout viewport.** Por default el
   teclado se comporta como `interactive-widget: resizes-visual` y encoge sólo el
   *visual* viewport. El drawer es `position: fixed`, se mide contra el layout
   viewport y seguía midiendo la pantalla completa, así que su pie —el total y el
   botón— quedaba enterrado detrás del teclado.
   → `index.html` pide `interactive-widget=resizes-content`; donde no lo entienden,
   responde `src/hooks/useKeyboardAnchoring.ts`.
2. **iOS Safari: auto-zoom en campos chicos.** Si el campo enfocado tiene una fuente
   calculada menor a 16px, iOS zooma la página. El drawer crece, el pie se va por
   debajo del borde, y como el overlay deja el `body` con `overflow: hidden` no hay
   cómo scrollear para recuperarlo: el botón se perdía.
   → los campos del checkout usan `text-base` (16px) en `CheckoutForm.tsx`.

El hook escribe dos variables CSS sobre el panel (`--drawer-top`, `--drawer-height`)
en lugar de guardar algo en el estado de React: el Visual Viewport también dispara
eventos al scrollear, y re-renderizar todo el checkout a 60fps mientras el cliente
tecla es justo lo que no hay que hacer. `--drawer-top` compensa el desplazamiento con
el que iOS mueve el documento para mostrar el campo enfocado, porque los elementos
`fixed` se apoyan en el layout viewport. Sólo actúa cuando la diferencia de altura
supera ~140px —un teclado, no la barra de direcciones que se esconde al scrollear— y
se hace a un lado si el usuario pellizcó para zoomear (`scale > 1.05`).

Ningún truco de viewport llega al 100% de los webviews, así que quedan redes:

- los campos llevan `enterKeyHint` (`next` / `go`) y el `<form>` acepta Enter, o sea
  que la tecla de acción del teclado arma el pedido aunque el botón esté tapado;
- los pies del drawer son `shrink-0` y las zonas con scroll `min-h-0`, para que en un
  viewport bajo el botón se achique o se corte en vez de desaparecer;
- al cerrar el drawer se restaura `window.scrollY`, porque el paneo de iOS dejaba la
  página torcida.

## Estructura

```
src/
  components/
    cart/       CartDrawer, CartLineRow, CheckoutForm
    home/       Hero, Materials
    layout/     Header, Footer
    products/   FilterBar, ProductGrid, ProductCard
    ui/         Icon (SVG inline), ProductArt (arte generado)
  data/         products.ts
  hooks/        useKeyboardAnchoring.ts (el drawer no se esconde tras el teclado)
  lib/          format.ts, whatsapp.ts
  store/        cartStore.ts
  config.ts     datos del local
  types.ts      tipos compartidos
```

Los colores y animaciones del tema están en `src/index.css` dentro del bloque `@theme`
de Tailwind v4 — no hay `tailwind.config.js`.
