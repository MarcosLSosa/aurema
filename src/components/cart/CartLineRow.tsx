import { STORE } from "@/config"
import { Icon } from "@/components/ui/Icon"
import { ProductArt } from "@/components/ui/ProductArt"
import { formatPrice } from "@/lib/format"
import { useCart } from "@/store/cartStore"
import type { CartLine } from "@/types"

interface CartLineRowProps {
  line: CartLine
}

export function CartLineRow({ line }: CartLineRowProps) {
  const increment = useCart((s) => s.increment)
  const decrement = useCart((s) => s.decrement)
  const remove = useCart((s) => s.remove)

  const atMax = line.qty >= STORE.maxQtyPerItem
  const lineTotal = line.unitPrice * line.qty

  return (
    <li className="flex gap-4 py-5 first:pt-0">
      {/* Miniatura: recorta el SVG al área de la bolsa */}
      <div className="size-[74px] shrink-0 overflow-hidden rounded-xl border border-line bg-shell">
        {line.image ? (
          <img src={line.image} alt="" className="size-full object-cover" />
        ) : (
          <ProductArt art={line.art} name={line.name} className="size-full" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-[1.05rem] text-bark">Tote {line.name}</p>
            <p className="mt-0.5 text-xs text-stone tabular-nums">
              {formatPrice(line.unitPrice)} c/u
            </p>
          </div>

          <button
            type="button"
            onClick={() => remove(line.productId)}
            aria-label={`Quitar Tote ${line.name} del carrito`}
            className="-mt-1 -mr-1 rounded-full p-1.5 text-stone transition-colors hover:bg-sand/60 hover:text-clay"
          >
            <Icon name="trash" className="size-4" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div className="inline-flex items-center rounded-full border border-line">
            <button
              type="button"
              onClick={() => decrement(line.productId)}
              aria-label={`Restar una unidad de Tote ${line.name}`}
              className="grid size-8 place-items-center rounded-full text-stone transition-colors hover:text-bark"
            >
              <Icon name="minus" className="size-3.5" strokeWidth={2} />
            </button>

            <span
              aria-live="polite"
              className="min-w-7 text-center text-sm text-bark tabular-nums"
            >
              {line.qty}
            </span>

            <button
              type="button"
              onClick={() => increment(line.productId)}
              disabled={atMax}
              aria-label={`Sumar una unidad de Tote ${line.name}`}
              className="grid size-8 place-items-center rounded-full text-stone transition-colors hover:text-bark disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Icon name="plus" className="size-3.5" strokeWidth={2} />
            </button>
          </div>

          <p className="text-sm text-bark tabular-nums">{formatPrice(lineTotal)}</p>
        </div>
      </div>
    </li>
  )
}
