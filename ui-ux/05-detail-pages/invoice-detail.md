# Invoice Detail - Figma Make Prompt

## Context & Purpose
- **Component Type**: Invoice Detail View (GoBD-compliant)
- **User Roles**: GF/BUCH (full), PLAN/ADM (read-only)
- **Usage Context**: View invoice details, payment tracking, immutability
- **Business Value**: Financial tracking and GoBD compliance

## Figma Make Prompt

Create an invoice detail view for KOMPASS showing invoice data, line items, calculations, payment status, and immutability indicators with German labels and GoBD compliance.

**Header:**
- Breadcrumb: "Dashboard > Rechnungen > R-2024-00456"
- Invoice number: "R-2024-00456" (32px, bold, blue, monospace)
- Lock icon: If finalized (gray, 24px) - GoBD immutable
- Status badge: "Ausstehend" (amber) or "Bezahlt" (green) or "Überfällig" (red)
- Customer: "Hofladen Müller GmbH" (clickable link)
- Actions: "PDF anzeigen", "Herunterladen", "E-Mail senden", "Zahlung buchen", "Drucken"

**Invoice Metadata Card:**
- Rechnungsdatum: "15.11.2024"
- Fälligkeitsdatum: "15.12.2024" (red if overdue)
- Zahlungsziel: "30 Tage"
- Projekt: "P-2024-B023" (link if applicable)
- Erstellt von: "Anna Weber" (BUCH)

**Line Items Table:**
- Columns: Pos., Bezeichnung, Menge, Einheit, Einzelpreis, Gesamtpreis, MwSt.
- Rows: All invoice line items
- Example:
  1 | Ladeneinrichtung Komplett | 1 | Psch | € 50.000,00 | € 50.000,00 | 19%
  2 | Montagearbeiten | 40 | Std | € 85,00 | € 3.400,00 | 19%
- Read-only: Grayed background if finalized

**Calculation Card (Right Sidebar):**
- Zwischensumme (netto): "€ 53.400,00"
- MwSt. 19%: "€ 10.146,00"
- Rabatt: "- € 500,00" (if any)
- Divider
- **Gesamtsumme (brutto)**: "€ 63.046,00" (32px, bold, blue)

**Payment Tracking Section:**
- Status: "Ausstehend" or "Bezahlt" or "Teilweise bezahlt"
- Paid amount: "€ 0" or "€ 63.046" or "€ 30.000 / € 63.046"
- Payment history table: Date, amount, method
- Add payment button: "Zahlung buchen" (blue, only if unpaid and BUCH/GF)

**GoBD Compliance Section:**
- Card with shield icon
- Status: "Abgeschlossen" (green) or "Entwurf" (gray)
- Finalized date: "15.11.2024, 16:45 Uhr"
- SHA-256 hash: "a3b5c7..." (truncated, copy button)
- Änderungsprotokoll link: "Änderungsverlauf anzeigen"
- Warning: "Diese Rechnung ist gemäß GoBD-Vorschriften unveränderlich"

**Linked Entities:**
- Customer card: Link to customer detail
- Project card: Link to project detail (if applicable)
- Opportunity: Link if created from won opportunity

**Activity Log:**
- Timeline: Created, finalized, emailed, payment received
- Each event: Timestamp, user, action

**Documents:**
- PDF: "Rechnung_R-2024-00456.pdf" (download button)
- Email history: Sent dates and recipients

**Actions (If Draft):**
- "Bearbeiten" (edit line items, dates)
- "Finalisieren" (makes immutable)

**Actions (If Finalized):**
- "PDF anzeigen"
- "Per E-Mail senden"
- "Zahlung buchen" (if unpaid)
- "Mahnung senden" (if overdue)
- "Stornorechnung erstellen" (for GoBD-compliant correction)

**Mobile:** Full-screen, scrollable, calculation card sticky at bottom, actions FAB

## Implementation Notes
```bash
npx shadcn-ui@latest add card badge button table
```

