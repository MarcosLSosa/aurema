import { Icon } from "@/components/ui/Icon"
import { STORE } from "@/config"
import { buildContactUrl } from "@/lib/whatsapp"

export function Footer() {
  return (
    <footer className="border-t border-line bg-shell/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl text-bark">{STORE.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone">
            {STORE.claim}. Producimos en lotes de entre 20 y 40 unidades para no acumular
            stock muerto: se teje, se estampa y se envía.
          </p>
        </div>

        <div>
          <p className="eyebrow text-stone">Escribinos</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={buildContactUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-ink transition-colors hover:text-clay"
              >
                <Icon name="whatsapp" className="size-4" />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={STORE.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-ink transition-colors hover:text-clay"
              >
                <Icon name="instagram" className="size-4" />@{STORE.instagram}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${STORE.email}`}
                className="inline-flex items-center gap-2 text-ink transition-colors hover:text-clay"
              >
                <Icon name="arrowRight" className="size-4" />
                {STORE.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-stone">Envíos y pagos</p>
          <ul className="mt-4 space-y-2.5 text-sm text-stone">
            <li>Despachamos de lunes a viernes</li>
            <li>Transferencia, Mercado Pago o efectivo</li>
            <li>Cambio sin cargo si la estampa salió torcida</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/70">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-stone sm:px-8">
          © {new Date().getFullYear()} {STORE.name}. Sitio demo — los precios son de
          ejemplo; el WhatsApp sí es el número real de la tienda.
        </p>
      </div>
    </footer>
  )
}
