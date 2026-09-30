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
    title: "Fibra con trazabilidad",
    body: "Algodón orgánico certificado GOTS y lino europeo sin teñir. Cero poliéster: si no se puede compostar, no entra al taller.",
  },
  {
    icon: "truck",
    title: "Lotes chicos, cero stock muerto",
    body: "Entre 20 y 40 unidades por modelo. Cuando se agotan, no los reeditamos igual: el próximo lote cambia la estampa.",
  },
  {
    icon: "bag",
    title: "Costuras de seguridad",
    body: "Doble pespunte en asas y base. Si se rompe en el primer año, la reparás sin cargo y la devolvemos.",
  },
]

export function Materials() {
  return (
    <section id="materiales" className="scroll-mt-28 border-t border-line bg-shell/40">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="max-w-xl">
          <p className="eyebrow text-clay">Materiales</p>
          <h2 className="mt-4 text-[clamp(1.9rem,4vw,2.9rem)] leading-tight">
            Lo que no se ve también cuenta
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
