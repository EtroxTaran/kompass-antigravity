# Project Cost Form - Figma Make Prompt

## Context & Purpose

- **Component Type**: Cost Entry Form for Projects
- **User Roles**: PLAN (create/edit), KALK (review), GF (approve), BUCH (process)
- **Usage Context**: Track material costs, subcontractor costs, other project expenses
- **Business Value**: Project profitability tracking, accurate costing, budget control

## Design Requirements

### Visual Hierarchy

- **Project context prominent**: Clear project association
- **Cost categorization**: Material, labor, subcontractor, other
- **Budget impact**: Show remaining budget
- **Approval workflow**: Clear status indicators

### Form Structure

- Project selector with budget info
- Cost type classification
- Amount and quantity inputs
- Vendor/supplier information
- Receipt attachment
- Approval routing

### shadcn/ui Components

- Form, Select, Input, DatePicker
- FileUpload, Card, Progress
- Alert for budget warnings

## Figma Make Prompt

Create a comprehensive project cost entry form for KOMPASS that enables tracking of material costs, subcontractor expenses, and other project-related costs with budget monitoring.

**Desktop Form (700px × 800px):**

```
┌─────────────────────────────────────────────┐
│ Projektkosten erfassen                  [×] │
├─────────────────────────────────────────────┤
│                                             │
│ Projekt *                                   │
│ [Projekt Phoenix - Website Relaunch ▼]      │
│                                             │
│ Budget-Übersicht                            │
│ ┌───────────────────────────────────────┐   │
│ │ Gesamt: €45.000                       │   │
│ │ Verbraucht: €28.750 (64%)            │   │
│ │ ████████████████░░░░░░░░              │   │
│ │ Verbleibend: €16.250                  │   │
│ └───────────────────────────────────────┘   │
│                                             │
│ ─── Kostendetails ───                       │
│                                             │
│ Kostenart *                                 │
│ [Material/Lieferung ▼]                      │
│ • Material/Lieferung                        │
│ • Fremdleistung/Subunternehmer             │
│ • Reise/Unterkunft                         │
│ • Sonstige Projektkosten                   │
│                                             │
│ Bezeichnung *                               │
│ [Server Hardware für Hosting]               │
│                                             │
│ Lieferant/Anbieter *                        │
│ [🔍 Suchen oder neu anlegen...]             │
│ └─ TechSupply GmbH                         │
│                                             │
│ ┌──────────────┬───────────┬──────────┐    │
│ │ Menge        │ Einheit   │ Einzelpr.│    │
│ │ [3]          │ [Stück ▼] │ [€850,00]│    │
│ └──────────────┴───────────┴──────────┘    │
│                                             │
│ ┌──────────────┬────────────────────┐      │
│ │ Netto        │ MwSt.              │      │
│ │ €2.550,00    │ [19% ▼] €484,50    │      │
│ └──────────────┴────────────────────┘      │
│                                             │
│ Gesamtbetrag: €3.034,50                     │
│                                             │
│ ─── Weitere Informationen ───               │
│                                             │
│ Rechnungsnummer                             │
│ [RE-2025-4567]                              │
│                                             │
│ Rechnungsdatum *                            │
│ [05.02.2025 📅]                             │
│                                             │
│ Zahlungsziel                                │
│ [20.02.2025 📅] (15 Tage verbleibend)       │
│                                             │
│ Beleg anhängen *                            │
│ [📎 Datei auswählen] RE-2025-4567.pdf (2MB) │
│                                             │
│ Notizen                                     │
│ [Inkl. 3 Jahre Garantie und Support]        │
│                                             │
│ ⚠️ Diese Kosten überschreiten das           │
│ verbleibende Budget um €1.284,50            │
│                                             │
│ [Abbrechen]        [Entwurf] [Zur Freigabe] │
└─────────────────────────────────────────────┘
```

**Mobile Form (375px):**

```
┌─────────────────────────────┐
│ [←] Neue Projektkosten      │
├─────────────────────────────┤
│                             │
│ Projekt                     │
│ [Phoenix Website ▼]         │
│                             │
│ Budget: 36% verfügbar       │
│ ████████████░░░░░           │
│ €16.250 von €45.000         │
│                             │
│ Was wurde gekauft? *        │
│ [Server Hardware]           │
│                             │
│ Lieferant *                 │
│ [TechSupply GmbH ▼]         │
│                             │
│ Betrag                      │
│ [€ 3.034,50]                │
│ ⚠️ Überschreitet Budget      │
│                             │
│ [📸 Rechnung fotografieren]  │
│                             │
│ [Speichern]                 │
└─────────────────────────────┘
```

**Cost Categories with Icons:**

```
┌─────────────────────────────┐
│ 🛠️ Material/Lieferung        │
│    Hardware, Software,      │
│    Baumaterial, Werkzeug    │
│                             │
│ 👷 Fremdleistung             │
│    Subunternehmer,          │
│    Freelancer, Berater      │
│                             │
│ ✈️ Reise/Unterkunft          │
│    Projektbezogene Reisen,  │
│    Hotels, Mietwagen        │
│                             │
│ 📦 Sonstige                  │
│    Versand, Gebühren,       │
│    Sonderausgaben           │
└─────────────────────────────┘
```

**Vendor Quick Add (Modal):**

```
┌─────────────────────────────┐
│ Neuer Lieferant        [×] │
├─────────────────────────────┤
│                             │
│ Firmenname *                │
│ [_____________________]     │
│                             │
│ Lieferantennummer           │
│ [L-2025-___] (auto)         │
│                             │
│ Steuernummer                │
│ [DE_____________]           │
│                             │
│ Kontakt                     │
│ [Name: ___________]         │
│ [Email: __________]         │
│ [Tel: ____________]         │
│                             │
│ Zahlungsbedingungen         │
│ [30 Tage netto ▼]           │
│                             │
│ [Abbrechen] [Speichern]     │
└─────────────────────────────┘
```

**Approval Status Flow:**

```
┌─────────────────────────────────────────┐
│ Status: Zur Freigabe eingereicht         │
├─────────────────────────────────────────┤
│                                         │
│ [Entwurf] → [Eingereicht] → [Freigabe] │
│              ↓                          │
│         [Abgelehnt]    [Gebucht]        │
│                                         │
│ Nächster Schritt:                       │
│ Warte auf Freigabe durch PLAN           │
│                                         │
│ Freigabestufen:                         │
│ ☑ PLAN (< €5.000)                       │
│ ⏳ KALK (< €20.000) - Ausstehend        │
│ ○ GF (> €20.000)                        │
└─────────────────────────────────────────┘
```

**Budget Warning Dialog:**

```
┌─────────────────────────────┐
│ Budget-Warnung         [×] │
├─────────────────────────────┤
│                             │
│ ⚠️ Diese Kosten würden das   │
│ Projektbudget überschreiten:│
│                             │
│ Budget:      €45.000,00     │
│ Verbraucht:  €28.750,00     │
│ Diese Kosten: €3.034,50     │
│ ─────────────────────────   │
│ Überschreitung: €1.284,50   │
│                             │
│ Möchten Sie fortfahren?     │
│ Die Kosten benötigen eine   │
│ Sonderfreigabe durch GF.    │
│                             │
│ [Abbrechen] [Fortfahren]    │
└─────────────────────────────┘
```

**Cost List Preview (Project Context):**

```
┌─────────────────────────────────────────┐
│ Projektkosten - Projekt Phoenix          │
├─────────────────────────────────────────┤
│ Filter: [Alle ▼] [Diesen Monat ▼]       │
├─────────────────────────────────────────┤
│                                         │
│ 05.02. Server Hardware        €3.034,50│
│        TechSupply GmbH       ⏳ Freigabe │
│                                         │
│ 03.02. Freelancer UI/UX       €2.400,00│
│        Max Designer          ✓ Gebucht  │
│                                         │
│ 28.01. Adobe Lizenzen          €659,88 │
│        Adobe Inc.            ✓ Gebucht  │
│                                         │
│ ─────────────────────────────────────── │
│ Gesamt diese Ansicht:        €6.094,38  │
└─────────────────────────────────────────┘
```

## Interaction Patterns

- **Budget visualization**: Real-time impact preview
- **Smart categorization**: Suggest based on vendor/description
- **Receipt OCR**: Extract data from photo
- **Approval routing**: Automatic based on amount
- **Duplicate detection**: Warn if similar cost exists

## German Labels & Content

- **Projektkosten**: Project costs
- **Fremdleistung**: External services
- **Einzelpreis**: Unit price
- **Zahlungsziel**: Payment due date
- **Zur Freigabe**: For approval
- **Gebucht**: Booked/Posted
- **Überschreitung**: Exceeded

## Validation Rules

- Project required and active
- Amount > 0
- Receipt/invoice required
- Invoice date not future
- Vendor must exist
- Budget warnings if exceeded

## Cost Approval Matrix

| Amount      | Approver     | SLA     |
| ----------- | ------------ | ------- |
| < €1.000    | Auto-approve | Instant |
| < €5.000    | PLAN         | 1 day   |
| < €20.000   | KALK         | 2 days  |
| > €20.000   | GF           | 3 days  |
| Over budget | GF           | Special |

## Implementation Notes

```bash
# Integrations
- ERP system for vendor master data
- Document management for receipts
- Notification system for approvals
- Budget tracking system

# Performance
- Real-time budget calculation
- Async receipt upload
- Cached vendor list
- Optimistic UI updates

# Compliance
- GoBD compliant storage
- Audit trail for changes
- Immutable after booking
- 10-year retention
```

## Analytics Events

- cost_entry_created
- budget_warning_shown
- approval_requested
- approval_time_by_level
- cost_category_distribution
- vendor_quick_add_used
