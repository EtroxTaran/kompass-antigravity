# Business Card Scanner (Mobile) - Figma Make Prompt

## Context & Purpose
- **Platform**: Mobile PWA (camera access)
- **User Role**: ADM (Sales Field)
- **Usage Context**: Capture and auto-fill contact information from business cards
- **Key Features**: OCR, auto-fill, quick contact creation

## Figma Make Prompt

Create a mobile business card scanner for KOMPASS with camera capture, OCR text extraction, auto-fill contact form, and quick save with German labels.

**Entry Points:**
- From customer detail: "+ Kontakt hinzufügen" → "Visitenkarte scannen"
- From contact list: "+ Neuer Kontakt" → "Visitenkarte scannen"
- From dashboard: Quick action button

**Screen 1: Camera View**
- Full-screen camera preview
- Overlay guide: Card-shaped frame (credit card aspect ratio)
- Instruction text: "Visitenkarte im Rahmen positionieren"
- Camera controls:
  - Flash button: Top-right (on/off toggle)
  - Flip camera: Top-left (front/back toggle)
  - Close: "X" top-left corner
- Capture button: Large circular button (80px) at bottom center
  - Tap: Takes photo
  - Feedback: Camera shutter sound + flash animation
- Gallery button: Small thumbnail (bottom-left) to choose from gallery

**Screen 2: Preview & Confirm**
- Shows captured image
- Overlay: Card detected highlight (green border)
- Text: "Visitenkarte erkannt - analysiere..."
- Progress: Circular spinner
- Actions:
  - "Wiederholen" (retake photo)
  - "Fortfahren" (proceed to extraction)

**Screen 3: OCR Extraction (Loading)**
- Shows blurred card image
- Large spinner in center
- Text: "Extrahiere Kontaktinformationen..."
- Subtext: "Bitte warten Sie einen Moment"
- Duration: 2-3 seconds typical

**Screen 4: Extracted Data (Form Pre-filled)**
- Header: "Kontakt aus Visitenkarte" (24px, bold)
- Card image: Small thumbnail at top (tappable to enlarge)
- Form with auto-filled fields (editable):

**Extracted Fields:**
- **Vorname**: "Hans" (extracted, green checkmark)
- **Nachname**: "Müller" (extracted, green checkmark)
- **Position**: "Geschäftsführer" (extracted)
- **Firma**: "Hofladen Müller GmbH" (extracted)
- **E-Mail**: "h.mueller@hofladen-mueller.de" (extracted)
- **Telefon**: "+49-89-1234567" (extracted)
- **Mobil**: "" (empty, user can add)
- **Adresse**: "Industriestraße 42, 81379 München" (extracted)

**Confidence Indicators:**
- Green checkmark: High confidence (> 90%)
- Amber warning: Medium confidence (70-90%) - "Bitte überprüfen"
- Red alert: Low confidence (< 70%) or missing - "Manuell eingeben"

**Field Editing:**
- All fields editable
- Tap field: Keyboard appears
- Validation: Real-time (email format, phone format)
- Suggestions: If multiple possible values detected

**Kunde zuordnen:**
- Dropdown: "Firma wählen oder neu erstellen"
- Options: Existing customers (fuzzy match by name)
- Or: "Neue Firma erstellen" (+ icon)

**Additional Fields (Optional, Collapsible):**
- "Weitere Felder" (expand/collapse)
- Website, Fax, Notizen

**Actions (Bottom, Sticky):**
- Primary: "Kontakt speichern" (blue, large)
- Secondary: "Abbrechen" (gray)
- Tertiary: "Originalfoto anzeigen" (link)

**Success Flow:**
- Toast: "Kontakt gespeichert" (green checkmark)
- Navigate to: Contact detail page
- Or: Return to customer detail (if from customer context)

**Error Handling:**
- No card detected: "Keine Visitenkarte erkannt - Foto wiederholen?"
- OCR failed: "Konnte Text nicht extrahieren - Manuell eingeben?"
- Low quality: "Foto zu unscharf - Bitte erneut aufnehmen"
- No camera: Fallback to manual input

**OCR Accuracy Tips (Overlay):**
- Icon button: "?" (info)
- Tips modal:
  - "Gute Beleuchtung verwenden"
  - "Karte flach auf Unterlage legen"
  - "Alle Ränder im Rahmen positionieren"
  - "Bewegung vermeiden"

**Offline Support:**
- Photo saved locally
- OCR: Requires online (API call)
- Fallback: Save photo, process when online
- Queue indicator: "Wird verarbeitet wenn online"

**Mobile Optimizations:**
- Camera: Use native camera API (best quality)
- Pinch to zoom: For close-up capture
- Auto-focus: Tap to focus on card
- Orientation: Lock to portrait for consistency
- Battery: Warn if low (camera is power-intensive)

**Accessibility:**
- Voice-over: Describes camera controls
- High contrast: Guide frame
- Large buttons: 44px minimum touch target
- Haptic feedback: On capture, on success

**Example Flow:**
1. User taps "+ Kontakt" → "Visitenkarte scannen"
2. Camera opens, full-screen preview
3. User positions business card in frame
4. User taps capture button
5. Flash animation, photo captured
6. "Analysiere..." spinner
7. OCR extracts: Hans Müller, Geschäftsführer, h.mueller@..., +49-89-...
8. Form pre-filled with extracted data (green checkmarks)
9. User reviews, edits phone number (was wrong)
10. User selects customer: "Hofladen Müller GmbH"
11. User taps "Kontakt speichern"
12. Toast: "Kontakt gespeichert"
13. Navigate to contact detail page

## Implementation Notes
```bash
npx shadcn-ui@latest add button input form sheet toast
# Camera: Use <input type="file" capture="environment"> for PWA
# OCR: Use Tesseract.js or cloud API (Google Vision, Azure)
```

