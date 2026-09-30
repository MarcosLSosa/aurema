import { useId } from "react"

import type { ArtPattern, ProductArt as ArtConfig } from "@/types"

/** Silueta de la bolsa. Se reutiliza como path visible y como clipPath. */
const BODY = "M86 186 H314 L330 412 Q332 430 314 430 H86 Q68 430 70 412 Z"

/** Asas: se dibujan por encima del borde superior. */
const HANDLES = ["M140 190 C140 116 186 116 186 190", "M214 190 C214 116 260 116 260 190"]

function Pattern({ pattern, accent }: { pattern: ArtPattern; accent: string }) {
  switch (pattern) {
    case "rayas":
      return (
        <g stroke={accent} strokeWidth={9} opacity={0.5}>
          {[238, 274, 310, 346, 382].map((y) => (
            <line key={y} x1={40} y1={y} x2={360} y2={y} />
          ))}
        </g>
      )

    case "botanico":
      return (
        <g stroke={accent} strokeWidth={3.5} fill="none" opacity={0.85} strokeLinecap="round">
          {/* rama principal */}
          <path d="M150 400 C175 340 195 285 245 225" />
          {/* hojas alternadas */}
          {[
            [168, 355, -32],
            [190, 315, 28],
            [207, 278, -30],
            [228, 243, 26],
          ].map(([cx, cy, rot], i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={30}
              ry={12}
              transform={`rotate(${rot} ${cx} ${cy})`}
              fill={accent}
              fillOpacity={0.22}
            />
          ))}
        </g>
      )

    case "retícula":
      return (
        <g stroke={accent} strokeWidth={2.5} opacity={0.35}>
          {[110, 150, 190, 230, 270, 310].map((x) => (
            <line key={`v${x}`} x1={x} y1={150} x2={x} y2={450} />
          ))}
          {[215, 255, 295, 335, 375, 415].map((y) => (
            <line key={`h${y}`} x1={40} y1={y} x2={360} y2={y} />
          ))}
        </g>
      )

    case "ondas":
      return (
        <g stroke={accent} strokeWidth={7} fill="none" opacity={0.6} strokeLinecap="round">
          {[250, 300, 350].map((y) => (
            <path key={y} d={`M50 ${y} Q110 ${y - 26} 170 ${y} T300 ${y} T420 ${y}`} />
          ))}
        </g>
      )

    case "bordo":
      /* Red abierta: diagonales en ambos sentidos + nudos. */
      return (
        <g opacity={0.55}>
          <g stroke={accent} strokeWidth={3}>
            {[-260, -180, -100, -20, 60, 140, 220, 300].map((o) => (
              <line key={`a${o}`} x1={o} y1={150} x2={o + 300} y2={450} />
            ))}
            {[-260, -180, -100, -20, 60, 140, 220, 300].map((o) => (
              <line key={`b${o}`} x1={o + 300} y1={150} x2={o} y2={450} />
            ))}
          </g>
          {Array.from({ length: 9 }).map((_, r) =>
            Array.from({ length: 9 }).map((__, c) => (
              <circle
                key={`n${r}-${c}`}
                cx={52 + c * 36}
                cy={196 + r * 30}
                r={3.4}
                fill={accent}
              />
            )),
          )}
        </g>
      )

    case "liso":
    default:
      return null
  }
}

interface ProductArtProps {
  art: ArtConfig
  /** Nombre del producto: alimenta el aria-label del SVG. */
  name: string
  className?: string
}

/**
 * Ilustración local del producto. No depende de la red ni de un CDN:
 * si Product.image existe, la ficha muestra la foto y esto no se renderiza.
 */
export function ProductArt({ art, name, className }: ProductArtProps) {
  const { bg, body, accent, pattern } = art
  // useId trae caracteres no válidos en un fragmento url(#...); los limpio.
  // Un id por instancia evita colisiones cuando el mismo arte se renderiza
  // dos veces en la página (ficha de grilla + miniatura del carrito).
  const clipId = `aurema-clip-${useId().replace(/[^a-zA-Z0-9]/g, "")}`

  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label={`Ilustración de la tote ${name}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width={400} height={500} fill={bg} />

      {/* halo editorial detrás de la bolsa */}
      <circle cx={200} cy={272} r={148} fill="#ffffff" opacity={0.22} />

      <defs>
        <clipPath id={clipId}>
          <path d={BODY} />
        </clipPath>
      </defs>

      {/* sombra de apoyo */}
      <ellipse cx={200} cy={438} rx={132} ry={15} fill="#1f1b16" opacity={0.1} />

      {/* asas, por debajo de la tela para simula el cosido al borde */}
      <g stroke={body} strokeWidth={13} fill="none" strokeLinecap="round">
        {HANDLES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* tela */}
      <path d={BODY} fill={body} />

      {/* estampa, recortada a la silueta */}
      <g clipPath={`url(#${clipId})`}>
        <Pattern pattern={pattern} accent={accent} />
        {/* doblez superior */}
        <rect x={60} y={186} width={280} height={17} fill={accent} opacity={0.14} />
        <line x1={60} y1={203} x2={340} y2={203} stroke={accent} strokeWidth={1.5} opacity={0.35} />
      </g>

      {/* contorno de la bolsa */}
      <path d={BODY} fill="none" stroke="#1f1b16" strokeOpacity={0.16} strokeWidth={2} />

      {/* etiquetas cosidas en el borde inferior derecho */}
      <g clipPath={`url(#${clipId})`}>
        <rect x={258} y={396} width={44} height={17} rx={2.5} fill="#f6f2ea" opacity={0.92} />
        <line x1={265} y1={404.5} x2={295} y2={404.5} stroke="#1f1b16" strokeWidth={2} opacity={0.5} />
      </g>
    </svg>
  )
}
