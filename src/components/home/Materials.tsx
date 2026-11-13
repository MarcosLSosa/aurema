import { Icon } from "@/components/ui/Icon"
import type { IconName } from "@/components/ui/Icon"

interface Item {
  icon: IconName
  title: string
  body: string
}

const ITEMS: Item[] = [
  {
    icon: "leaf",
    title: "Algodón 100%",
    body: "Tote bags de algodón para acompañarte en tus planes de todos los días.",
  },
  {
    icon: "truck",
    title: "Diseños que hablan de vos",
    body: "Ilustraciones de luna, naturaleza y personajes para sumar color a tu rutina.",
  },
  {
    icon: "bag",
    title: "Un accesorio para cada día",
    body: "Llevá tus esenciales a la feria, a un paseo o a donde te lleve el día.",
  },
]

export function Materials() {
  return (
    <section id="materiales" className="scroll-mt-28 border-t border-line bg-shell/40">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="max-w-xl">
          <p className="eyebrow text-clay">El mundo Aurema</p>
          <h2 className="mt-4 text-[clamp(1.9rem,4vw,2.9rem)] leading-tight">
            Pequeños detalles, mucha personalidad
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {ITEMS.map((item) => (
            <div key={item.title} className="bg-bone p-8">
              <Icon name={item.icon} className="size-6 text-clay" />
              <h3 className="mt-5 text-xl">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-stone">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
