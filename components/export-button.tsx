"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Debt } from "@/lib/types"

interface ExportButtonProps {
  debts: Debt[]
}

export function ExportButton({ debts }: ExportButtonProps) {
  const exportToCSV = () => {
    if (debts.length === 0) {
      alert("Keine Daten zum Exportieren vorhanden.")
      return
    }

    const headers = [
      "ID",
      "Gläubiger",
      "Betrag (EUR)",
      "Fälligkeitsdatum",
      "Status",
      "Aktenzeichen",
      "Anschrift",
      "Zuständiges Gericht",
      "Kontaktgründe",
    ]

    const rows = debts.map((debt) => [
      debt.id,
      `"${debt.glaeubiger}"`,
      debt.betrag.toFixed(2),
      debt.faelligkeitsdatum,
      debt.status,
      `"${debt.aktenzeichen || ""}"`,
      `"${debt.anschrift?.replace(/\n/g, " ") || ""}"`,
      `"${debt.zustaendiges_gericht || ""}"`,
      `"${debt.kontaktgruende?.join("; ") || ""}"`,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `Schulden_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const exportToExcel = () => {
    if (debts.length === 0) {
      alert("Keine Daten zum Exportieren vorhanden.")
      return
    }

    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>Gläubiger</th>
                <th>Betrag (EUR)</th>
                <th>Fälligkeitsdatum</th>
                <th>Status</th>
                <th>Aktenzeichen</th>
                <th>Anschrift</th>
                <th>Zuständiges Gericht</th>
                <th>Kontaktgründe</th>
              </tr>
            </thead>
            <tbody>
              ${debts
                .map(
                  (debt) => `
                <tr>
                  <td>${debt.glaeubiger}</td>
                  <td>${debt.betrag.toFixed(2)}</td>
                  <td>${debt.faelligkeitsdatum}</td>
                  <td>${debt.status}</td>
                  <td>${debt.aktenzeichen || ""}</td>
                  <td>${debt.anschrift?.replace(/\n/g, "<br>") || ""}</td>
                  <td>${debt.zustaendiges_gericht || ""}</td>
                  <td>${debt.kontaktgruende?.join("; ") || ""}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `Schulden_${new Date().toISOString().split("T")[0]}.xls`
    link.click()
  }

  const exportToJSON = () => {
    if (debts.length === 0) {
      alert("Keine Daten zum Exportieren vorhanden.")
      return
    }

    const jsonContent = JSON.stringify(debts, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `Schulden_${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-background text-foreground border border-border hover:bg-muted">
          Exportieren
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border border-border">
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer hover:bg-muted">
          Als CSV exportieren
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer hover:bg-muted">
          Als Excel exportieren
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className="cursor-pointer hover:bg-muted">
          Als JSON exportieren
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
