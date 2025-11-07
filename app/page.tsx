"use client"

import { useState, useEffect, useMemo } from "react"
import { DebtTable } from "@/components/debt-table"
import { DebtForm } from "@/components/debt-form"
import { DebtFilters } from "@/components/debt-filters"
import { DebtStatistics } from "@/components/debt-statistics"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OcrUpload } from "@/components/ocr-upload"
import { ExportButton } from "@/components/export-button"
import type { Debt } from "@/lib/types"

export default function Page() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [showForm, setShowForm] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    const saved = localStorage.getItem("debts")
    if (saved) {
      setDebts(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(debts))
  }, [debts])

  const filteredDebts = useMemo(() => {
    if (activeFilter === "all") return debts
    return debts.filter((d) => d.status === activeFilter)
  }, [debts, activeFilter])

  const filterCounts = useMemo(
    () => ({
      all: debts.length,
      offen: debts.filter((d) => d.status === "offen").length,
      "in Bearbeitung": debts.filter((d) => d.status === "in Bearbeitung").length,
      erledigt: debts.filter((d) => d.status === "erledigt").length,
    }),
    [debts],
  )

  const addDebt = (debt: Debt) => {
    setDebts([...debts, { ...debt, id: Date.now().toString() }])
    setShowForm(false)
  }

  const addDebts = (newDebts: Debt[]) => {
    setDebts([...debts, ...newDebts.map((d) => ({ ...d, id: Date.now().toString() + Math.random() }))])
  }

  const updateDebt = (id: string, debt: Debt) => {
    setDebts(debts.map((d) => (d.id === id ? { ...debt, id } : d)))
  }

  const deleteDebt = (id: string) => {
    setDebts(debts.filter((d) => d.id !== id))
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-balance">Schulden- & Gläubigerverwaltung</h1>
          <p className="text-muted-foreground mt-2">Übersicht und Verwaltung aller offenen und erledigten Schulden</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Insgesamt {filteredDebts.length} von {debts.length} Einträgen
            </p>
          </div>
          <div className="flex gap-2">
            <ExportButton debts={debts} />
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {showForm ? "Abbrechen" : "+ Schuld hinzufügen"}
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="p-6 mb-6 bg-card border border-border">
            <DebtForm onSubmit={addDebt} />
          </Card>
        )}

        <OcrUpload onDataExtracted={addDebts} />

        <DebtStatistics debts={debts} filter={activeFilter} />
        <DebtFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={filterCounts} />

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <DebtTable debts={filteredDebts} onUpdate={updateDebt} onDelete={deleteDebt} />
        </div>
      </main>
    </div>
  )
}
