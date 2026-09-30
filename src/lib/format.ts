import { STORE } from "@/config"

/**
 * Formateador de moneda único. Centralizarlo acá significa que cambiar
 * de ARS a USD es tocar dos valores en config.ts y nada más.
 */
const currencyFormatter = new Intl.NumberFormat(STORE.locale, {
  style: "currency",
  currency: STORE.currency,
  maximumFractionDigits: 0,
})

/** 28900 -> "$28.900" (es-AR) */
export function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}

/** 1 -> "1 unidad" · 3 -> "3 unidades" */
export function pluralUnits(count: number): string {
  return `${count} ${count === 1 ? "unidad" : "unidades"}`
}
