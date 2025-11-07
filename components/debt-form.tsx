"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Debt } from "@/lib/types"

interface DebtFormProps {
  onSubmit: (debt: Debt) => void
  initialData?: Debt
}

const CONTACT_OPTIONS = [
  "Ratenzahlung",
  "Zahlungsaufschub",
  "Allgemeine Informationen",
  "Dokumentanforderung",
  "Beschwerde",
]

export function DebtForm({ onSubmit, initialData }: DebtFormProps) {
  const [formData, setFormData] = useState<Omit<Debt, "id">>(
    initialData || {
      glaeubiger: "",
      betrag: 0,
      faelligkeitsdatum: "",
      status: "offen",
      aktenzeichen: "",
      anschrift: "",
      zustaendiges_gericht: "",
      kontaktgruende: [],
    },
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "betrag" ? Number.parseFloat(value) || 0 : value,
    })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleContactReasonsChange = (reason: string) => {
    setFormData({
      ...formData,
      kontaktgruende: formData.kontaktgruende.includes(reason)
        ? formData.kontaktgruende.filter((r) => r !== reason)
        : [...formData.kontaktgruende, reason],
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.glaeubiger.trim()) {
      newErrors.glaeubiger = "Gläubiger ist erforderlich"
    }
    if (formData.betrag <= 0) {
      newErrors.betrag = "Betrag muss größer als 0 sein"
    }
    if (!formData.faelligkeitsdatum) {
      newErrors.faelligkeitsdatum = "Fälligkeitsdatum ist erforderlich"
    }
    if (!formData.anschrift.trim()) {
      newErrors.anschrift = "Anschrift ist erforderlich"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit(formData as Debt)
    setFormData({
      glaeubiger: "",
      betrag: 0,
      faelligkeitsdatum: "",
      status: "offen",
      aktenzeichen: "",
      anschrift: "",
      zustaendiges_gericht: "",
      kontaktgruende: [],
    })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Gläubiger <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            name="glaeubiger"
            value={formData.glaeubiger}
            onChange={handleChange}
            placeholder="Name des Gläubigers"
            className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition ${
              errors.glaeubiger ? "border-destructive" : "border-border"
            }`}
            required
          />
          {errors.glaeubiger && <p className="text-xs text-destructive mt-1">{errors.glaeubiger}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Betrag (€) <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            name="betrag"
            value={formData.betrag || ""}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition ${
              errors.betrag ? "border-destructive" : "border-border"
            }`}
            required
          />
          {errors.betrag && <p className="text-xs text-destructive mt-1">{errors.betrag}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Fälligkeitsdatum <span className="text-destructive">*</span>
          </label>
          <input
            type="date"
            name="faelligkeitsdatum"
            value={formData.faelligkeitsdatum}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition ${
              errors.faelligkeitsdatum ? "border-destructive" : "border-border"
            }`}
            required
          />
          {errors.faelligkeitsdatum && <p className="text-xs text-destructive mt-1">{errors.faelligkeitsdatum}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
          >
            <option value="offen">Offen</option>
            <option value="in Bearbeitung">In Bearbeitung</option>
            <option value="erledigt">Erledigt</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Aktenzeichen <span className="text-muted-foreground text-xs">(optional)</span>
        </label>
        <input
          type="text"
          name="aktenzeichen"
          value={formData.aktenzeichen}
          onChange={handleChange}
          placeholder="z.B. 123 O 456/24"
          className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Anschrift <span className="text-destructive">*</span>
        </label>
        <textarea
          name="anschrift"
          value={formData.anschrift}
          onChange={handleChange}
          placeholder="Straße, Hausnummer&#10;PLZ Ort&#10;Land"
          rows={3}
          className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition ${
            errors.anschrift ? "border-destructive" : "border-border"
          }`}
          required
        />
        {errors.anschrift && <p className="text-xs text-destructive mt-1">{errors.anschrift}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Zuständiges Gericht <span className="text-muted-foreground text-xs">(optional)</span>
        </label>
        <input
          type="text"
          name="zustaendiges_gericht"
          value={formData.zustaendiges_gericht}
          onChange={handleChange}
          placeholder="z.B. Amtsgericht Berlin-Mitte"
          className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
      </div>

      <div className="border border-border rounded-md p-4 bg-muted/30">
        <label className="block text-sm font-medium mb-3">Kontaktgründe</label>
        <div className="space-y-2">
          {CONTACT_OPTIONS.map((reason) => (
            <label key={reason} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.kontaktgruende.includes(reason)}
                onChange={() => handleContactReasonsChange(reason)}
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm">{reason}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Speichern
        </Button>
      </div>
    </form>
  )
}
