import { create } from "zustand"
import { persist } from "zustand/middleware"

import { STORE } from "@/config"
import type { CartLine, Product } from "@/types"

interface CartState {
  lines: CartLine[]
  /** Estado del drawer. Se mantiene fuera del persist: al recargar, cerrado. */
  isOpen: boolean

  add: (product: Product, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  increment: (productId: string) => void
  decrement: (productId: string) => void
  remove: (productId: string) => void
  clear: () => void

  openCart: () => void
  closeCart: () => void
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
          return { lines }
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

      clear: () => set({ lines: [], isOpen: false }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "aurema-cart",
      version: 1,
      // Solo persistimos las líneas: isOpen y lastAddedId son estado de UI efímero.
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
)

/* ---------------- Selectores ----------------
   Salidas derivadas fuera del store: se recalculan en el render y evitan
   suscripciones innecesarias que provocarían re-renders en toda el árbol. */

export const selectItemCount = (state: CartState) =>
  state.lines.reduce((acc, line) => acc + line.qty, 0)
