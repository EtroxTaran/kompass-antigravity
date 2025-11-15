# Figma Make: Offer Form (Angebots-Erfassung)

**Purpose:** Create form for entering or uploading Offers (Angebote) in KOMPASS  
**Action:** Design offer creation form with PDF upload support  
**Date:** 2025-01-28

---

## 🎯 MASTER PROMPT FOR FIGMA MAKE

**Copy everything below this line and paste into Figma Make:**

---

Create a form for **Offer Creation (Angebots-Erfassung)** in KOMPASS. Offers are sales quotes/proposals that can later be converted to Contracts.

## FORM STRUCTURE

### Header

- Title: "Angebot erstellen" (Create Offer)
- Subtitle: "Angebot für Kunde: [Customer Name]"
- Status Badge: Show current status (Draft/Sent/Accepted/Rejected)

### Form Sections

#### Section 1: Basic Information

1. **Customer** (Read-only, pre-filled)
   - Label: "Kunde"
   - Value: Customer name from context
   - Cannot be changed (offer always tied to specific customer)

2. **Offer Number** (Auto-generated or Manual)
   - Label: "Angebotsnummer"
   - Placeholder: "Automatisch generiert" or manual entry
   - Help text: "Wird automatisch vergeben, kann manuell überschrieben werden"

3. **Offer Date**
   - Label: "Angebotsdatum"
   - Type: Date picker
   - Default: Today
   - Required: Yes

4. **Valid Until**
   - Label: "Gültig bis"
   - Type: Date picker
   - Default: +30 days from offer date
   - Required: Yes
   - Validation: Must be after offer date

#### Section 2: Financial Information

5. **Total Amount**
   - Label: "Angebotssumme (Gesamt)"
   - Type: Currency input (€)
   - Placeholder: "0,00 €"
   - Required: Yes
   - Min: 0
   - Max: 10,000,000
   - Format: German currency format (1.234,56 €)
   - Help text: "Gesamtsumme inkl. MwSt."

6. **Net Amount** (Optional)
   - Label: "Nettobetrag"
   - Type: Currency input (€)
   - Placeholder: "0,00 €"
   - Help text: "Optional: Nettobetrag ohne MwSt."

7. **Tax Rate** (Optional)
   - Label: "MwSt.-Satz"
   - Type: Select dropdown
   - Options: 19%, 7%, 0%
   - Default: 19%

#### Section 3: Document Upload

8. **PDF Upload**
   - Label: "Angebot als PDF hochladen"
   - Type: File upload
   - Accept: .pdf only
   - Max size: 10 MB
   - Optional in Draft status
   - Required before "Sent" status
   - Display: Show file name + file size after upload
   - Actions: "Hochladen" button, "Vorschau" button, "Löschen" button

#### Section 4: Description & Notes

9. **Offer Title** (Optional)
   - Label: "Titel/Betreff"
   - Type: Text input
   - Placeholder: "z.B. Regalsystem Filiale München"
   - Max length: 200 chars

10. **Description/Notes**
    - Label: "Beschreibung/Notizen"
    - Type: Textarea
    - Placeholder: "Interne Notizen zum Angebot..."
    - Max length: 2000 chars
    - Optional

#### Section 5: Linked Entities

11. **Linked Opportunity** (Optional)

- Label: "Verknüpfte Verkaufschance"
- Type: Dropdown select
- Options: List of opportunities for this customer
- Optional: Can be empty
- Help text: "Optional: Angebot einer bestehenden Opportunity zuordnen"

12. **Project Reference** (Optional)

- Label: "Projektbezeichnung"
- Type: Text input
- Placeholder: "z.B. P-2025-M001"
- Optional

#### Section 6: Status Management

13. **Status**
    - Label: "Status"
    - Type: Select dropdown
    - Options:
      - Draft (Entwurf) - Yellow
      - Sent (Versendet) - Blue
      - Accepted (Angenommen) - Green
      - Rejected (Abgelehnt) - Red
    - Default: Draft
    - Rule: PDF upload required before changing to "Sent"

---

## FORM ACTIONS

### Primary Actions (Right side)

1. **Save as Draft** (Draft status only)
   - Button: Secondary style
   - Label: "Als Entwurf speichern"
   - Action: Save offer without validation
   - Shortcut: Ctrl+S

2. **Mark as Sent** (Draft status only)
   - Button: Primary style
   - Label: "Als versendet markieren"
   - Action: Change status to "Sent"
   - Validation: Requires PDF upload + all required fields
   - Confirmation: "Angebot als versendet markieren?"

3. **Accept Offer** (Sent status only)
   - Button: Success style (green)
   - Label: "Angebot annehmen"
   - Action: Change status to "Accepted"
   - Confirmation: "Angebot wurde angenommen. In Vertrag umwandeln?"

4. **Reject Offer** (Sent/Draft status)
   - Button: Danger style (red)
   - Label: "Angebot ablehnen"
   - Action: Change status to "Rejected"
   - Confirmation: "Grund für Ablehnung eingeben?" (optional textarea)

5. **Convert to Contract** (Accepted status only)
   - Button: Primary style
   - Label: "In Vertrag umwandeln"
   - Action: Navigate to Contract creation with pre-filled data
   - Confirmation: "Vertrag aus Angebot erstellen?"

### Secondary Actions (Left side)

6. **Cancel**
   - Button: Text button
   - Label: "Abbrechen"
   - Action: Discard changes and return to list

7. **Delete** (Draft status only)
   - Button: Text button (red)
   - Label: "Löschen"
   - Action: Delete offer
   - Confirmation: "Angebot wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."

---

## VALIDATION RULES

1. **Offer Date**: Required, cannot be in future
2. **Valid Until**: Required, must be after offer date
3. **Total Amount**: Required, must be > 0
4. **PDF Upload**: Required before status = "Sent"
5. **Status Transitions**:
   - Draft → Sent (requires PDF)
   - Sent → Accepted/Rejected
   - Accepted → Cannot revert (final state)
   - Rejected → Cannot revert (final state)

---

## RESPONSIVE DESIGN

- **Desktop (>1024px)**: 2-column layout
- **Tablet (768-1024px)**: 2-column layout, narrower
- **Mobile (<768px)**: Single column, full width inputs

---

## ACCESSIBILITY

- All fields have proper labels (ARIA-compliant)
- Required fields marked with "\*"
- Help text below inputs (aria-describedby)
- Error messages in red below fields
- Keyboard navigation: Tab through fields
- Focus indicators on all interactive elements
- File upload button: 44px min touch target

---

## GERMAN LABELS & PLACEHOLDERS

- "Angebot erstellen" (Create Offer)
- "Kunde" (Customer)
- "Angebotsnummer" (Offer Number)
- "Angebotsdatum" (Offer Date)
- "Gültig bis" (Valid Until)
- "Angebotssumme (Gesamt)" (Total Amount)
- "Nettobetrag" (Net Amount)
- "MwSt.-Satz" (Tax Rate)
- "Angebot als PDF hochladen" (Upload Offer as PDF)
- "Titel/Betreff" (Title/Subject)
- "Beschreibung/Notizen" (Description/Notes)
- "Status" (Status)
- "Als Entwurf speichern" (Save as Draft)
- "Als versendet markieren" (Mark as Sent)
- "Angebot annehmen" (Accept Offer)
- "Angebot ablehnen" (Reject Offer)
- "In Vertrag umwandeln" (Convert to Contract)

---

## FIGMA COMPONENTS TO USE

- shadcn/ui Input (text fields)
- shadcn/ui Select (dropdowns)
- shadcn/ui Textarea (description field)
- shadcn/ui Button (Primary, Secondary, Success, Danger)
- shadcn/ui DatePicker (date fields)
- shadcn/ui Badge (status indicator)
- shadcn/ui Card (section containers)
- shadcn/ui Label (form labels)
- shadcn/ui FileUpload (custom component for PDF)
- shadcn/ui Toast (success/error notifications)

---

## COLOR CODING

- **Draft (Entwurf)**: Yellow badge (#FFC107)
- **Sent (Versendet)**: Blue badge (#2196F3)
- **Accepted (Angenommen)**: Green badge (#4CAF50)
- **Rejected (Abgelehnt)**: Red badge (#F44336)

---

## QUALITY CHECKLIST

After implementing, verify:

- [ ] All required fields are marked with "\*"
- [ ] PDF upload required before "Sent" status
- [ ] Currency formatting works (German format)
- [ ] Date validation works (Valid Until > Offer Date)
- [ ] Status transitions are enforced
- [ ] "Convert to Contract" button only visible for Accepted offers
- [ ] "Delete" button only visible for Draft offers
- [ ] German labels are correct
- [ ] Mobile layout stacks to single column
- [ ] All buttons have 44px min touch target
- [ ] Keyboard navigation works
- [ ] ARIA labels present

---

**Total Sections:** 6  
**Total Fields:** 13  
**Special Features:** PDF Upload, Status Management, Convert to Contract

---

END OF PROMPT
