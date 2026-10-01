import { useEffect } from "react"
import type { RefObject } from "react"

/**
 * Debajo de esta diferencia de altura puede ser la barra de direcciones que se
 * esconde al scrollear, no un teclado. Los teclados virtuales reales rara vez
 * ocupan menos de ~150px.
 */
const KEYBOARD_MIN_PX = 140

/** Un pellizco del usuario achica el visual viewport pero no es un teclado. */
const ZOOM_TOLERANCE = 1.05

/**
 * Mantiene un panel `position: fixed` por encima del teclado en pantalla.
 *
 * El problema: `inset-y-0` se mide contra el *layout viewport*, y ese no se
 * achica cuando abre el teclado. En Android Chrome (default
 * `interactive-widget: resizes-visual`) el layout viewport conserva su altura,
 * así que el pie del drawer —ahí vive el botón "Finalizar pedido por
 * WhatsApp"— queda enterrado detrás del teclado. En iOS Safari se suma el
 * auto-zoom: si el campo enfocado tiene una fuente de menos de 16px, el
 * navegador zooma, el panel crece y el botón se va de la pantalla. Como el
 * overlay tiene el `body` con `overflow: hidden`, no hay cómo scrollear para
 * recuperarlo: el cliente escribe sus datos y el botón desaparece.
 *
 * La solución: suscribirse al Visual Viewport y re-anclar el panel a lo que
 * realmente se ve. Se escriben dos variables CSS sobre el propio nodo
 * (`--drawer-top` / `--drawer-height`) en vez de guardar estado en React: así
 * el ajuste no dispara un re-render del árbol del checkout mientras el usuario
 * está a mitad de una tecla, y los eventos de `scroll` del viewport no cuestan
 * nada.
 *
 * `--drawer-top` no es decorativo: iOS desplaza el documento para mostrar el
 * campo enfocado, y los elementos fixed se apoyan en el layout viewport, que
 * se fue hacia arriba. Sin ese offset el panel queda escondido por encima.
 */
export function useKeyboardAnchoring(
  targetRef: RefObject<HTMLElement | null>,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return

    const target = targetRef.current
    const viewport = window.visualViewport
    if (!target || !viewport) return

    let previousHeight = Math.round(viewport.height)

    const release = () => {
      target.style.removeProperty("--drawer-top")
      target.style.removeProperty("--drawer-height")
    }

    const sync = () => {
      const available = Math.round(viewport.height)
      const full = Math.round(window.innerHeight)
      const keyboardOpen = full - available >= KEYBOARD_MIN_PX
      const resized = Math.abs(available - previousHeight) >= 2
      previousHeight = available

      if (!keyboardOpen || viewport.scale > ZOOM_TOLERANCE) {
        release()
        return
      }

      target.style.setProperty("--drawer-top", `${Math.max(0, Math.round(viewport.offsetTop))}px`)
      target.style.setProperty("--drawer-height", `${available}px`)

      // Sólo cuando cambió la altura: evitar pelearse con el scrolleo manual.
      if (resized) {
        const active = document.activeElement
        if (active instanceof HTMLElement && target.contains(active)) {
          active.scrollIntoView({ block: "nearest", behavior: "smooth" })
        }
      }
    }

    sync()

    viewport.addEventListener("resize", sync)
    viewport.addEventListener("scroll", sync)
    window.addEventListener("resize", sync)

    return () => {
      viewport.removeEventListener("resize", sync)
      viewport.removeEventListener("scroll", sync)
      window.removeEventListener("resize", sync)
      release()
    }
  }, [targetRef, enabled])
}
