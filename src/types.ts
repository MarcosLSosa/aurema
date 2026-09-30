/** Categorías disponibles en el catálogo. */
export type Category = "lisas" | "estampadas" | "eco-canvas" | "tejidas"

export type CategoryFilter = Category | "todas"

/** Estampado que dibuja el arte SVG de la ficha. */
export type ArtPattern = "liso" | "rayas" | "botanico" | "retícula" | "ondas" | "bordo"

export interface ProductArt {
  /** Color de fondo de la ficha. */
  bg: string
  /** Color de la tela de la bolsa. */
  body: string
  /** Color del estampa / detalles. */
  accent: string
  pattern: ArtPattern
}

export interface Product {
  id: string
  name: string
  /** Bajada corta: una línea, para la grilla. */
  tagline: string
  /** Descripción extensa: materiales y cuidados. */
  description: string
  /** Precio unitario en la moneda de STORE.currency. */
  price: number
  category: Category
  /** Muestras de color (hex) para el selector visual. */
  colors: string[]
  materials: string[]
  /** Etiqueta opcional sobre la imagen ("Nuevo", "Últimas 8"). */
  badge?: string
  /**
   * Foto real. Si está vacía, la ficha dibuja el arte SVG local.
   * Enchufá acá tus URLs de Unsplash o de tu CDN cuando las tengas.
   */
  image?: string
  art: ProductArt
}

/** Una línea del carrito. Guarda copia de name/price para que el
 *  mensaje de WhatsApp siga siendo correcto aunque cambie el catálogo. */
export interface CartLine {
  productId: string
  name: string
  unitPrice: number
  qty: number
  image?: string
  art: ProductArt
}

/** Datos que pide el checkout antes de armar el mensaje. */
export interface Customer {
  name: string
  address: string
  city: string
  notes: string
}
