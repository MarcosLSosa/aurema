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
            {STORE.claim}. Diseños con color y personalidad para acompañarte todos los días.
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
          </ul>
        </div>

        <div>
          <p className="eyebrow text-stone">Consultas</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone">
            Escribinos para consultar disponibilidad, envíos y medios de pago.
          </p>
        </div>
      </div>

      <div className="border-t border-line/70">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-stone sm:px-8">
          © {new Date().getFullYear()} {STORE.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
