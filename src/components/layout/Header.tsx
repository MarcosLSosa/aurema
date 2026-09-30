import { Icon } from "@/components/ui/Icon"
import { STORE } from "@/config"
import { formatPrice } from "@/lib/format"
import { selectItemCount, useCart } from "@/store/cartStore"

const NAV = [
  { label: "Colección", href: "#coleccion" },
  { label: "Materiales", href: "#materiales" },
  { label: "Taller", href: "#taller" },
]

export function Header() {
  const count = useCart(selectItemCount)
  const openCart = useCart((s) => s.openCart)

  return (
    <header className="sticky top-0 z-40">
      {/* Barra de anuncio */}
      <div className="bg-bark text-bone">
        <p className="mx-auto flex max-w-7xl items-center justify-center gap-x-6 gap-y-1 px-5 py-2.5 text-center text-[11px] tracking-[0.14em] uppercase">
          <span className="inline-flex items-center gap-2">
            <Icon name="truck" className="size-3.5 shrink-0 opacity-70" />
            Envío sin cargo desde {formatPrice(STORE.freeShippingFrom)}
          </span>
          <span className="hidden items-center gap-2 sm:inline-flex">
            <Icon name="leaf" className="size-3.5 shrink-0 opacity-70" />
            Hecho a mano en Argentina
          </span>
        </p>
      </div>

      <div className="border-b border-line/70 bg-bone/85 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
          <a href="#" className="group flex items-baseline gap-2.5">
            <span className="font-display text-[1.55rem] leading-none tracking-[-0.02em] text-bark">
              {STORE.name}
            </span>
            <span className="eyebrow hidden text-stone transition-colors group-hover:text-clay sm:inline">
              · Totes
            </span>
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-9 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative text-[0.82rem] tracking-[0.06em] text-stone transition-colors hover:text-bark"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-clay transition-[width] duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={openCart}
            className="group relative inline-flex items-center gap-2.5 rounded-full border border-line bg-shell/60 py-2 pr-4 pl-3.5 text-[0.8rem] text-bark transition-colors hover:border-clay hover:bg-clay hover:text-bone"
            aria-label={
              count === 0 ? "Abrir el carrito, está vacío" : `Abrir el carrito, ${count} artículos`
            }
          >
            <Icon name="bag" className="size-[18px]" />
            <span className="hidden sm:inline">Carrito</span>
            {count > 0 && (
              <span
                key={count}
                className="animate-badge-pop grid size-5 place-items-center rounded-full bg-clay text-[11px] font-medium text-bone tabular-nums group-hover:bg-bone group-hover:text-clay"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
