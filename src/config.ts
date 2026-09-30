/**
 * Puntos de configuración única de la tienda.
 * Cambiá estos valores y todo el sitio (mensajes, precios, WhatsApp) se actualiza.
 */

export const STORE = {
  name: "Aurema",
  claim: "Tote bags hechas a mano",
  instagram: "aurema.totes",
  instagramUrl: "https://instagram.com/aurema.totes",
  email: "hola@aurema.com.ar",

  /**
   * Número de la tienda en formato internacional, SOLO dígitos, sin "+",
   * sin espacios ni guiones. Whatsapp lo toma tal cual para armar el chat.
   */
  whatsappNumber: "5492657209503",

  /** Moneda y locale usados por formatPrice(). */
  currency: "ARS",
  locale: "es-AR",

  /** Envío fijo mientras no haya una integración de correo real. */
  shippingFlat: 4500,
  /** Monto a partir del cual el envío es sin cargo. */
  freeShippingFrom: 90000,

  /** Cantidades máximas por línea: frena pedidos accidentales masivos. */
  maxQtyPerItem: 20,
} as const
