import { create } from "zustand"
import { persist } from "zustand/middleware"

import { STORE } from "@/config"
import type { CartLine, Customer, Product } from "@/types"

/**
 * En qué pantalla del checkout está el cliente.
 *
 * Es estado PERSISTIDO a propósito: el enlace de WhatsApp se lleva la pestaña
 * (en el celular navegamos al link) y volver con "atrás" recarga la app desde
 * cero. Si el paso viviera en un useState, el cliente regresa, se encuentra el
 * formulario vacío y tiene que escribir todo otra vez.
 */
export type CheckoutStep = "cart" | "checkout" | "sent"

/** Último pedido armado. Alcanza con reabrir el chat, no hace falta rellenar nada. */
export interface SentOrder {
  chat: string
  web: string
  message: string
  /** Date.now() al armarlo: permite descartar un pedido que ya quedó viejo. */
  at: number
}

/** Mientras no lo confirme ni lo borre, un pedido sigue retomable 6 horas. */
export const SENT_ORDER_TTL_MS = 1000 * 60 * 60 * 6

const EMPTY_CUSTOMER: Customer = { name: "", address: "", city: "", notes: "" }

interface CartState {
  lines: CartLine[]
  /** Estado del drawer. Se mantiene fuera del persist: al recargar, cerrado. */
  isOpen: boolean

  step: CheckoutStep
  /** Borrador de los datos de envío; se persiste para no escribirlos dos veces. */
  customer: Customer
  sent: SentOrder | null

  add: (product: Product, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  increment: (productId: string) => void
  decrement: (productId: string) => void
  remove: (productId: string) => void
  clear: () => void

  openCart: () => void
  closeCart: () => void

  setStep: (step: CheckoutStep) => void
  setCustomerField: (key: keyof Customer, value: string) => void
  /** Guarda el pedido recién armado y salta al panel de confirmación. */
  markSent: (order: Omit<SentOrder, "at">) => void
}

const clampQty = (qty: number) => Math.max(1, Math.min(STORE.maxQtyPerItem, Math.trunc(qty)))

/**
 * Construye la línea a partir del producto guardando copia de name y price,
 * así el mensaje de WhatsApp sigue siendo correcto aunque el catálogo cambie.
 */
const toLine = (product: Product, qty: number): CartLine => ({
  productId: product.id,
  name: product.name,
  unitPrice: product.price,
  qty: clampQty(qty),
  image: product.image,
  art: product.art,
})

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      step: "cart",
      customer: EMPTY_CUSTOMER,
      sent: null,

      add: (product, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === product.id)

          const lines = existing
            ? state.lines.map((l) =>
                l.productId === product.id ? { ...l, qty: clampQty(l.qty + qty) } : l,
              )
            : [...state.lines, toLine(product, qty)]

          // No abrimos el drawer acá: la ficha muestra el "Agregado ✓" y el badge del
          // header anima. Abrirlo solo interrumpiría el recorrido de la grilla.
          // Agregar algo es empezar un pedido nuevo: el anterior deja de tener sentido.
          return { lines, step: "cart" as const, sent: null }
        }),

      setQty: (productId, qty) =>
        set((state) =>
          qty <= 0
            ? { lines: state.lines.filter((l) => l.productId !== productId) }
            : {
                lines: state.lines.map((l) =>
                  l.productId === productId ? { ...l, qty: clampQty(qty) } : l,
                ),
              },
        ),

      increment: (productId) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.productId === productId ? { ...l, qty: clampQty(l.qty + 1) } : l,
          ),
        })),

      decrement: (productId) =>
        set((state) => ({
          lines: state.lines.flatMap((l) =>
            l.productId === productId
              ? l.qty <= 1
                ? [] // en 1, el signo menos elimina la línea: menos clics
                : [{ ...l, qty: l.qty - 1 }]
              : [l],
          ),
        })),

      remove: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),

      clear: () => set({ lines: [], isOpen: false, sent: null, step: "cart" }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      setStep: (step) => set({ step }),

      setCustomerField: (key, value) =>
        set((state) => ({ customer: { ...state.customer, [key]: value } })),

      markSent: (order) => set({ sent: { ...order, at: Date.now() }, step: "sent" }),
    }),
    {
      name: "aurema-cart",
      // Sigue en 1 a propósito: sólo sumamos claves, así el merge superficial de
      // zustand deja las nuevas con su valor inicial y el carrito de quien ya
      // tenía una sesión abierta no se pierde al actualizar el sitio.
      version: 1,
      // Viajan a localStorage las líneas, el paso del checkout, el borrador de
      // datos y el último pedido armado. Lo único efímero es si el drawer estaba
      // abierto: nadie quiere que un panel le tape la home al volver a entrar.
      partialize: (state) => ({
        lines: state.lines,
        step: state.step,
        customer: state.customer,
        sent: state.sent,
      }),
    },
  ),
)

/* ---------------- Selectores ----------------
   Salidas derivadas fuera del store: se recalculan en el render y evitan
   suscripciones innecesarias que provocarían re-renders en toda el árbol. */

export const selectItemCount = (state: CartState) =>
  state.lines.reduce((acc, line) => acc + line.qty, 0)
