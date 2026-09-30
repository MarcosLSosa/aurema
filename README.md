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
   `localStorage` (clave `aurema-cart`), así que aguanta un F5.
2. En el drawer completa nombre, dirección y ciudad (`CheckoutForm.tsx`).
3. `src/lib/whatsapp.ts` arma el mensaje con las líneas, el subtotal, el envío y el total,
   y lo codifica en un enlace `api.whatsapp.com/send?phone=...&text=...`. El número sale de
   `STORE.whatsappNumber` y pasa por `normalizePhone`, que también usan los enlaces sueltos
   de contacto (`buildContactUrl` en footer y CTA).
4. Se abre WhatsApp con el texto escrito: en el celular en la misma pestaña, porque el deep
   link directo a la app rinde mejor que una pestaña que cae en el login web. En escritorio
   se abre otra pestaña clickeando un `<a>` en vez de `window.open`: si se le pasa
   `noopener`, la spec dice que devuelve `null` incluso cuando la ventana abrió, y ese `null`
   no se puede leer como "el navegador la bloqueó".
5. El panel de confirmación no promete haber abierto nada —un deep link no devuelve esa
   señal— y por eso muestra un enlace real de respaldo. El carrito queda a la vista hasta que
   el cliente dice "ya lo mandé".
6. No se envía nada hasta que el cliente apriete enviar en el chat: ahí se confirman precio
   final y medio de pago.

Los totales se calculan en un solo lugar (`computeTotals`) para que el resumen visible y
el mensaje de WhatsApp no puedan divergir.

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
  lib/          format.ts, whatsapp.ts
  store/        cartStore.ts
  config.ts     datos del local
  types.ts      tipos compartidos
```

Los colores y animaciones del tema están en `src/index.css` dentro del bloque `@theme`
de Tailwind v4 — no hay `tailwind.config.js`.
