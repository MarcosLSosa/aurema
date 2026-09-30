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

  const items = lines.map((line, index) => {
    const lineTotal = line.unitPrice * line.qty
    return [
      `*${index + 1}. ${line.name}*`,
      `${line.qty} × ${formatPrice(line.unitPrice)} = ${formatPrice(lineTotal)}`,
      "",
    ].join("\n")
  })

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
 * Genera el enlace api.whatsapp.com con el mensaje ya codificado.
 * Lanza Error si el número no tiene pinta de ser válido, para que la UI
 * pueda mostrar el problema en vez de abrir un chat roto.
 */
export function buildWhatsAppUrl(message: string, phone: string = STORE.whatsappNumber): string {
  const digits = normalizePhone(phone)

  if (digits.length < 10 || digits.length > 15) {
    throw new Error(
      `Número de WhatsApp inválido ("${phone}"). Usalo en formato internacional sin "+", ` +
        "por ejemplo 5491123456789. Configuralo en src/config.ts.",
    )
  }

  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(message)}`
}

/** Atajo para el botón: líneas + cliente -> URL lista para abrir. */
export function buildCheckoutUrl(lines: CartLine[], customer: Customer): string {
  if (lines.length === 0) throw new Error("No podés finalizar un carrito vacío.")
  return buildWhatsAppUrl(buildOrderMessage(lines, customer))
}
