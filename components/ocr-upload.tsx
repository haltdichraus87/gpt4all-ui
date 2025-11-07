"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Debt } from "@/lib/types"

interface OcrUploadProps {
  onDataExtracted: (debts: Debt[]) => void
}

export function OcrUpload({ onDataExtracted }: OcrUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const extractDebtsFromText = (text: string): Debt[] => {
    const debts: Debt[] = []
    const lines = text.split("\n")

    let currentDebt: Partial<Debt> | null = null

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      const amountMatch = trimmed.match(/(\d+[.,]\d{2})\s*(EUR|€)?/)
      if (amountMatch) {
        if (currentDebt && currentDebt.glaeubiger) {
          currentDebt.betrag = Number.parseFloat(amountMatch[1].replace(",", "."))
        }
      }

      const dateMatch = trimmed.match(/(\d{1,2}[./]\d{1,2}[./]\d{4}|\d{4}-\d{2}-\d{2})/)
      if (dateMatch) {
        if (!currentDebt) currentDebt = {}
        let dateStr = dateMatch[1]
        if (dateStr.includes(".") || dateStr.includes("/")) {
          const parts = dateStr.split(/[./]/)
          dateStr = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`
        }
        currentDebt.faelligkeitsdatum = dateStr
      }

      const aktenzeichenMatch = trimmed.match(/((?:\d+\s+[A-Z]{1,2}\s+\d+\/\d+|AZ\s*[:-]?\s*\d+))/i)
      if (aktenzeichenMatch) {
        if (!currentDebt) currentDebt = {}
        currentDebt.aktenzeichen = aktenzeichenMatch[1].trim()
      }

      if (amountMatch && !currentDebt?.glaeubiger) {
        currentDebt = { ...currentDebt, glaeubiger: trimmed.replace(amountMatch[0], "").trim() }
      }

      if (currentDebt?.glaeubiger && currentDebt?.betrag && currentDebt?.faelligkeitsdatum) {
        debts.push({
          id: Date.now().toString() + Math.random(),
          glaeubiger: currentDebt.glaeubiger,
          betrag: currentDebt.betrag,
          faelligkeitsdatum: currentDebt.faelligkeitsdatum,
          status: "offen",
          aktenzeichen: currentDebt.aktenzeichen || "",
          anschrift: "",
          zustaendiges_gericht: "",
          kontaktgruende: [],
        })
        currentDebt = null
      }
    }

    return debts
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (typeof window === "undefined" || !("Tesseract" in window)) {
        throw new Error("Tesseract.js not loaded. Please ensure the script is included.")
      }

      const Tesseract = (window as any).Tesseract

      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const imageData = event.target?.result as string

          const { createWorker } = Tesseract
          const worker = await createWorker()

          const { data } = await worker.recognize(imageData)
          const extractedText = data.text

          const extractedDebts = extractDebtsFromText(extractedText)

          if (extractedDebts.length === 0) {
            setError("Keine Schuldendaten in dem Dokument gefunden. Bitte prüfen Sie das Bild.")
          } else {
            onDataExtracted(extractedDebts)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
          }

          await worker.terminate()
        } catch (err) {
          setError(`Fehler bei der OCR-Verarbeitung: ${err instanceof Error ? err.message : "Unbekannter Fehler"}`)
        } finally {
          setLoading(false)
        }
      }

      reader.readAsDataURL(file)
    } catch (err) {
      setError(`Fehler: ${err instanceof Error ? err.message : "Unbekannter Fehler"}`)
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-card border border-border mb-6">
      <h3 className="text-lg font-semibold mb-4">Dokument hochladen (OCR)</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            disabled={loading}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Wird verarbeitet..." : "Datei auswählen"}
          </Button>
          <span className="text-sm text-muted-foreground">JPG, PNG, PDF Dateien</span>
        </div>

        {error && (
          <Alert className="bg-destructive/10 border-destructive text-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-500/10 border-green-500 text-green-700 dark:text-green-400">
            <AlertDescription>Schuldendaten erfolgreich extrahiert und hinzugefügt!</AlertDescription>
          </Alert>
        )}

        <p className="text-xs text-muted-foreground">
          Das System versucht, Gläubiger, Beträge, Fälligkeitsdaten und Aktenzeichen aus dem hochgeladenen Dokument zu
          extrahieren. Bitte ergänzen Sie Anschrift und Kontaktgründe manuell.
        </p>
      </div>
    </Card>
  )
}
