/**
 * Puntos de configuración única de la tienda.
 * Cambiá estos valores y todo el sitio (mensajes, precios, WhatsApp) se actualiza.
 */

export const STORE = {
  name: "Aurema",
  claim: "Tote bags 100% algodón y accesorios ecológicos",
  instagram: "aurema.ok",
  instagramUrl: "https://www.instagram.com/aurema.ok/",

  /**
   * Número de la tienda en formato internacional, SOLO dígitos, sin "+",
   * sin espacios ni guiones. Whatsapp lo toma tal cual para armar el chat.
   */
  whatsappNumber: "5492657209503",

  /** Moneda y locale usados por formatPrice(). */
  currency: "ARS",
  locale: "es-AR",

  /** Cantidades máximas por línea: frena pedidos accidentales masivos. */
  maxQtyPerItem: 20,
} as const
