import { CartDrawer } from "@/components/cart/CartDrawer"
import { Hero } from "@/components/home/Hero"
import { IntroSplash } from "@/components/home/IntroSplash"
import { Materials } from "@/components/home/Materials"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { ProductGrid } from "@/components/products/ProductGrid"
import { Icon } from "@/components/ui/Icon"
import { PRODUCTS } from "@/data/products"
import { buildContactUrl } from "@/lib/whatsapp"

export default function App() {
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
                  Diseños para llevar con vos
                </h2>
                <p className="mt-3.5 text-[0.95rem] leading-relaxed text-stone">
                  Elegí tu ilustración favorita. Cada tote bag es 100% algodón y cuesta
                  $18.000.
                </p>
              </div>

              <p className="text-sm text-stone tabular-nums">{PRODUCTS.length} diseños</p>
            </div>

            <div className="mt-9">
              <ProductGrid products={PRODUCTS} />
            </div>
          </div>
        </section>

        <Materials />

        {/* ---- Contacto / cierre ---- */}
        <section id="taller" className="scroll-mt-28 border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
            <div className="grid gap-12 rounded-[2rem] border border-line bg-shell/40 px-6 py-14 sm:px-12 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:px-16">
              <div>
                <p className="eyebrow text-clay">Un detalle para vos</p>
                <h2 className="mt-4 text-[clamp(1.8rem,3.6vw,2.6rem)] leading-tight">
                  Que cada día tenga algo especial
                </h2>
                <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-stone">
                  Encontrá un diseño que te represente o elegí un regalo con personalidad.
                  Consultanos por WhatsApp y te ayudamos a elegir.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-bone p-7">
                <Icon name="whatsapp" className="size-6 text-clay" />
                <p className="mt-4 font-display text-xl text-bark">¿Querés conocer más?</p>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  Escribinos para consultar disponibilidad, envíos o medios de pago.
                </p>
                <a
                  href={buildContactUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-bark px-6 py-3 text-sm text-bone transition-colors hover:bg-clay"
                >
                  Escribinos por WhatsApp
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
      <IntroSplash />
    </>
  )
}
