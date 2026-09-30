import { CATEGORIES } from "@/data/products"
import type { CategoryFilter } from "@/types"
import { cn } from "@/utils/cn"

interface FilterBarProps {
  value: CategoryFilter
  onChange: (value: CategoryFilter) => void
  counts: Record<CategoryFilter, number>
}

const OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "todas", label: "Todas" },
  ...CATEGORIES.map((c) => ({ value: c.value as CategoryFilter, label: c.label })),
]

export function FilterBar({ value, onChange, counts }: FilterBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar por estilo"
      className="flex flex-wrap items-center gap-2"
    >
      {OPTIONS.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.8rem] transition-all duration-200",
              active
                ? "border-bark bg-bark text-bone"
                : "border-line bg-transparent text-stone hover:border-bark hover:text-bark",
            )}
          >
            {option.label}
            <span
              className={cn(
                "grid min-w-5 place-items-center rounded-full px-1 text-[10px] tabular-nums",
                active ? "bg-bone/20 text-bone" : "bg-sand/70 text-stone",
              )}
            >
              {counts[option.value] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}
