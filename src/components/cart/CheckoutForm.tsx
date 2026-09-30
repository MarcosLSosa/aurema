import { useMemo, useState } from "react"
import type { FormEvent } from "react"

import { Icon } from "@/components/ui/Icon"
import { STORE } from "@/config"
import { formatPrice } from "@/lib/format"
import { buildCheckoutUrl, buildOrderMessage, computeTotals } from "@/lib/whatsapp"
import type { Totals } from "@/lib/whatsapp"
import type { CartLine, Customer } from "@/types"

const EMPTY: Customer = { name: "", address: "", city: "", notes: "" }

/** Campos sin los cuales no tiene sentido armar el pedido. */
const REQUIRED: { key: keyof Customer; label: string; placeholder: string }[] = [
  { key: "name", label: "Nombre y apellido", placeholder: "María Pérez" },
  { key: "address", label: "Dirección de envío", placeholder: "Av. Siempreviva 742, 3° B" },
  { key: "city", label: "Ciudad o localidad", placeholder: "Córdoba Capital" },
]

const FIELD =
  "w-full rounded-xl border border-line bg-bone px-4 py-3 text-sm text-bark placeholder:text-stone/55 transition-colors focus:border-clay focus:outline-none"

interface CheckoutFormProps {
  lines: CartLine[]
  onBack: () => void
  /** Vaciar el carrito; se ofrece cuando el pedido ya salió. */
  onClearCart: () => void
  /** Cerrar el drawer sin tocar el carrito. */
  onKeepShopping: () => void
}

export function CheckoutForm({ lines, onBack, onClearCart, onKeepShopping }: CheckoutFormProps) {
  const [form, setForm] = useState<Customer>(EMPTY)
  const [showErrors, setShowErrors] = useState(false)
  const [configError, setConfigError] = useState<string | null>(null)
  const [preview, setPreview] = useState(false)
  /** La URL ya armada, apenas se disparó la apertura del chat. */
  const [sentUrl, setSentUrl] = useState<string | null>(null)

  const totals = computeTotals(lines)
  const missing = REQUIRED.filter((f) => form[f.key].trim() === "")
  const message = useMemo(() => buildOrderMessage(lines, form), [lines, form])

  function update(key: keyof Customer, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setConfigError(null)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setShowErrors(true)
    if (missing.length > 0) return

    let url: string
    try {
      url = buildCheckoutUrl(lines, form)
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : "No pudimos armar el enlace.")
      return
    }

    setConfigError(null)
    setSentUrl(url)
    openChat(url)
  }

  // Todos los hooks están declarados arriba, así que este corte temprano
  // no rompe el orden de render.
  if (sentUrl) {
    return (
      <SentPanel
        url={sentUrl}
        totals={totals}
        onFix={() => setSentUrl(null)}
        onClearCart={onClearCart}
        onKeepShopping={onKeepShopping}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col" noValidate>
      <div className="thin-scroll flex-1 overflow-y-auto px-6 py-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone transition-colors hover:text-bark"
        >
          <Icon name="arrowRight" className="size-4 rotate-180" />
          Volver al carrito
        </button>

        <h2 className="text-2xl">Datos para el envío</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone">
          Con esto armamos el mensaje. Se abre WhatsApp con el pedido ya escrito: sólo tenés
          que apretar enviar.
        </p>

        <div className="mt-7 space-y-4">
          {REQUIRED.map((field) => {
            const invalid = showErrors && form[field.key].trim() === ""
            return (
              <div key={field.key}>
                <label htmlFor={`checkout-${field.key}`} className="eyebrow block text-stone">
                  {field.label}
                </label>
                <input
                  id={`checkout-${field.key}`}
                  type="text"
                  value={form[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  autoComplete={
                    field.key === "name"
                      ? "name"
                      : field.key === "address"
                        ? "street-address"
                        : "address-level2"
                  }
                  aria-invalid={invalid}
                  aria-describedby={invalid ? `err-${field.key}` : undefined}
                  className={`${FIELD} mt-2 ${invalid ? "border-clay" : ""}`}
                />
                {invalid && (
                  <p id={`err-${field.key}`} className="mt-1.5 text-xs text-clay">
                    Lo necesitamos para coordinar la entrega.
                  </p>
                )}
              </div>
            )
          })}

          <div>
            <label htmlFor="checkout-notes" className="eyebrow block text-stone">
              Notas (opcional)
            </label>
            <textarea
              id="checkout-notes"
              rows={3}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Retiro en el taller, lo dejo en portería, prefiero transferencia…"
              className={`${FIELD} mt-2 resize-none`}
            />
          </div>
        </div>

        {/* Vista previa: transparencia total sobre lo que se va a enviar */}
        <div className="mt-7 rounded-xl border border-line bg-shell/50">
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            aria-expanded={preview}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-xs tracking-[0.14em] text-stone uppercase"
          >
            Ver el mensaje
            <Icon
              name="chevronDown"
              className={`size-4 transition-transform duration-200 ${preview ? "rotate-180" : ""}`}
            />
          </button>
          {preview && (
            <pre className="thin-scroll max-h-56 overflow-auto border-t border-line px-4 py-3 text-[11px] leading-relaxed whitespace-pre-wrap text-ink">
              {message}
            </pre>
          )}
        </div>

        {configError && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-clay/40 bg-clay/10 px-4 py-3 text-xs leading-relaxed text-clay-deep"
          >
            {configError}
          </p>
        )}
      </div>

      {/* Pie fijo con el total y la acción principal */}
      <div className="border-t border-line bg-shell/60 px-6 py-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-stone">Total a coordinar</span>
          <span className="font-display text-2xl text-bark tabular-nums">
            {formatPrice(totals.total)}
          </span>
        </div>
        <p className="mt-1 text-xs text-stone">
          Se confirma y se paga recién en el chat con {STORE.name}.
        </p>

        <button
          type="submit"
          className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-clay py-4 text-sm font-medium text-bone transition-colors hover:bg-clay-deep"
        >
          <Icon name="whatsapp" className="size-[18px]" />
          Finalizar pedido por WhatsApp
        </button>
      </div>
    </form>
  )
}

/**
 * Abre el chat con el pedido ya escrito.
 *
 * Acá NO se usa window.open: cuando se pasa "noopener" en el features string,
 * la spec dice que la función devuelve null aunque la ventana sí haya abierto.
 * El código anterior leía ese null como "el navegador la bloqueó" y mostraba un
 * error falso encima de un pedido que había salido perfecto. Un <a> fabricado y
 * clickeado hereda el gesto del usuario —no lo frenan los bloqueadores— y no
 * necesita comprobar el resultado porque el respaldo lo da SentPanel.
 *
 * En el celular navegamos en la misma pestaña: con target="_blank" varios
 * terminan en web.whatsapp.com pidiendo login, y el deep link directo a la app
 * anda mejor. El carrito vive en localStorage, volver no lo borra.
 */
function openChat(url: string) {
  if (window.matchMedia("(max-width: 767px)").matches) {
    window.location.assign(url)
    return
  }

  const link = document.createElement("a")
  link.href = url
  link.target = "_blank"
  link.rel = "noopener noreferrer"
  document.body.append(link)
  link.click()
  link.remove()
}

interface SentPanelProps {
  url: string
  totals: Totals
  onFix: () => void
  onClearCart: () => void
  onKeepShopping: () => void
}

/**
 * Confirmación del envío.
 *
 * Un deep link no devuelve señal de "esto efectivamente abrió", así que no
 * prometemos haber abierto WhatsApp: mostramos un enlace real de respaldo. Si
 * la ventana no apareció, el cliente lo toca y el circuito cierra igual.
 */
function SentPanel({ url, totals, onFix, onClearCart, onKeepShopping }: SentPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="thin-scroll flex-1 overflow-y-auto px-6 py-8">
        <span className="grid size-16 place-items-center rounded-full bg-olive/15">
          <Icon name="check" className="size-7 text-olive" strokeWidth={2} />
        </span>

        <h2 className="mt-5 font-display text-2xl text-bark">Ya está armado el pedido</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone">
          Abrimos WhatsApp con el pedido escrito: sólo tenés que apretar enviar. Si no
          apareció ninguna ventana, tocá este botón.
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-clay py-4 text-sm font-medium text-bone transition-colors hover:bg-clay-deep"
        >
          <Icon name="whatsapp" className="size-[18px]" />
          Abrir WhatsApp
        </a>

        <button
          type="button"
          onClick={onFix}
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-stone transition-colors hover:text-bark"
        >
          <Icon name="arrowRight" className="size-4 rotate-180" />
          Corregir algún dato
        </button>
      </div>

      <div className="border-t border-line bg-shell/60 px-6 py-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-stone">
            {totals.itemCount} {totals.itemCount === 1 ? "unidad" : "unidades"}
          </span>
          <span className="font-display text-2xl text-bark tabular-nums">
            {formatPrice(totals.total)}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-stone">
          El carrito queda guardado por si querés revisar el pedido antes de enviarlo.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onKeepShopping}
            className="rounded-full border border-line px-4 py-3 text-sm text-bark transition-colors hover:border-bark"
          >
            Seguir comprando
          </button>
          <button
            type="button"
            onClick={onClearCart}
            className="flex items-center justify-center gap-2 rounded-full bg-bark px-4 py-3 text-sm text-bone transition-colors hover:bg-clay"
          >
            <Icon name="trash" className="size-4" />
            Ya lo mandé
          </button>
        </div>
      </div>
    </div>
  )
}
