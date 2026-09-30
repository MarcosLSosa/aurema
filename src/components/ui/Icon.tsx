import type { SVGProps } from "react"

/**
 * Set de íconos inline. Evita sumar una dependencia sólo por 8 glifos
 * y mantiene el trazo alineado con el resto del trazo de la marca.
 */
const GLYPHS = {
  bag: (
    <>
      <path d="M4.5 8h15l1.3 12H3.2L4.5 8Z" />
      <path d="M8.5 8V5.8a3.5 3.5 0 0 1 7 0V8" />
    </>
  ),
  plus: <path d="M12 5.5v13M5.5 12h13" />,
  minus: <path d="M5.5 12h13" />,
  trash: (
    <>
      <path d="M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" />
      <path d="M6.8 6.5 8 20.2h8l1.2-13.7" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  copy: (
    <>
      <rect x="9" y="9" width="11.5" height="11.5" rx="2.6" />
      <path d="M15.6 6.4A2.9 2.9 0 0 0 12.7 3.5H6.4A2.9 2.9 0 0 0 3.5 6.4v6.3a2.9 2.9 0 0 0 2.9 2.9" />
    </>
  ),
  arrowRight: <path d="M4.5 12h15m-5.5-5.5L19.5 12 14 17.5" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  leaf: (
    <>
      <path d="M4.5 19.5C3 15 5 8 12.5 5.2c2.6-1 4.6-1.2 6.2-1.2.3 2 0 4.4-1 6.8-2.5 6-8.3 8.6-13.2 8.7Z" />
      <path d="M5 19.5C7.5 14 11 10.5 16 8" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h11v9h-11zM13.5 10h3.6l2.9 3v2.5h-6.5" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 20 5.2 16A8.2 8.2 0 1 1 8.4 19L4 20Z" />
      <path d="M9.4 8.3c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.5l-.5.6c-.2.2-.2.3 0 .5.6 1 1.4 1.7 2.4 2.1.3.1.4.1.6-.1l.5-.6c.1-.2.3-.2.5-.1l1.6.8c.2.1.3.3.2.5-.2.6-.9 1.1-1.6 1.1-1.9 0-4.7-2.1-5.9-4.5-.5-1-.6-2-.1-2.9Z" />
    </>
  ),
  chevronDown: <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
} as const

export type IconName = keyof typeof GLYPHS

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName
}

export function Icon({ name, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {GLYPHS[name]}
    </svg>
  )
}
