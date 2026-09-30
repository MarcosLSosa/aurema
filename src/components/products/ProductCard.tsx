import { useEffect, useRef, useState } from "react"

import { Icon } from "@/components/ui/Icon"
import { ProductArt } from "@/components/ui/ProductArt"
import { formatPrice } from "@/lib/format"
import { useCart } from "@/store/cartStore"
import type { Product } from "@/types"
import { cn } from "@/utils/cn"

/** Vertical para que la bolsa se vea completa y la grilla respire. */
const RATIO = "aspect-[4/5]"

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add)
  const [added, setAdded] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function handleAdd() {
    add(product)
    setAdded(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setAdded(false), 1900)
  }

  return (
    <article className="group flex flex-col">
      {/* Visual */}
      <div className={cn("relative overflow-hidden rounded-2xl border border-line bg-shell", RATIO)}>
        {product.image ? (
          <img
            src={product.image}
            alt={`Tote ${product.name}`}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <ProductArt
            art={product.art}
            name={product.name}
            className="size-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        )}

        {product.badge && (
          <span className="absolute top-3.5 left-3.5 rounded-full bg-bone/90 px-3 py-1 text-[10px] tracking-[0.14em] text-bark uppercase backdrop-blur-sm">
            {product.badge}
          </span>
        )}

        {/* acciones que aparecen al pasar el cursor */}
        <div className="absolute inset-x-3.5 bottom-3.5 translate-y-3 opacity-0 transition-all duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full py-3 text-[0.82rem] transition-colors",
              added ? "bg-olive text-bone" : "bg-bark text-bone hover:bg-clay",
            )}
          >
            {added ? (
              <>
                <Icon name="check" className="size-4" strokeWidth={2} />
                Agregada al carrito
              </>
            ) : (
              <>
                <Icon name="plus" className="size-4" strokeWidth={2} />
                Agregar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Datos */}
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-[1.3rem] leading-snug text-bark">
            Tote {product.name}
          </h3>
          <p className="shrink-0 text-[0.95rem] text-bark tabular-nums">
            {formatPrice(product.price)}
          </p>
        </div>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone">
          {product.tagline}
        </p>

        <div className="mt-3.5 flex items-center gap-3.5 pt-1">
          <span className="flex items-center gap-1.5" aria-label="Colores disponibles">
            {product.colors.map((color) => (
              <span
                key={color}
                title={color}
                className="size-3 rounded-full ring-1 ring-bark/15 ring-offset-1 ring-offset-bone"
                style={{ backgroundColor: color }}
              />
            ))}
          </span>
          <span className="eyebrow ml-auto text-stone/80">{product.materials[0]}</span>
        </div>
      </div>
    </article>
  )
}
