"use client"

import { Button } from "@/components/ui/button"

interface DebtFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  counts: {
    all: number
    offen: number
    "in Bearbeitung": number
    erledigt: number
  }
}

export function DebtFilters({ activeFilter, onFilterChange, counts }: DebtFiltersProps) {
  const filters = [
    { id: "all", label: "Alle", count: counts.all },
    { id: "offen", label: "Offen", count: counts.offen },
    { id: "in Bearbeitung", label: "In Bearbeitung", count: counts["in Bearbeitung"] },
    { id: "erledigt", label: "Erledigt", count: counts.erledigt },
  ]

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          variant={activeFilter === filter.id ? "default" : "outline"}
          className={`${
            activeFilter === filter.id
              ? "bg-primary text-primary-foreground"
              : "bg-background text-foreground border border-border hover:bg-muted"
          }`}
        >
          {filter.label} <span className="ml-2 text-xs opacity-75">({filter.count})</span>
        </Button>
      ))}
    </div>
  )
}
