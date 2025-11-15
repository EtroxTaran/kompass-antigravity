# Figma Migration: Invoice → Offer/Contract

**Migration ID:** MIGRATION-002  
**Date:** 2025-01-28  
**Status:** Required  
**Impact:** High - Major UI/UX change

---

## Overview

This migration removes invoice-related UI components and replaces them with Offer and Contract management components. Invoicing is handled in Lexware, not KOMPASS.

---

## Components to DELETE

### 1. Invoice Form

- **File:** `ui-ux/03-entity-forms/invoice-form.md`
- **Status:** ❌ DELETED
- **Reason:** KOMPASS does not create invoices

### 2. Invoice Detail Page

- **File:** `ui-ux/05-detail-pages/invoice-detail.md`
- **Status:** ❌ DELETED
- **Reason:** KOMPASS does not manage invoices

### 3. Invoice List View

- **File:** `ui-ux/04-list-views/invoice-list.md`
- **Status:** ❌ DELETED
- **Reason:** KOMPASS does not list invoices

---

## Components to CREATE

### 1. Offer Form

- **File:** `ui-ux/03-entity-forms/offer-form.md`
- **Status:** ✅ CREATED
- **Purpose:** Create and manage sales offers (Angebote)
- **Key Features:**
  - PDF upload
  - Status workflow: Draft → Sent → Accepted/Rejected
  - Convert to Contract action

### 2. Offer Detail Page

- **File:** `ui-ux/05-detail-pages/offer-detail.md`
- **Status:** ✅ CREATED
- **Purpose:** View offer details with PDF viewer
- **Key Features:**
  - PDF viewer
  - Status management
  - Convert to Contract button

### 3. Offer List View

- **File:** `ui-ux/04-list-views/offer-list.md`
- **Status:** ✅ CREATED
- **Purpose:** Browse all offers with filtering
- **Key Features:**
  - Status badges
  - Pipeline value KPI
  - Conversion rate tracking

### 4. Contract Form

- **File:** `ui-ux/03-entity-forms/contract-form.md`
- **Status:** ✅ CREATED
- **Purpose:** Create and manage contracts (Auftragsbestätigungen)
- **Key Features:**
  - PDF upload
  - GoBD immutability after signing
  - Project linking

### 5. Contract Detail Page

- **File:** `ui-ux/05-detail-pages/contract-detail.md`
- **Status:** ✅ CREATED
- **Purpose:** View contract with GoBD compliance
- **Key Features:**
  - PDF viewer
  - GoBD lock indicator
  - Budget tracking
  - Activity timeline

### 6. Contract List View

- **File:** `ui-ux/04-list-views/contract-list.md`
- **Status:** ✅ CREATED
- **Purpose:** Browse all contracts with GoBD indicators
- **Key Features:**
  - GoBD lock icons
  - Financial summary
  - Project links

---

## Dashboard Updates

### BUCH Dashboard

- **File:** `ui-ux/06-dashboards/buch-dashboard.md`
- **Changes:**
  - ❌ Remove: Invoice KPIs, overdue invoices, invoice list
  - ✅ Add: Contract values, project margins, budget warnings
  - ✅ Add: Lexware integration status (Phase 2+)
- **Status:** ✅ UPDATED

### GF Dashboard

- **File:** `ui-ux/06-dashboards/gf-dashboard.md`
- **Changes:**
  - ❌ Remove: Invoice revenue tracking, overdue invoices
  - ✅ Add: Pipeline value (offers), contract values, margins
  - ✅ Add: Budget alerts, Lexware integration status
- **Status:** ✅ UPDATED

---

## Project Detail Page Updates

### Project Detail

- **File:** `ui-ux/05-detail-pages/project-detail.md`
- **Changes:**
  - ❌ Remove: "Rechnung erstellen" quick action
  - ✅ Add: "Vertrag anzeigen" quick action (if contract exists)
  - ✅ Add: "Zu Lexware" external link (for invoicing)
- **Status:** ✅ UPDATED

---

## Navigation Changes

### Main Navigation

**Old Structure:**

```
- Dashboard
- Kunden
- Projekte
- Rechnungen  ← REMOVE
- Berichte
```

**New Structure:**

```
- Dashboard
- Kunden
- Projekte
- Angebote      ← NEW
- Verträge      ← NEW
- Berichte
- Lexware →     ← NEW (external link)
```

### Customer Detail Page

**Tabs:**

- **Old:** Overview, Kontakte, Standorte, Opportunities, Projekte, Rechnungen
- **New:** Overview, Kontakte, Standorte, Opportunities, Angebote, Verträge, Projekte

**Changes:**

- ❌ Remove: "Rechnungen" tab
- ✅ Add: "Angebote" tab (list of offers)
- ✅ Add: "Verträge" tab (list of contracts)

---

## Quick Actions Updates

### Global Quick Actions (FAB/Sidebar)

**Old Actions:**

- - Neuer Kunde
- - Neue Opportunity
- - Neues Projekt
- - Neue Rechnung ← REMOVE

**New Actions:**

- - Neuer Kunde
- - Neue Opportunity
- - Neues Angebot ← NEW
- - Neuer Vertrag ← NEW
- - Neues Projekt

---

## Color Palette Changes

### Status Colors

**Removed (Invoice):**

- ❌ Draft: Gray
- ❌ Sent: Blue
- ❌ Paid: Green
- ❌ Overdue: Red

**Added (Offer):**

- ✅ Draft: Yellow (#FFC107)
- ✅ Sent: Blue (#2196F3)
- ✅ Accepted: Green (#4CAF50)
- ✅ Rejected: Red (#F44336)

**Added (Contract):**

- ✅ Draft: Yellow (#FFC107)
- ✅ Signed: Green (#4CAF50) + Lock icon
- ✅ InProgress: Blue (#2196F3)
- ✅ Completed: Gray (#9E9E9E)

---

## Icon Changes

### New Icons Required

1. **Offer Icon:** Document with pen (🗑️ → 📝)
2. **Contract Icon:** Document with checkmark (📄✓)
3. **GoBD Lock Icon:** Lock (🔒) - Green for GoBD-protected contracts
4. **Lexware Icon:** External link (↗️)
5. **PDF Icon:** Document (📄)
6. **Margin Indicator:** Percentage badge

**Icon Library:** Use Lucide React icons

- `FileText` - Offer/Contract
- `Lock` - GoBD protection
- `ExternalLink` - Lexware link
- `FileCheck` - Signed contract
- `Percent` - Margin indicator

---

## German Label Changes

### Find and Replace in Figma

**Global Find/Replace:**

| Old Label          | New Label                               |
| ------------------ | --------------------------------------- |
| Rechnung           | Angebot (or Vertrag, context-dependent) |
| Rechnungsnummer    | Angebotsnummer / Vertragsnummer         |
| Rechnungsdatum     | Angebotsdatum / Vertragsdatum           |
| Rechnungsbetrag    | Angebotssumme / Auftragswert            |
| Rechnung erstellen | Angebot erstellen                       |
| Rechnung anzeigen  | Vertrag anzeigen                        |
| Fälligkeitsdatum   | Gültig bis (for Offers)                 |
| Bezahlt            | Angenommen (for Offers)                 |
| Überfällig         | Abgelehnt (for Offers)                  |
| Zahlungsstatus     | Vertragsstatus                          |
| Offene Rechnungen  | Aktive Verträge                         |
| Rechnungsübersicht | Vertragsübersicht                       |

**Specific Contexts:**

- Customer detail: "Rechnungen" tab → "Verträge" tab
- Project detail: "Rechnung erstellen" → "Vertrag anzeigen"
- Dashboard: "Offene Forderungen" → "Aktive Vertragswerte"
- Quick actions: "+ Neue Rechnung" → "+ Neuer Vertrag"

---

## Wireframe Annotations

### Invoice Form → Offer Form

**Key Differences:**

1. ❌ Remove: Line items table, tax calculations, payment terms
2. ✅ Add: PDF upload area (drag & drop)
3. ✅ Add: Status workflow (Draft/Sent/Accepted/Rejected)
4. ✅ Add: "Convert to Contract" button (Accepted status only)
5. ✅ Simplify: Single "Total Amount" field (no line-item breakdown)

### Invoice Detail → Offer Detail

**Key Differences:**

1. ❌ Remove: Payment tracking, dunning (Mahnwesen)
2. ✅ Add: PDF viewer (embedded)
3. ✅ Add: Status management buttons
4. ✅ Add: "Convert to Contract" action
5. ✅ Keep: Customer link, date fields, total amount

### Invoice List → Contract List

**Key Differences:**

1. ❌ Remove: Payment status column, overdue indicators
2. ✅ Add: GoBD lock icon (first column)
3. ✅ Add: Project link column
4. ✅ Add: Margin % column (color-coded)
5. ✅ Add: Financial summary bar (total contract value)

---

## Accessibility Updates

### ARIA Labels

**Update ARIA labels:**

| Old                             | New                            |
| ------------------------------- | ------------------------------ |
| aria-label="Rechnung erstellen" | aria-label="Angebot erstellen" |
| aria-label="Rechnungsliste"     | aria-label="Vertragsliste"     |
| aria-label="Rechnungsstatus"    | aria-label="Vertragsstatus"    |
| aria-label="Bezahlt"            | aria-label="Angenommen"        |
| aria-label="Überfällig"         | aria-label="Abgelehnt"         |

### Screen Reader Announcements

**Update announcements:**

- "Rechnung erfolgreich erstellt" → "Angebot erfolgreich erstellt"
- "Rechnung als bezahlt markiert" → "Angebot als angenommen markiert"
- "Rechnung gelöscht" → "Angebot gelöscht"

---

## Mobile Responsive Changes

### Offer/Contract Forms

- **Mobile:** Single column layout (same as invoice forms)
- **PDF Upload:** Full-width drag & drop area (min 200px height)
- **Actions:** Sticky bottom bar with primary actions

### Offer/Contract Lists

- **Mobile:** Card view instead of table
- **Cards:** Show offer/contract number, customer, date, amount, status badge
- **Actions:** Bottom-right of each card

---

## Animation & Interaction Changes

### Status Transitions

**Offer Status:**

1. Draft → Sent: Smooth badge color transition (yellow → blue)
2. Sent → Accepted: Confetti animation + success message
3. Sent → Rejected: Fade to gray with reason modal

**Contract Status:**

1. Draft → Signed: Lock icon animates in + green highlight
2. Signed → InProgress: Blue progress indicator appears
3. InProgress → Completed: Checkmark animation + completion banner

### GoBD Lock Animation

**When contract is signed:**

1. Lock icon fades in (300ms)
2. Row background tints green (#f0fdf4)
3. Toast notification: "Vertrag GoBD-konform finalisiert"

---

## Testing Checklist

After migration, verify in Figma:

### Components

- [ ] All invoice components deleted
- [ ] All offer components created (3 total)
- [ ] All contract components created (3 total)
- [ ] Dashboard KPIs updated (BUCH, GF)
- [ ] Project detail updated (quick actions)

### Navigation

- [ ] "Rechnungen" menu item removed
- [ ] "Angebote" menu item added
- [ ] "Verträge" menu item added
- [ ] "Lexware" external link added

### Labels

- [ ] All "Rechnung" labels replaced with "Angebot" or "Vertrag"
- [ ] German labels correct and consistent
- [ ] ARIA labels updated

### Colors

- [ ] Offer status badges: Yellow/Blue/Green/Red
- [ ] Contract status badges: Yellow/Green/Blue/Gray
- [ ] GoBD lock icon: Green
- [ ] Margin indicators: Green/Yellow/Red

### Icons

- [ ] Offer icon: Document with pen
- [ ] Contract icon: Document with checkmark
- [ ] GoBD lock icon: Lock
- [ ] Lexware icon: External link
- [ ] All icons from Lucide React

### Responsiveness

- [ ] Mobile: Forms single column
- [ ] Mobile: Lists switch to card view
- [ ] Mobile: Actions in sticky bottom bar
- [ ] Touch targets: 44px minimum

### Accessibility

- [ ] ARIA labels updated
- [ ] Screen reader announcements updated
- [ ] Keyboard navigation works
- [ ] Focus indicators present

---

## Rollout Plan

### Phase 1: Preparation (Week 1)

- Review this migration document with UX team
- Delete invoice components from Figma
- Create new Offer/Contract components skeleton

### Phase 2: Implementation (Weeks 2-3)

- Implement Offer components (form, detail, list)
- Implement Contract components (form, detail, list)
- Update dashboards (BUCH, GF)
- Update navigation

### Phase 3: Review & QA (Week 4)

- Internal review with Product/UX team
- Accessibility audit
- Mobile responsive testing
- German label verification

### Phase 4: Handoff (Week 5)

- Export Figma components for developers
- Create Figma Make prompts (already created)
- Developer handoff meeting
- Documentation update

---

## Developer Notes

### Implementation Order

**Backend First:**

1. Create Offer/Contract entities in data model
2. Create Offer/Contract API endpoints
3. Add PDF upload/storage functionality

**Frontend:**

1. Create Offer form, detail, list views
2. Create Contract form, detail, list views
3. Update dashboards to remove invoice KPIs
4. Update project detail to remove invoice action
5. Add Lexware external link (Phase 2+)

**Testing:**

1. E2E tests for Offer workflow (create → send → accept → convert to contract)
2. E2E tests for Contract workflow (create → sign → link to project)
3. PDF upload/download tests
4. GoBD immutability tests (contract cannot be edited after signing)

---

## Questions & Clarifications

**Q: What happens to existing invoice data?**  
A: KOMPASS never had invoice data. Invoices are in Lexware and will remain there.

**Q: Can users still create invoices?**  
A: Yes, in Lexware. KOMPASS provides a link "Zu Lexware" for easy access.

**Q: What about invoice status tracking?**  
A: Phase 2+ may add read-only Lexware integration to show invoice status in project views.

**Q: Are offers and contracts GoBD-relevant?**  
A: Contracts are GoBD-relevant after signing (immutable). Offers are not (can be edited/deleted).

---

## Success Criteria

Migration is successful when:

- [ ] All invoice components removed from Figma
- [ ] All offer/contract components created and approved
- [ ] No references to "Rechnung" in UI (except for context about Lexware)
- [ ] German labels are correct and consistent
- [ ] Mobile responsive design works
- [ ] Accessibility requirements met
- [ ] Developers have clear Figma Make prompts
- [ ] Product Owner approves final design

---

**Prepared By:** UX/Product Team  
**Approval Required:** Product Owner, UX Lead, Tech Lead  
**Implementation Timeline:** 4-5 weeks (Figma redesign + development)

---

**END OF MIGRATION DOCUMENT**
