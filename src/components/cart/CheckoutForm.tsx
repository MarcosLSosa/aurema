import { useMemo, useState } from "react"
import type { FormEvent } from "react"

import { Icon } from "@/components/ui/Icon"
import { STORE } from "@/config"
import { formatPrice } from "@/lib/format"
import { buildCheckoutLinks, buildOrderMessage, computeTotals } from "@/lib/whatsapp"
import type { CheckoutLinks, Totals } from "@/lib/whatsapp"
import { useCart } from "@/store/cartStore"
import type { SentOrder } from "@/store/cartStore"
import type { CartLine, Customer } from "@/types"

/** Campos sin los cuales no tiene sentido armar el pedido. */
const REQUIRED: {
  key: keyof Customer
  label: string
  placeholder: string
  /** Lo que muestra la tecla de acción del teclado del celular. */
  enterKeyHint: "next" | "go"
}[] = [
  {
    key: "name",
    label: "Nombre y apellido",
    placeholder: "María Pérez",
    enterKeyHint: "next",
  },
  {
    key: "address",
    label: "Dirección de envío",
    placeholder: "Av. Siempreviva 742, 3° B",
    enterKeyHint: "next",
  },
  {
    key: "city",
    label: "Ciudad o localidad",
    placeholder: "Córdoba Capital",
    enterKeyHint: "go",
  },
]

/**
 * `text-base` (16px) y no `text-sm`: iOS Safari zooma la página al enfocar un
 * campo cuya fuente calculada es menor a 16px. Ese zoom empuja el pie del
 * drawer —donde está "Finalizar pedido por WhatsApp"— fuera de la pantalla, y
 * como el overlay bloquea el scroll de la página no hay forma de volver a él.
 * Con 16px el navegador no zooma y el botón se queda donde está.
 */
const FIELD =
  "w-full rounded-xl border border-line bg-bone px-4 py-3 text-base text-bark placeholder:text-stone/55 transition-colors focus:border-clay focus:outline-none"

interface CheckoutFormProps {
  lines: CartLine[]
}

export function CheckoutForm({ lines }: CheckoutFormProps) {
  // Los datos del formulario NO viven en un useState: el enlace de WhatsApp se
  // lleva la pestaña y al volver el navegador recarga la SPA desde cero. Era
  // justo acá donde el cliente perdía todo y tenía que escribir otra vez.
  const customer = useCart((s) => s.customer)
  const setCustomerField = useCart((s) => s.setCustomerField)
  const step = useCart((s) => s.step)
  const setStep = useCart((s) => s.setStep)
  const sent = useCart((s) => s.sent)
  const markSent = useCart((s) => s.markSent)

  // Lo efímero sigue en useState: detalles de pantalla, nada que escribir.
  const [showErrors, setShowErrors] = useState(false)
  const [configError, setConfigError] = useState<string | null>(null)
  const [preview, setPreview] = useState(false)

  const totals = computeTotals(lines)
  const missing = REQUIRED.filter((f) => customer[f.key].trim() === "")
  const message = useMemo(() => buildOrderMessage(lines, customer), [lines, customer])

  function update(key: keyof Customer, value: string) {
    setCustomerField(key, value)
    setConfigError(null)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setShowErrors(true)
    if (missing.length > 0) return

    let links: CheckoutLinks
    try {
      links = buildCheckoutLinks(lines, customer)
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : "No pudimos armar el enlace.")
      return
    }

    setConfigError(null)
    // Primero se anota el pedido en el store y recién después se abre el chat:
    // si el enlace se lleva la pestaña, al volver todo está donde estaba.
    markSent({ chat: links.chat, web: links.web, message: links.message })
    openChat(links.chat)
  }

  // Todos los hooks están declarados arriba, así que este corte temprano
  // no rompe el orden de render.
  if (step === "sent" && sent) {
    return <SentPanel sent={sent} totals={totals} onEdit={() => setStep("checkout")} />
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col" noValidate>
      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <button
          type="button"
          onClick={() => setStep("cart")}
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
            const invalid = showErrors && customer[field.key].trim() === ""
            return (
              <div key={field.key}>
                <label htmlFor={`checkout-${field.key}`} className="eyebrow block text-stone">
                  {field.label}
                </label>
                <input
                  id={`checkout-${field.key}`}
                  type="text"
                  value={customer[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  enterKeyHint={field.enterKeyHint}
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
              value={customer.notes}
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
      <div className="shrink-0 border-t border-line bg-shell/60 px-6 py-5">
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

        {/* Respaldo por si algún navegador igual esconde el pie con el teclado:
            la tecla de acción del último campo envía el formulario. */}
        <p className="mt-2 text-center text-[11px] leading-relaxed text-stone">
          ¿El teclado te tapa el botón? Apretá «Ir» en el teclado y el pedido se arma igual.
        </p>
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
 * anda mejor. Que la navegación se lleve el sitio ya no es un problema: el
 * pedido y los datos están en localStorage y SentPanel aparece al volver.
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

/**
 * Copia el mensaje al portapapeles, con respaldo para contextos sin HTTPS.
 *
 * navigator.clipboard sólo existe en contexto seguro y puede fallar si la
 * pestaña perdió el foco —justo cuando el cliente volvió de WhatsApp—. El camino
 * del <textarea> sigue marchando en http de red local, que es como se prueba
 * desde el celular.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // se prueba con el respaldo
  }

  try {
    const area = document.createElement("textarea")
    area.value = text
    area.setAttribute("readonly", "")
    area.style.position = "fixed"
    area.style.top = "-9999px"
    document.body.append(area)
    area.select()
    const ok = document.execCommand("copy")
    area.remove()
    return ok
  } catch {
    return false
  }
}

interface SentPanelProps {
  sent: SentOrder
  totals: Totals
  /** Volver al formulario para retocar un dato sin perder lo escrito. */
  onEdit: () => void
}

/**
 * Confirmación del envío.
 *
 * Un deep link no devuelve señal de "esto efectivamente abrió", así que el panel
 * no lo promete: ofrece tres salidas reales. Reabrir el chat, entrar al chat web
 * (la PC sin la app de escritorio se quedaba sin opciones), y copiar el texto por
 * si el precargado salió cortado en algún dispositivo. El pedido ya está anotado
 * en localStorage, entonces volver nunca borra nada.
 */
function SentPanel({ sent, totals, onEdit }: SentPanelProps) {
  const clear = useCart((s) => s.clear)
  const setStep = useCart((s) => s.setStep)
  const closeCart = useCart((s) => s.closeCart)
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    setCopied(await copyToClipboard(sent.message))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto px-6 py-8">
        <span className="grid size-16 place-items-center rounded-full bg-olive/15">
          <Icon name="check" className="size-7 text-olive" strokeWidth={2} />
        </span>

        <h2 className="mt-5 font-display text-2xl text-bark">Tu pedido está listo para enviar</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone">
          Dejamos el mensaje escrito en WhatsApp: sólo falta que aprietes enviar. Hasta ahí no
          sale nada, y el carrito queda intacto por si volvés.
        </p>

        <a
          href={sent.chat}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-clay py-4 text-sm font-medium text-bone transition-colors hover:bg-clay-deep"
        >
          <Icon name="whatsapp" className="size-[18px]" />
          Abrir WhatsApp de nuevo
        </a>

        <p className="mt-4 text-xs leading-relaxed text-stone">
          ¿No abrió nada o te dice que no tenés la app instalada? Entrá al chat web. Y si el
          mensaje salió vacío, copiá el texto y pegalo vos en el chat.
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <a
            href={sent.web}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-line px-4 py-3 text-sm text-bark transition-colors hover:border-bark"
          >
            <Icon name="arrowRight" className="size-4" />
            Chat web
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 rounded-full border border-line px-4 py-3 text-sm text-bark transition-colors hover:border-bark"
          >
            <Icon
              name={copied ? "check" : "copy"}
              className="size-4"
              strokeWidth={copied ? 2 : 1.5}
            />
            {copied ? "Copiado" : "Copiar mensaje"}
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-line bg-shell/50">
          <p className="eyebrow border-b border-line px-4 py-2.5 text-stone">
            Este es el texto del mensaje
          </p>
          <pre className="thin-scroll max-h-52 overflow-auto px-4 py-3 text-[11px] leading-relaxed whitespace-pre-wrap text-ink">
            {sent.message}
          </pre>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-stone transition-colors hover:text-bark"
        >
          <Icon name="arrowRight" className="size-4 rotate-180" />
          Corregir algún dato
        </button>
      </div>

      <div className="shrink-0 border-t border-line bg-shell/60 px-6 py-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-stone">
            {totals.itemCount} {totals.itemCount === 1 ? "unidad" : "unidades"}
          </span>
          <span className="font-display text-2xl text-bark tabular-nums">
            {formatPrice(totals.total)}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-stone">
          El carrito sigue guardado hasta que lo borres vos, así que dá ir y venir del chat.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              setStep("cart")
              closeCart()
            }}
            className="rounded-full border border-line px-4 py-3 text-sm text-bark transition-colors hover:border-bark"
          >
            Seguir comprando
          </button>
          <button
            type="button"
            onClick={clear}
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
