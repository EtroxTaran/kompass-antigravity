# Figma Make: Financial Flow Update (Offer → Contract → Invoice)

**Purpose:** Replace direct invoice creation with proper Offer → Contract → Invoice flow, update dashboards with contract metrics
**Action:** Transform invoice forms into offer forms, add contract step, update metrics
**Date:** 2025-02-06

---

## 🎯 MASTER PROMPT FOR FIGMA MAKE

**Copy everything below this line and paste into Figma Make:**

---

Transform the KOMPASS financial workflow from direct invoice creation to a proper three-step process: Offer (Angebot) → Contract (Auftrag) → Invoice (Rechnung). Update all invoice-related forms to start with offers, add contract confirmation step, and update dashboard metrics to focus on contracts instead of invoices.

## DESIGN SPECIFICATION: Offer Form (Previously Invoice Form)

### Form Title and Flow Indicator

**FIND in Invoice Form:**
- Title "Neue Rechnung"
- Header section

**REPLACE WITH:**
```
┌─────────────────────────────────────────────┐
│ Neues Angebot                          [×] │
├─────────────────────────────────────────────┤
│                                             │
│ [1) Angebot] → [2) Auftrag] → [3) Rechnung]│
│     ████         ░░░░         ░░░░         │
└─────────────────────────────────────────────┘
```

**Specifications:**
- Title: "Neues Angebot" (24px semibold)
- Flow steps: Pills with 36px height
- Active step: Primary blue (#3B82F6) with white text
- Inactive steps: Gray (#E5E7EB) with gray text (#9CA3AF)
- Progress bar: 4px height below steps

### Document Number Field Update

**FIND:**
- Field labeled "Rechnungsnummer"
- Pattern "R-YYYY-#####"

**REPLACE WITH:**
```
Angebotsnummer
[A-2025-00123] (automatisch)
```

**Pattern:** `A-YYYY-#####` (A for Angebot instead of R for Rechnung)

### Validity Period Addition

**FIND:**
- After customer selection
- Before line items

**ADD NEW FIELD:**
```
Gültigkeitsdauer
[30 Tage ▼]
• 14 Tage • 30 Tage • 60 Tage • 90 Tage
Gültig bis: 08.03.2025
```

**Specifications:**
- Dropdown: Standard 48px height
- Helper text: Inter 12px regular (#6B7280)
- Auto-calculate end date based on creation date

### Status Field Update

**FIND:**
- Status field with invoice statuses

**REPLACE WITH:**
```
Status
• Entwurf (Draft)
• Versendet (Sent)
• In Verhandlung (In negotiation)
• Angenommen → Auftrag (Accepted → Contract)
• Abgelehnt (Rejected)
• Abgelaufen (Expired)
```

### Action Buttons Update

**FIND:**
- Submit/Save buttons at form bottom

**REPLACE WITH:**
```
[Entwurf speichern] [Angebot versenden]

Nach Versand:
[PDF herunterladen] [Nachfassen] [In Auftrag umwandeln]
```

---

## DESIGN SPECIFICATION: Contract Form (New)

### Contract Conversion Dialog

**NEW DIALOG (600px × 400px):**
```
┌─────────────────────────────────────────────┐
│ Angebot in Auftrag umwandeln           [×] │
├─────────────────────────────────────────────┤
│                                             │
│ Angebot: A-2025-00123                      │
│ Kunde: Hofladen Müller GmbH                 │
│ Betrag: €4.567,89                           │
│                                             │
│ Auftragsnummer                              │
│ [C-2025-00045] (automatisch)                │
│                                             │
│ Auftragseingang                             │
│ [06.02.2025 📅]                             │
│                                             │
│ ☑ Originalpositionen übernehmen             │
│ ☑ Kunde per E-Mail benachrichtigen          │
│                                             │
│ [Abbrechen] [Auftrag erstellen]             │
└─────────────────────────────────────────────┘
```

**Pattern:** `C-YYYY-#####` (C for Contract/Auftrag)

### Contract Status Flow

```
[1) Angebot] → [2) Auftrag] → [3) Rechnung]
    ████         ████         ░░░░

Status: Auftrag bestätigt
• In Bearbeitung
• Teilgeliefert
• Abgeschlossen → Rechnung erstellen
• Storniert
```

---

## DESIGN SPECIFICATION: Updated Invoice Form

### Invoice from Contract

**FIND:**
- Invoice creation from scratch

**REPLACE WITH:**
```
┌─────────────────────────────────────────────┐
│ Rechnung aus Auftrag erstellen         [×] │
├─────────────────────────────────────────────┤
│                                             │
│ [1) Angebot] → [2) Auftrag] → [3) Rechnung]│
│     ████         ████         ████         │
│                                             │
│ Auftrag: C-2025-00045                      │
│ Kunde: Hofladen Müller GmbH                 │
│                                             │
│ Rechnungsart                                │
│ ○ Komplettrechnung (100%)                   │
│ ● Teilrechnung                              │
│   Prozentsatz: [50]%                        │
│   Betrag: €2.283,95                         │
│ ○ Schlussrechnung                           │
│                                             │
│ Rechnungsnummer                             │
│ [R-2025-00789] (automatisch)                │
│                                             │
│ [Abbrechen] [Rechnung erstellen]            │
└─────────────────────────────────────────────┘
```

---

## DASHBOARD UPDATES

### GF Dashboard - Contract Metrics

**FIND:**
- "Offene Rechnungen" metric card
- Invoice-based KPIs

**REPLACE WITH:**
```
┌─────────────────────────────────────┐
│ Offene Aufträge                     │
│ €125.450                            │
│ 23 Aufträge                         │
│ ↑ 15% vs. Vormonat                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Auftragseingang diese Woche         │
│ €45.670                             │
│ 8 neue Aufträge                     │
│ Ø Auftragswert: €5.708              │
└─────────────────────────────────────┘
```

### Sales Pipeline Widget Update

**FIND:**
- Direct opportunity to invoice flow

**REPLACE WITH:**
```
Pipeline-Übersicht
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Opportunities     €450K (45)
     ↓
Angebote         €280K (23)
     ↓
Aufträge         €125K (18)
     ↓
Rechnungen       €98K (15)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Conversion: 22% (Opp → Auftrag)
```

---

## LIST VIEW UPDATES

### Transform Invoice List to Multi-Document List

**FIND:**
- Invoice list view

**REPLACE WITH TABS:**
```
[Angebote] [Aufträge] [Rechnungen]

Angebote (45)
┌─────────────────────────────────────────────┐
│ A-2025-00125  Hofladen Müller    €4.567    │
│ 05.02.2025    Gültig bis 07.03   Versendet │
│                                             │
│ A-2025-00124  Baumarkt Weber     €12.340   │
│ 04.02.2025    Gültig bis 06.03   Entwurf   │
└─────────────────────────────────────────────┘

Status-Filter:
☑ Entwurf ☑ Versendet ☑ In Verhandlung
☑ Angenommen ☐ Abgelehnt ☐ Abgelaufen
```

---

## LEXWARE INTEGRATION PLACEHOLDERS

### Export Dialog Update

**FIND:**
- Generic export options

**ADD:**
```
Export nach Lexware
┌─────────────────────────────────────┐
│ 💼 Lexware Anbindung                │
│                                     │
│ Format: Lexware Office              │
│ ○ Angebote exportieren              │
│ ● Aufträge exportieren              │
│ ○ Rechnungen exportieren            │
│                                     │
│ ☑ Nur neue seit letztem Export     │
│ Letzter Export: 01.02.2025          │
│                                     │
│ [Exportieren]                       │
└─────────────────────────────────────┘
```

---

## MOBILE ADAPTATIONS

### Offer Creation Mobile (375px)

```
┌─────────────────────────────┐
│ [←] Neues Angebot           │
├─────────────────────────────┤
│ [Angebot]→[Auftrag]→[Rechng]│
│  ████     ░░░░     ░░░░    │
├─────────────────────────────┤
│ Kunde *                     │
│ [Hofladen Müller ▼]         │
│                             │
│ Gültig für                  │
│ [30 Tage ▼]                 │
│                             │
│ [+ Position hinzufügen]     │
│                             │
│ Summe: €0,00                │
│                             │
│ [Entwurf] [Versenden]       │
└─────────────────────────────┘
```

---

## WORKFLOW VALIDATIONS

### Status Transitions

**Offer (Angebot):**
- Draft → Sent (one-way)
- Sent → In Negotiation → Accepted/Rejected
- Any → Expired (automatic after validity)

**Contract (Auftrag):**
- Can only be created from accepted offer
- In Progress → Partially Delivered → Completed
- Completed → Create Invoice (one-way)

**Invoice (Rechnung):**
- Can only be created from contract
- Maintains reference to contract and original offer
- Immutable after finalization (GoBD)

---

## QUALITY CHECKLIST

After applying this prompt, verify:
- [ ] All "Invoice" forms renamed to "Offer" forms
- [ ] Flow indicator shows 3-step process
- [ ] Offer number format: A-YYYY-#####
- [ ] Contract number format: C-YYYY-#####
- [ ] Invoice requires contract reference
- [ ] Validity period field added to offers
- [ ] Dashboard shows contract metrics, not invoice metrics
- [ ] Pipeline widget shows 4 stages (Opp→Offer→Contract→Invoice)
- [ ] Lexware export placeholder added
- [ ] Mobile layouts maintain flow visibility
- [ ] All German labels correct (Angebot, Auftrag, Rechnung)

---

**Total Files Updated:** 8
**Forms Transformed:** 3 (Offer, Contract, Invoice)
**List Views Updated:** 1 (Multi-tab document list)
**Dashboards Updated:** 2 (GF, ADM)
**New Features:** Flow indicator, Contract form, Lexware export

---

END OF PROMPT
