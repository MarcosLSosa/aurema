import { useEffect, useRef, useState } from "react"

import { Icon } from "@/components/ui/Icon"
import { STORE } from "@/config"
import { formatPrice } from "@/lib/format"
import { computeTotals } from "@/lib/whatsapp"
import { useCart } from "@/store/cartStore"

import { CartLineRow } from "./CartLineRow"
import { CheckoutForm } from "./CheckoutForm"

export function CartDrawer() {
  const lines = useCart((s) => s.lines)
  const isOpen = useCart((s) => s.isOpen)
  const closeCart = useCart((s) => s.closeCart)
  const clear = useCart((s) => s.clear)

  const [checkout, setCheckout] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const totals = computeTotals(lines)
  const remaining = STORE.freeShippingFrom - totals.subtotal

  // Al cerrar, la próxima vez que se abre hay que ver el carrito, no el formulario.
  useEffect(() => {
    if (!isOpen) setCheckout(false)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart()
    }

    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    panelRef.current?.focus()

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button
        type="button"
        aria-label="Cerrar el carrito"
        onClick={closeCart}
        className="animate-overlay-in absolute inset-0 size-full cursor-default bg-bark/45 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={checkout ? "Datos para el pedido" : "Carrito de compras"}
        tabIndex={-1}
        className="animate-drawer-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bone shadow-[-24px_0_60px_-30px_rgb(31_27_22/0.5)] outline-none"
      >
        {/* Cabecera */}
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="font-display text-xl text-bark">
              {checkout ? "Finalizar pedido" : "Tu carrito"}
            </h2>
            {!checkout && (
              <p className="mt-0.5 text-xs text-stone tabular-nums">
                {totals.itemCount} {totals.itemCount === 1 ? "unidad" : "unidades"}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar"
            className="-mr-2 rounded-full p-2 text-stone transition-colors hover:bg-sand/60 hover:text-bark"
          >
            <Icon name="close" className="size-[18px]" />
          </button>
        </header>

        {lines.length === 0 ? (
          <EmptyState onBrowse={closeCart} />
        ) : checkout ? (
          <CheckoutForm lines={lines} onBack={() => setCheckout(false)} />
        ) : (
          <>
            <ul className="thin-scroll flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((line) => (
                <CartLineRow key={line.productId} line={line} />
              ))}
            </ul>

            <footer className="border-t border-line bg-shell/60 px-6 py-5">
              {remaining > 0 ? (
                <p className="mb-4 flex items-center gap-2 text-xs text-stone">
                  <Icon name="truck" className="size-4 shrink-0 text-olive" />
                  Te faltan {formatPrice(remaining)} para el envío sin cargo.
                </p>
              ) : (
                <p className="mb-4 flex items-center gap-2 text-xs text-olive">
                  <Icon name="check" className="size-4 shrink-0" strokeWidth={2} />
                  ¡Listo! El envío sale sin cargo.
                </p>
              )}

              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-stone">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-stone">
                  <dt>Envío</dt>
                  <dd className="tabular-nums">
                    {totals.shipping === 0 ? "Sin cargo" : formatPrice(totals.shipping)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-3">
                  <dt className="text-sm text-bark">Total</dt>
                  <dd className="font-display text-2xl text-bark tabular-nums">
                    {formatPrice(totals.total)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => setCheckout(true)}
                className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-full bg-clay py-4 text-sm font-medium text-bone transition-colors hover:bg-clay-deep"
              >
                <Icon name="whatsapp" className="size-[18px]" />
                Finalizar pedido por WhatsApp
              </button>

              <button
                type="button"
                onClick={clear}
                className="mt-2.5 w-full py-1.5 text-xs text-stone transition-colors hover:text-clay"
              >
                Vaciar carrito
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}


/** Estado vacío: invitación a volver a la grilla en vez de un simple "está vacío". */
function EmptyState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-shell">
        <Icon name="bag" className="size-7 text-stone" />
      </span>
      <div>
        <p className="font-display text-xl text-bark">Todavía no elegiste nada</p>
        <p className="mt-1.5 text-sm leading-relaxed text-stone">
          Las tote se agotan con el lote. Mirá lo que está disponible ahora mismo.
        </p>
      </div>
      <button
        type="button"
        onClick={onBrowse}
        className="mt-1 rounded-full border border-line px-6 py-3 text-sm text-bark transition-colors hover:border-bark"
      >
        Ver la colección
      </button>
    </div>
  )
}
