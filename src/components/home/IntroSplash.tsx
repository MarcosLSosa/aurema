import { useEffect, useState } from "react"

import { Icon } from "@/components/ui/Icon"
import { STORE } from "@/config"

export function IntroSplash() {
  const [visible, setVisible] = useState(
    () => window.sessionStorage.getItem("aurema-intro-seen") !== "true",
  )
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!visible) return

    window.sessionStorage.setItem("aurema-intro-seen", "true")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = window.setTimeout(() => setLeaving(true), reducedMotion ? 900 : 3200)
    return () => window.clearTimeout(timer)
  }, [visible])

  useEffect(() => {
    if (!leaving) return

    const timer = window.setTimeout(() => setVisible(false), 700)
    return () => window.clearTimeout(timer)
  }, [leaving])

  if (!visible) return null

  return (
    <div
      className={`aurema-intro${leaving ? " aurema-intro--leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`Bienvenida al mundo ${STORE.name}`}
    >
      <div className="aurema-intro__orbit aurema-intro__orbit--one" aria-hidden="true" />
      <div className="aurema-intro__orbit aurema-intro__orbit--two" aria-hidden="true" />
      <span className="aurema-intro__star aurema-intro__star--one" aria-hidden="true">
      ✦
      </span>
      <span className="aurema-intro__star aurema-intro__star--two" aria-hidden="true">
      ✧
      </span>

      <div className="aurema-intro__content">
        <div className="aurema-intro__seal">
          <img
            src="/images/instagram/logo.jpg"
            alt={`Logo de ${STORE.name}: una flor de loto dentro de un sello dorado`}
            className="aurema-intro__logo"
          />
        </div>
        <p className="aurema-intro__eyebrow">Accesorios para celebrar tu vida</p>
        <h1 className="aurema-intro__name">{STORE.name}</h1>
        <p className="aurema-intro__claim">{STORE.claim}</p>
        <button type="button" className="aurema-intro__enter" onClick={() => setLeaving(true)}>
          Entrar al mundo Aurema
          <Icon name="arrowRight" className="size-4" />
        </button>
      </div>
    </div>
  )
}
