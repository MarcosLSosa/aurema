import type { Category, Product } from "../types"

/** Una categoría puede tener más de una etiqueta (agrupa "todas"). */
interface CategoryDef {
  value: Category
  label: string
  hint: string
}

export const CATEGORIES: CategoryDef[] = [
  { value: "estampadas", label: "Ilustradas", hint: "Diseños Aurema" },
]

export const PRODUCTS: Product[] = [
  {
    id: "luna",
    name: "Luna",
    tagline: "Fases de la luna entre flores y estrellas",
    description:
      "Tote bag 100% algodón con una ilustración de fases lunares enmarcada por flores y pequeños detalles celestes.",
    price: 18000,
    category: "estampadas",
    colors: ["#F2EADF", "#28243A", "#C77C83"],
    materials: ["100% algodón", "Diseño ilustrado"],
    image: "/images/instagram/modelo-1.jpg",
    art: { bg: "#E7DDCB", body: "#EFE7D8", accent: "#B45F38", pattern: "liso" },
  },
  {
    id: "ceniza",
    name: "Marilyn",
    tagline: "Un retrato icónico con un toque de color",
    description:
      "Tote bag 100% algodón con una ilustración en blanco y negro de Marilyn Monroe y un detalle rosa.",
    price: 18000,
    category: "estampadas",
    colors: ["#F2EADF", "#252525", "#EFA5B5"],
    materials: ["100% algodón", "Diseño ilustrado"],
    image: "/images/instagram/modelo-2.jpg",
    art: { bg: "#DBD8D2", body: "#E9E6E0", accent: "#4A4741", pattern: "liso" },
  },
  {
    id: "barro",
    name: "La Emperatriz",
    tagline: "Inspirada en la simbología del tarot",
    description:
      "Tote bag 100% algodón con una ilustración inspirada en La Emperatriz y detalles de naturaleza.",
    price: 18000,
    category: "estampadas",
    colors: ["#F2EADF", "#6D563E", "#C99C55"],
    materials: ["100% algodón", "Diseño ilustrado"],
    image: "/images/instagram/modelo-3.jpg",
    art: { bg: "#DED6C2", body: "#EDE6D6", accent: "#6D7A55", pattern: "botanico" },
  },
  {
    id: "sol",
    name: "Sol",
    tagline: "Un paisaje fantástico en tonos cálidos",
    description:
      "Tote bag 100% algodón con una ilustración colorida de sol, cielo y vegetación.",
    price: 18000,
    category: "estampadas",
    colors: ["#F2EADF", "#E9A44A", "#398C98"],
    materials: ["100% algodón", "Diseño ilustrado"],
    image: "/images/instagram/modelo-4.jpg",
    art: { bg: "#EDDFC6", body: "#F3E8D3", accent: "#C9942F", pattern: "ondas" },
  },
  {
    id: "cosecha",
    name: "Ave",
    tagline: "Una ilustración llena de color y naturaleza",
    description:
      "Tote bag 100% algodón con una ilustración de ave y flores en una paleta alegre.",
    price: 18000,
    category: "estampadas",
    colors: ["#F2EADF", "#49A6B8", "#D9486A"],
    materials: ["100% algodón", "Diseño ilustrado"],
    image: "/images/instagram/modelo-5.jpg",
    art: { bg: "#CFC3AA", body: "#A2937A", accent: "#33302A", pattern: "retícula" },
  },
  {
    id: "marea",
    name: "Frida",
    tagline: "Un homenaje ilustrado a Frida Kahlo",
    description:
      "Tote bag 100% algodón con un retrato ilustrado de Frida Kahlo en blanco y negro.",
    price: 18000,
    category: "estampadas",
    colors: ["#F2EADF", "#202020", "#46603D"],
    materials: ["100% algodón", "Diseño ilustrado"],
    image: "/images/instagram/modelo-6.jpg",
    art: { bg: "#DCE1E0", body: "#EDE9E0", accent: "#7C93A6", pattern: "bordo" },
  },
]

/** Devuelve un producto por su id, o undefined si no existe. */
export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id)
}
