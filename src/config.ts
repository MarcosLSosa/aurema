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
   * sin espacios ni guiones. Ej: 54 9 11 1234-5678 -> "5491112345678".
   * ⚠️ REEMPLAZAR por el número real antes de publicar.
   */
  whatsappNumber: "5491123456789",

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
