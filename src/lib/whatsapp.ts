import { STORE } from "@/config"
import type { CartLine, Customer } from "@/types"

import { formatPrice } from "./format"

export interface Totals {
  /** Suma de unitPrice × qty de todas las líneas. */
  subtotal: number
  /** 0 si el carrito está vacío o se superó STORE.freeShippingFrom. */
  shipping: number
  total: number
  /** Cantidad total de unidades (no de líneas). */
  itemCount: number
}

const RULE = "——————————————"

/** Calcula subtotal, envío y total. Pura: misma entrada, misma salida. */
export function computeTotals(lines: CartLine[]): Totals {
  const subtotal = lines.reduce((acc, line) => acc + line.unitPrice * line.qty, 0)
  const itemCount = lines.reduce((acc, line) => acc + line.qty, 0)

  const freeShipping = itemCount === 0 || subtotal >= STORE.freeShippingFrom
  const shipping = freeShipping ? 0 : STORE.shippingFlat

  return { subtotal, shipping, total: subtotal + shipping, itemCount }
}

/**
 * Deja el número en formato internacional E.164 sin "+": solo dígitos.
 * Acepta que le peguen el número con espacios, guiones o paréntesis.
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  // "00" al inicio es prefijo de marcado internacional: WhatsApp no lo acepta.
  return digits.replace(/^00/, "")
}

/**
 * Enlace de contacto simple (sin mensaje), para los CTA tipo "escribinos".
 * Pasa el número por normalizePhone a propósito: si alguien lo carga con "+"
 * o espacios en config.ts, estos enlaces tampoco se rompen.
 */
export function buildContactUrl(phone: string = STORE.whatsappNumber): string {
  return `https://api.whatsapp.com/send?phone=${normalizePhone(phone)}`
}

/**
 * Arma el cuerpo del mensaje con el resumen del pedido.
 * Usa * para que WhatsApp renderice las partes en negrita.
 */
export function buildOrderMessage(lines: CartLine[], customer: Customer): string {
  const { subtotal, shipping, total, itemCount } = computeTotals(lines)

  const header = [
    `*PEDIDO — ${STORE.name}*`,
    RULE,
    "",
  ]

  // Una línea por producto, a propósito: con textos muy largos algunos
  // dispositivos cortan el mensaje precargado del enlace, así que cada carácter
  // que sobre es margen ganado.
  const items = lines.map((line, index) => {
    const lineTotal = line.unitPrice * line.qty
    return `*${index + 1}. ${line.name}* ${line.qty} × ${formatPrice(line.unitPrice)} = ${formatPrice(lineTotal)}`
  })
  items.push("")

  const totals = [
    RULE,
    `Subtotal (${itemCount} ${itemCount === 1 ? "unidad" : "unidades"}): ${formatPrice(subtotal)}`,
    shipping === 0
      ? "Envío: SIN CARGO"
      : `Envío: ${formatPrice(shipping)}`,
    `*TOTAL: ${formatPrice(total)}*`,
    "",
  ]

  const contact = [
    RULE,
    `*Nombre:* ${customer.name.trim()}`,
    `*Dirección de envío:* ${customer.address.trim()}`,
    `*Ciudad / localidad:* ${customer.city.trim()}`,
  ]

  const notes = customer.notes.trim()
  if (notes) contact.push(`*Notas:* ${notes.trim()}`)
  contact.push("")

  const footer = [
    RULE,
    "Me confirmás disponibilidad y medios de pago. ¡Gracias!",
  ]

  return [...header, ...items, ...totals, ...contact, ...footer].join("\n")
}

/**
 * Los dos hosts oficiales de click-to-chat.
 *
 * `web` no es un capricho: en una PC sin la app de escritorio instalada,
 * api.whatsapp.com responde "Looks like you don't have WhatsApp installed" y no
 * hay por dónde seguir. web.whatsapp.com abre el chat en el navegador, así que
 * el pedido no muere en un callejón sin salida.
 */
const SEND_HOSTS = {
  chat: "https://api.whatsapp.com/send",
  web: "https://web.whatsapp.com/send",
} as const

export type SendHost = keyof typeof SEND_HOSTS

/**
 * Genera el enlace con el mensaje ya codificado.
 * Lanza Error si el número no tiene pinta de ser válido, para que la UI
 * pueda mostrar el problema en vez de abrir un chat roto.
 */
export function buildWhatsAppUrl(
  message: string,
  phone: string = STORE.whatsappNumber,
  host: SendHost = "chat",
): string {
  const digits = normalizePhone(phone)

  if (digits.length < 10 || digits.length > 15) {
    throw new Error(
      `Número de WhatsApp inválido ("${phone}"). Usalo en formato internacional sin "+", ` +
        "por ejemplo 5491123456789. Configuralo en src/config.ts.",
    )
  }

  return `${SEND_HOSTS[host]}?phone=${digits}&text=${encodeURIComponent(message)}`
}

/** Lo que necesita el panel de confirmación para reabrir el pedido sin rellenar nada. */
export interface CheckoutLinks {
  message: string
  chat: string
  web: string
}

/** Atajo para el botón: líneas + cliente -> el mensaje y los dos enlaces listos. */
export function buildCheckoutLinks(lines: CartLine[], customer: Customer): CheckoutLinks {
  if (lines.length === 0) throw new Error("No podés finalizar un carrito vacío.")
  const message = buildOrderMessage(lines, customer)
  return {
    message,
    chat: buildWhatsAppUrl(message),
    web: buildWhatsAppUrl(message, STORE.whatsappNumber, "web"),
  }
}
