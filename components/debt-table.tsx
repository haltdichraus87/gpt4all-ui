"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Debt } from "@/lib/types"
import { ContactSheet } from "./contact-sheet"

interface DebtTableProps {
  debts: Debt[]
  onUpdate: (id: string, debt: Debt) => void
  onDelete: (id: string) => void
}

export function DebtTable({ debts, onDelete }: DebtTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null)

  const statusColors = {
    offen: "bg-red-500/10 text-red-700 dark:text-red-400",
    "in Bearbeitung": "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    erledigt: "bg-green-500/10 text-green-700 dark:text-green-400",
  }

  const selectedDebt = debts.find((d) => d.id === selectedDebtId)

  if (debts.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground text-lg">Keine Einträge vorhanden.</p>
        <p className="text-muted-foreground text-sm mt-1">
          Fügen Sie eine neue Schuld hinzu oder laden Sie ein Dokument hoch.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-semibold">Gläubiger</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Betrag</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Fälligkeitsdatum</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Aktenzeichen</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {debts.map((debt) => (
              <tr key={debt.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 text-sm">{debt.glaeubiger}</td>
                <td className="px-6 py-4 text-sm font-medium">{formatCurrency(debt.betrag)}</td>
                <td className="px-6 py-4 text-sm">{formatDate(debt.faelligkeitsdatum)}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[debt.status as keyof typeof statusColors]}`}
                  >
                    {debt.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{debt.aktenzeichen || "–"}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDebtId(debt.id)}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      Kontakt
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(editingId === debt.id ? null : debt.id)}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      Bearbeiten
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?")) {
                          onDelete(debt.id)
                        }
                      }}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      Löschen
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDebt && <ContactSheet debt={selectedDebt} onClose={() => setSelectedDebtId(null)} />}
    </>
  )
}
