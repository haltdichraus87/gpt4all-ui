export interface Debt {
  id: string
  glaeubiger: string
  betrag: number
  faelligkeitsdatum: string
  status: "offen" | "in Bearbeitung" | "erledigt"
  aktenzeichen: string
  anschrift: string
  zustaendiges_gericht: string
  kontaktgruende: string[]
}
