# Figma Make: Contract Form (Auftragsbestätigung-Erfassung)

**Purpose:** Create form for entering or uploading Contracts (Auftragsbestätigungen) in KOMPASS  
**Action:** Design contract creation form with PDF upload and GoBD compliance  
**Date:** 2025-01-28

---

## 🎯 MASTER PROMPT FOR FIGMA MAKE

**Copy everything below this line and paste into Figma Make:**

---

Create a form for **Contract Creation (Auftragsbestätigung-Erfassung)** in KOMPASS. Contracts are GoBD-compliant documents that become immutable after signing.

## FORM STRUCTURE

### Header
- Title: "Vertrag erstellen" (Create Contract) OR "Aus Angebot erstellen" (if converting from offer)
- Subtitle: "Auftragsbestätigung für Kunde: [Customer Name]"
- Status Badge: Show current status (Draft/Signed/InProgress/Completed)
- **Warning (if converting from Offer):** "✓ Daten werden aus Angebot A-2025-00123 übernommen"

### Form Sections

#### Section 1: Basic Information

1. **Customer** (Read-only)
   - Label: "Kunde"
   - Value: Customer name from context
   - Cannot be changed

2. **Contract Number** (Auto-generated or Manual)
   - Label: "Vertragsnummer"
   - Placeholder: "Automatisch generiert (AB-YYYY-#####)"
   - Help text: "Wird automatisch vergeben, kann manuell überschrieben werden"
   - Format: AB-2025-00045
   - GoBD Note: "GoBD-konforme fortlaufende Nummerierung"

3. **Contract Date**
   - Label: "Vertragsdatum"
   - Type: Date picker
   - Default: Today
   - Required: Yes
   - Help text: "Datum der Vertragsunterzeichnung"

4. **Start Date**
   - Label: "Leistungsbeginn"
   - Type: Date picker
   - Default: +7 days from contract date
   - Required: Yes
   - Validation: Must be ≥ contract date

5. **End Date** (Optional)
   - Label: "Leistungsende"
   - Type: Date picker
   - Optional
   - Validation: If set, must be > start date
   - Help text: "Optional: Geplantes Projektende"

#### Section 2: Financial Information

6. **Contract Value**
   - Label: "Auftragswert (Gesamt)"
   - Type: Currency input (€)
   - Placeholder: "0,00 €"
   - Required: Yes
   - Min: 0
   - Max: 10,000,000
   - Format: German currency format (1.234,56 €)
   - Help text: "Gesamtsumme inkl. MwSt."
   - **If from Offer:** Pre-filled from offer.totalValue

7. **Net Amount** (Optional)
   - Label: "Nettobetrag"
   - Type: Currency input (€)
   - Placeholder: "0,00 €"
   - Help text: "Optional: Nettobetrag ohne MwSt."

8. **Tax Rate** (Optional)
   - Label: "MwSt.-Satz"
   - Type: Select dropdown
   - Options: 19%, 7%, 0%
   - Default: 19%

#### Section 3: Document Upload

9. **PDF Upload**
   - Label: "Auftragsbestätigung als PDF hochladen"
   - Type: File upload (drag & drop area)
   - Accept: .pdf only
   - Max size: 10 MB
   - **Required before "Signed" status**
   - Display: Show file name + file size after upload
   - Actions: "Hochladen" button, "Vorschau" button, "Löschen" button
   - **Drag & Drop Area:**
     - Height: 200px
     - Border: 2px dashed gray-300
     - Text: "PDF hier ablegen oder Datei auswählen"
     - Icon: Upload cloud icon (64px)

#### Section 4: Linked Entities

10. **Linked Offer** (Optional, auto-filled if converting)
    - Label: "Ursprüngliches Angebot"
    - Type: Dropdown select OR read-only link (if converting)
    - Options: List of accepted offers for this customer
    - Optional: Can be empty
    - **If from Offer:** Read-only link to source offer

11. **Linked Project** (Optional)
    - Label: "Zugeordnetes Projekt"
    - Type: Dropdown select
    - Options: List of projects for this customer
    - Optional: Can be linked later
    - Help text: "Optional: Projekt zuordnen (oder später erstellen)"

#### Section 5: Description & Notes

12. **Contract Title** (Optional)
    - Label: "Titel/Beschreibung"
    - Type: Text input
    - Placeholder: "z.B. Regalsystem Filiale München Süd - Komplett"
    - Max length: 200 chars

13. **Notes**
    - Label: "Interne Notizen"
    - Type: Textarea
    - Placeholder: "Interne Hinweise zu diesem Vertrag..."
    - Max length: 2000 chars
    - Optional

#### Section 6: Status Management

14. **Status**
    - Label: "Vertragsstatus"
    - Type: Select dropdown (conditionally editable)
    - Options:
      - Draft (Entwurf) - Yellow - Editable
      - Signed (Unterzeichnet) - Green - **Immutable after this**
      - InProgress (In Bearbeitung) - Blue
      - Completed (Abgeschlossen) - Gray
    - Default: Draft
    - **Warning:** "⚠️ Nach 'Unterzeichnet' wird der Vertrag GoBD-konform unveränderlich!"

---

## FORM ACTIONS

### Primary Actions (Right side, bottom)

1. **Save as Draft** (Draft status only)
   - Button: Secondary style
   - Label: "Als Entwurf speichern"
   - Action: Save contract without full validation
   - Shortcut: Ctrl+S

2. **Mark as Signed** (Draft status, with PDF)
   - Button: Success style (green)
   - Label: "Als unterzeichnet markieren"
   - Action: Change status to "Signed" → **Immutable**
   - **Confirmation Dialog:**
     - Title: "Vertrag finalisieren?"
     - Message: "Nach dem Unterzeichnen wird der Vertrag GoBD-konform unveränderlich. Änderungen sind dann nur noch mit GF-Freigabe möglich. Fortfahren?"
     - Actions: "Abbrechen" (gray), "Unterzeichnen" (green)
   - Validation: Requires PDF upload + all required fields

3. **Start Project** (Signed status only)
   - Button: Primary style
   - Label: "Projekt starten"
   - Action: Change status to "InProgress" + create linked project
   - Shortcut: Ctrl+Enter

4. **Mark Complete** (InProgress status only)
   - Button: Secondary style
   - Label: "Als abgeschlossen markieren"
   - Action: Change status to "Completed"
   - Confirmation: "Vertrag als abgeschlossen markieren?"

### Secondary Actions (Left side, bottom)

5. **Cancel**
   - Button: Text button
   - Label: "Abbrechen"
   - Action: Discard changes and return to list
   - Confirmation: "Nicht gespeicherte Änderungen verwerfen?" (if dirty)

6. **Delete** (Draft status only)
   - Button: Text button (red)
   - Label: "Löschen"
   - Action: Delete contract
   - Confirmation: "Vertrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."

---

## VALIDATION RULES

1. **Contract Date**: Required, cannot be in future
2. **Start Date**: Required, must be ≥ contract date
3. **End Date**: If set, must be > start date
4. **Contract Value**: Required, must be > 0
5. **PDF Upload**: Required before status = "Signed"
6. **Status Transitions**:
   - Draft → Signed (requires PDF + validation)
   - Signed → InProgress (immutable except status)
   - InProgress → Completed
   - **No reverse transitions allowed**
7. **Immutability**: After "Signed", only status can change (fields are locked)

---

## GOBD COMPLIANCE INDICATORS

### Immutability Warning
- **Position:** Top of form (if status >= Signed)
- **Style:** Warning banner (yellow background)
- **Icon:** Lock icon
- **Text:** "🔒 Dieser Vertrag ist GoBD-konform finalisiert und kann nicht mehr bearbeitet werden. Änderungen erfordern GF-Freigabe und werden im Änderungsprotokoll dokumentiert."

### Change Log (if Signed)
- **Position:** Bottom of form
- **Title:** "Änderungsprotokoll (GoBD)"
- **Content:** List of all changes after signing
  - Date, User, Field, Old Value, New Value, Reason
- **Style:** Read-only table

---

## RESPONSIVE DESIGN

- **Desktop (>1024px)**: 2-column layout for fields
- **Tablet (768-1024px)**: 2-column layout, narrower
- **Mobile (<768px)**: Single column, full width inputs

---

## ACCESSIBILITY

- All fields have proper labels (ARIA-compliant)
- Required fields marked with "*"
- Help text below inputs (aria-describedby)
- Error messages in red below fields
- Keyboard navigation: Tab through fields
- Focus indicators on all interactive elements
- File upload button: 44px min touch target
- Warning dialogs: ARIA role="alertdialog"

---

## COLOR PALETTE

- **Draft Status:** #FFC107 (yellow)
- **Signed Status:** #4CAF50 (green)
- **InProgress Status:** #2196F3 (blue)
- **Completed Status:** #9E9E9E (gray)
- **Warning Banner:** #FFF3CD (light yellow background), #856404 (dark yellow text)
- **Lock Icon:** #6B7280 (gray-500)

---

## LOADING STATES

- **Form Load:** Skeleton loaders for all fields
- **PDF Upload:** Progress bar (0-100%)
- **Save Action:** Button shows spinner + "Speichern..."
- **Status Change:** Button disabled + spinner

---

## ERROR STATES

- **Validation Errors:** Red text below field
- **PDF Upload Error:** "Upload fehlgeschlagen. Bitte versuchen Sie es erneut."
- **File Size Error:** "Datei zu groß. Maximal 10 MB erlaubt."
- **File Type Error:** "Nur PDF-Dateien erlaubt."

---

## QUALITY CHECKLIST

After implementing, verify:
- [ ] All required fields marked with "*"
- [ ] PDF upload required before "Signed" status
- [ ] Currency formatting works (German format)
- [ ] Date validation works (End > Start > Contract Date)
- [ ] Status transitions are enforced
- [ ] Immutability warning shows for Signed contracts
- [ ] "Start Project" button only visible for Signed contracts
- [ ] "Delete" button only visible for Draft contracts
- [ ] German labels are correct
- [ ] Mobile layout stacks to single column
- [ ] All buttons have 44px min touch target
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Drag & drop file upload works
- [ ] Confirmation dialogs show for destructive actions

---

**Total Sections:** 6  
**Total Fields:** 14  
**Special Features:** PDF Upload, Status Management, GoBD Compliance, Immutability, Convert from Offer

---

END OF PROMPT

