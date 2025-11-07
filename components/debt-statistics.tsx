"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Debt } from "@/lib/types"

interface DebtStatisticsProps {
  debts: Debt[]
  filter: string
}

export function DebtStatistics({ debts, filter }: DebtStatisticsProps) {
  const stats = useMemo(() => {
    const filtered = filter === "all" ? debts : debts.filter((d) => d.status === filter)

    const totalAmount = filtered.reduce((sum, d) => sum + d.betrag, 0)
    const count = filtered.length

    const statusBreakdown = {
      offen: debts.filter((d) => d.status === "offen").reduce((sum, d) => sum + d.betrag, 0),
      "in Bearbeitung": debts.filter((d) => d.status === "in Bearbeitung").reduce((sum, d) => sum + d.betrag, 0),
      erledigt: debts.filter((d) => d.status === "erledigt").reduce((sum, d) => sum + d.betrag, 0),
    }

    return {
      totalAmount,
      count,
      statusBreakdown,
    }
  }, [debts, filter])

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 bg-card border border-border">
        <p className="text-sm text-muted-foreground mb-1">Gesamtbetrag</p>
        <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
      </Card>

      <Card className="p-4 bg-card border border-border">
        <p className="text-sm text-muted-foreground mb-1">Offen</p>
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
          {formatCurrency(stats.statusBreakdown.offen)}
        </p>
      </Card>

      <Card className="p-4 bg-card border border-border">
        <p className="text-sm text-muted-foreground mb-1">In Bearbeitung</p>
        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
          {formatCurrency(stats.statusBreakdown["in Bearbeitung"])}
        </p>
      </Card>

      <Card className="p-4 bg-card border border-border">
        <p className="text-sm text-muted-foreground mb-1">Erledigt</p>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          {formatCurrency(stats.statusBreakdown.erledigt)}
        </p>
      </Card>
    </div>
  )
}
