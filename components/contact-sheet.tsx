"use client"

import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Debt } from "@/lib/types"
import { X, Printer } from "lucide-react"

interface ContactSheetProps {
  debt: Debt
  onClose: () => void
}

export function ContactSheet({ debt, onClose }: ContactSheetProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-muted/50 border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Kontaktblatt - {debt.glaeubiger}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition" aria-label="Schließen">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Information Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">Kontaktadresse</h3>
            <div className="bg-muted/30 p-4 rounded-md">
              <p className="text-sm whitespace-pre-wrap font-mono">{debt.anschrift}</p>
            </div>
          </div>

          {/* Case Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">AKTENZEICHEN</p>
              <p className="text-sm">{debt.aktenzeichen || "Nicht angegeben"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">ZUSTÄNDIGES GERICHT</p>
              <p className="text-sm">{debt.zustaendiges_gericht || "Nicht angegeben"}</p>
            </div>
          </div>

          {/* Debt Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">SCHULDBETRAG</p>
              <p className="text-sm font-medium">{formatCurrency(debt.betrag)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">FÄLLIGKEITSDATUM</p>
              <p className="text-sm">{formatDate(debt.faelligkeitsdatum)}</p>
            </div>
          </div>

          {/* Contact Reasons */}
          {debt.kontaktgruende && debt.kontaktgruende.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Kontaktgründe</p>
              <div className="space-y-2">
                {debt.kontaktgruende.map((grund) => (
                  <label key={grund} className="flex items-center gap-3 p-3 bg-muted/30 rounded-md cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border" readOnly />
                    <span className="text-sm">{grund}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Printer className="w-4 h-4" />
              Drucken
            </Button>
            <Button variant="outline" onClick={onClose}>
              Schließen
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
