import { useMemo, useState } from "react"

import { CartDrawer } from "@/components/cart/CartDrawer"
import { Hero } from "@/components/home/Hero"
import { Materials } from "@/components/home/Materials"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { FilterBar } from "@/components/products/FilterBar"
import { ProductGrid } from "@/components/products/ProductGrid"
import { Icon } from "@/components/ui/Icon"
import { STORE } from "@/config"
import { CATEGORIES, PRODUCTS } from "@/data/products"
import type { CategoryFilter } from "@/types"

/** Contadores por chip de filtro: son estáticos, se calculan una sola vez. */
const COUNTS = (() => {
  const counts = { todas: PRODUCTS.length } as Record<CategoryFilter, number>
  for (const category of CATEGORIES) counts[category.value] = 0
  for (const product of PRODUCTS) counts[product.category] += 1
  return counts
})()

export default function App() {
  const [filter, setFilter] = useState<CategoryFilter>("todas")

  const products = useMemo(
    () => (filter === "todas" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <>
      <a
        href="#coleccion"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-bark focus:px-5 focus:py-2.5 focus:text-sm focus:text-bone"
      >
        Saltar al catálogo
      </a>

      <Header />

      <main>
        <Hero />

        {/* ---- Catálogo ---- */}
        <section id="coleccion" className="scroll-mt-28">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-lg">
                <p className="eyebrow text-clay">Colección</p>
                <h2 className="mt-4 text-[clamp(1.9rem,4vw,2.9rem)] leading-tight">
                  Seis bolsas, seis maneras de cargar
                </h2>
                <p className="mt-3.5 text-[0.95rem] leading-relaxed text-stone">
                  Todas con el mismo estándar: costura reforzada, fibra natural y estampa
                  hecha a mano en el taller.
                </p>
              </div>

              <p className="text-sm text-stone tabular-nums">
                {products.length} de {PRODUCTS.length} modelos
              </p>
            </div>

            <div className="mt-9 mb-11">
              <FilterBar value={filter} onChange={setFilter} counts={COUNTS} />
            </div>

            <ProductGrid products={products} />
          </div>
        </section>

        <Materials />

        {/* ---- Taller / cierre ---- */}
        <section id="taller" className="scroll-mt-28 border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="grid gap-12 rounded-[2rem] border border-line bg-shell/40 px-6 py-14 sm:px-12 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:px-16">
              <div>
                <p className="eyebrow text-clay">El taller</p>
                <h2 className="mt-4 text-[clamp(1.8rem,3.6vw,2.6rem)] leading-tight">
                  Comprás una bolsa y financiás cuatro telares
                </h2>
                <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-stone">
                  Todo se corta, se cose y se estampa a tres cuadras de la casa. No tenemos
                  depósito ni intermediarios: por eso podemos cambiar una estampa torcida sin
                  discutir y pagar como corresponde a las tejedoras.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-bone p-7">
                <Icon name="whatsapp" className="size-6 text-clay" />
                <p className="mt-4 font-display text-xl text-bark">¿Buscás algo a medida?</p>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  Hacemos pedidos corporativos y estampa propia desde 25 unidades. Escribinos
                  y te pasamos valores y tiempos reales.
                </p>
                <a
                  href={`https://api.whatsapp.com/send?phone=${STORE.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-bark px-6 py-3 text-sm text-bone transition-colors hover:bg-clay"
                >
                  Pedir presupuesto
                  <Icon
                    name="arrowRight"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </>
  )
}
