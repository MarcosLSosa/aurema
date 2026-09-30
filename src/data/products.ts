import type { Category, Product } from "../types"

/** Una categoría puede tener más de una etiqueta (agrupa "todas"). */
interface CategoryDef {
  value: Category
  label: string
  hint: string
}

export const CATEGORIES: CategoryDef[] = [
  { value: "lisas", label: "Lisas", hint: "Crudas, sin estampa" },
  { value: "estampadas", label: "Estampadas", hint: "Serigrafía a mano" },
  { value: "eco-canvas", label: "Eco canvas", hint: "Materiales recuperados" },
  { value: "tejidas", label: "Tejidas a mano", hint: "Crochet y red" },
]

export const PRODUCTS: Product[] = [
  {
    id: "luna",
    name: "Luna",
    tagline: "Tote grande de lino crudo, sin teñir",
    description:
      "Lino europeo lavado, cosido a doble costura. Sin teñir: cada unidad tiene las manchas naturales de la fibra, y ninguna sale igual a la otra. Interior forrado y bolsillo interno para llaves.",
    price: 28900,
    category: "lisas",
    colors: ["#E8DFCF", "#C6B79E", "#8D7B62"],
    materials: ["100% lino", "Forro de algodón", "Hilo de algodón reciclado"],
    badge: "La más elegida",
    art: { bg: "#E7DDCB", body: "#EFE7D8", accent: "#B45F38", pattern: "liso" },
  },
  {
    id: "ceniza",
    name: "Ceniza",
    tagline: "Tote media de canvas orgánico",
    description:
      "Canvas grueso de algodón orgánico certificado GOTS en su tono piedra natural. Estructura parada que mantiene la forma vacía. Base cuadrada reforzada con entretela.",
    price: 19500,
    category: "lisas",
    colors: ["#DCD8D0", "#A8A29A", "#4A4741"],
    materials: ["Algodón orgánico 12 oz", "Certificación GOTS", "Base reforzada"],
    art: { bg: "#DBD8D2", body: "#E9E6E0", accent: "#4A4741", pattern: "liso" },
  },
  {
    id: "barro",
    name: "Barro",
    tagline: "Serigrafía botánica estampada a mano",
    description:
      "Estampada una por una en nuestro taller con tintas al agua libres de PVC. El motivo es una rama de eucalipto dibujada a lápiz y luego pasada a pantalla. Pequeñas variaciones de registro: son parte del proceso, no un defecto.",
    price: 33900,
    category: "estampadas",
    colors: ["#E4DCCB", "#6D7A55", "#1F1B16"],
    materials: ["Canvas de algodón", "Tintas al agua", "Estampa a pantalla"],
    badge: "Edición de 40",
    art: { bg: "#DED6C2", body: "#EDE6D6", accent: "#6D7A55", pattern: "botanico" },
  },
  {
    id: "sol",
    name: "Sol",
    tagline: "Mini tote bordada a mano",
    description:
      "Formato reducido para lo mínimo: teléfono, cartera, mate. Bordado a mano con bastidor en hilo de algodón mercerizado. Asas cortas, se lleva en la mano o al pliegue del brazo.",
    price: 24500,
    category: "estampadas",
    colors: ["#EFDCC2", "#C9942F", "#B45F38"],
    materials: ["Algodón prensado", "Bordado a mano", "Asa corta de cinta"],
    art: { bg: "#EDDFC6", body: "#F3E8D3", accent: "#C9942F", pattern: "ondas" },
  },
  {
    id: "cosecha",
    name: "Cosecha",
    tagline: "Tote reforzada de lona reciclada",
    description:
      "Hechada sobre lonas de camión recuperadas que desarmamos y lavamos una por una. Aguanta 12 kg de feria sin deformarse. Cada pieza conserva las marcas y desteñidos de su vida anterior.",
    price: 41000,
    category: "eco-canvas",
    colors: ["#9C8B6E", "#6E6148", "#33302A"],
    materials: ["Lona de camión recuperada", "Costuras de seguridad", "Cero material nuevo"],
    badge: "Upcycling",
    art: { bg: "#CFC3AA", body: "#A2937A", accent: "#33302A", pattern: "retícula" },
  },
  {
    id: "marea",
    name: "Marea",
    tagline: "Tote red de algodón tejido a crochet",
    description:
      "Tejida a crochet por un grupo de cuatro tejedoras de Córdoba, a razón de una bolsa cada tres días. Red abierta que respira: pensada para la playa, la feria de verdura y todo lo que se moja.",
    price: 47500,
    category: "tejidas",
    colors: ["#E6E1D6", "#7C93A6", "#B9AC93"],
    materials: ["Cuerda de algodón 100%", "Tejido a mano", "Forro interior de lino"],
    badge: "Producción lenta",
    art: { bg: "#DCE1E0", body: "#EDE9E0", accent: "#7C93A6", pattern: "bordo" },
  },
]

/** Devuelve un producto por su id, o undefined si no existe. */
export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id)
}
