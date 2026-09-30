import { Icon } from "@/components/ui/Icon"
import { ProductArt } from "@/components/ui/ProductArt"
import { STORE } from "@/config"
import { PRODUCTS } from "@/data/products"

const HERO_PRODUCT = PRODUCTS[0]

const MARQUEE = [
  "Algodón orgánico",
  "Lino sin teñir",
  "Serigrafía a mano",
  "Lona recuperada",
  "Tintes al agua",
  "Lotes de 40",
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* resplandor suave de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 size-[38rem] rounded-full bg-sand/60 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-14 pb-20 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20 lg:pb-28">
        {/* Columna de texto */}
        <div className="animate-fade-up">
          <p className="eyebrow flex items-center gap-2.5 text-clay">
            <span className="h-px w-8 bg-clay" />
            Colección 2026
          </p>

          <h1 className="mt-6 text-[clamp(2.9rem,7.2vw,5.1rem)] leading-[0.95]">
            Una bolsa
            <br />
            <em className="font-light italic text-clay">que dura</em> más
            <br />
            que la moda.
          </h1>

          <p className="mt-7 max-w-md text-[1.02rem] leading-relaxed text-stone">
            Tote bags de algodón orgánico, lino sin teñir y lona recuperada. Cosidas una por
            una en lotes chicos, con materiales que aguantan años de feria, biblioteca y
            compras.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#coleccion"
              className="group inline-flex items-center gap-3 rounded-full bg-bark px-7 py-3.5 text-sm text-bone transition-colors hover:bg-clay"
            >
              Ver colección
              <Icon
                name="arrowRight"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>

            <a
              href="#materiales"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm text-bark transition-colors hover:border-bark"
            >
              <Icon name="leaf" className="size-4 text-olive" />
              Qué usamos
            </a>
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-7">
            {[
              ["6", "modelos activos"],
              ["4", "tejedoras aliadas"],
              ["0", "material nuevo en Cosecha"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-3xl text-bark">{value}</dt>
                <dd className="mt-1 text-xs tracking-wide text-stone uppercase">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Columna de imagen */}
        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-shell">
            <ProductArt
              art={HERO_PRODUCT.art}
              name={HERO_PRODUCT.name}
              className="h-full w-full"
            />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-bark/45 to-transparent p-6">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-bone/80 uppercase">
                  Tote {HERO_PRODUCT.name}
                </p>
                <p className="mt-1 text-sm text-bone">{HERO_PRODUCT.tagline}</p>
              </div>
            </div>
          </div>

          {/* ficha flotante */}
          <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-line bg-bone px-5 py-4 shadow-[0_18px_40px_-24px_rgb(31_27_22/0.55)] sm:block">
            <p className="eyebrow text-stone">Producción</p>
            <p className="mt-1.5 font-display text-lg text-bark">Lote de 40</p>
            <p className="mt-0.5 text-xs text-stone">y no se reedita</p>
          </div>
        </div>
      </div>

      {/* Marquee de materiales */}
      <div className="overflow-hidden border-y border-line bg-shell/60 py-3.5">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-10" aria-hidden={copy === 1}>
              {MARQUEE.map((word) => (
                <span
                  key={word}
                  className="flex items-center gap-10 text-xs tracking-[0.2em] text-stone uppercase"
                >
                  {word}
                  <span className="size-1 rounded-full bg-clay/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">{STORE.claim}</span>
    </section>
  )
}
