# Import/Export Specification

**Document Version:** 1.0  
**Date:** 2025-01-27  
**Status:** Draft  
**Owner:** Engineering Team  
**Priority:** HIGH - Required for data migration and ongoing operations

---

## Overview

KOMPASS supports import and export functionality for customers and contact protocols to enable:

- Initial data migration from Excel/Word documents
- Ongoing bulk operations
- Data backup and recovery
- Integration with external systems (Lexware, DATEV)

---

## 1. Customer Import (Excel/CSV)

### 1.1 Supported Formats

- **Excel:** `.xlsx`, `.xls`
- **CSV:** `.csv` (UTF-8, ISO-8859-1)
- **Maximum file size:** 10 MB
- **Maximum rows:** 10,000 per import

### 1.2 File Structure

- **First row:** Column headers (required)
- **Subsequent rows:** Data rows
- **Encoding:** UTF-8 (preferred), ISO-8859-1 (fallback)

### 1.3 Field Mapping

#### 1.3.1 Automatic Mapping

The system attempts automatic field mapping using:

1. **Exact match:** Column header matches internal field name exactly
   - `companyName` → `companyName`
   - `Firmenname` → `companyName` (German label)
   - `vatNumber` → `vatNumber`
   - `USt-IdNr` → `vatNumber` (German label)

2. **Fuzzy match:** Column header matches internal field name with variations
   - `company_name` → `companyName`
   - `Company Name` → `companyName`
   - `Firma` → `companyName`
   - `Email` → `email`
   - `E-Mail` → `email`

3. **Synonym matching:** Common synonyms are recognized
   - `phone`, `telephone`, `tel`, `Telefon` → `phone`
   - `address`, `adresse`, `Adresse` → `billingAddress`
   - `street`, `straße`, `Straße` → `billingAddress.street`
   - `zip`, `postal code`, `plz`, `PLZ` → `billingAddress.zipCode`
   - `city`, `stadt`, `Stadt` → `billingAddress.city`

#### 1.3.2 Manual Mapping

When automatic mapping fails or is incomplete:

1. **User selects mapping:** Dropdown for each CSV column
2. **Required fields:** Must be mapped (red asterisk \*)
   - `companyName` (required)
   - `billingAddress.street` (required)
   - `billingAddress.zipCode` (required)
   - `billingAddress.city` (required)

3. **Optional fields:** Can be skipped or mapped
   - `vatNumber`
   - `email`
   - `phone`
   - `creditLimit`
   - `rating`

4. **Unmapped columns:** Can be ignored or mapped to custom fields

### 1.4 Validation

#### 1.4.1 Field Validation

Each imported row is validated against business rules:

- **companyName:** 2-200 characters, pattern: `/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/`
- **vatNumber:** Pattern: `/^DE\d{9}$/` (if provided)
- **email:** Valid email format (if provided)
- **phone:** Pattern: `/^[\+]?[0-9\s\-()]+$/`, 7-20 characters (if provided)
- **creditLimit:** 0-1000000 (€1M) (if provided)
- **billingAddress.street:** 2-100 characters (required)
- **billingAddress.zipCode:** 5 digits (German format) (required)
- **billingAddress.city:** 2-100 characters (required)

#### 1.4.2 Validation Results

- **Valid rows:** ✅ Green checkmark
- **Warnings:** ⚠️ Amber warning (non-critical issues)
- **Errors:** ❌ Red error (critical issues, row will be skipped)

#### 1.4.3 Error Handling

- **Option 1:** Import only valid rows (default)
- **Option 2:** Abort import on first error
- **Option 3:** Skip errors and log to error report

### 1.5 Duplicate Detection

#### 1.5.1 Matching Criteria

- **VAT number:** Exact match (if both have VAT numbers)
- **Email:** Exact match (if both have emails)
- **Company name + address:** Fuzzy match (Levenshtein distance ≤ 2)

#### 1.5.2 Duplicate Actions

- **Skip:** Don't import duplicate (default)
- **Update:** Update existing customer with new data
- **Ask user:** Show duplicate dialog for user decision

### 1.6 Import Process

1. **Upload file:** User uploads Excel/CSV file
2. **Parse file:** System parses file and extracts headers
3. **Field mapping:** Automatic mapping with manual override option
4. **Validation:** System validates all rows
5. **Duplicate check:** System checks for duplicates
6. **Preview:** User reviews validation results and duplicates
7. **Confirm:** User confirms import
8. **Import:** System imports valid rows
9. **Results:** System shows import results and error log

### 1.7 Import Results

- **Successfully imported:** Number of customers imported
- **Skipped (errors):** Number of rows skipped due to errors
- **Skipped (duplicates):** Number of rows skipped due to duplicates
- **Error log:** CSV file with error details (downloadable)

---

## 2. Contact Protocol Import (Word Documents)

### 2.1 Supported Formats

- **Word:** `.docx`, `.doc`
- **Maximum file size:** 10 MB
- **Maximum protocols:** 1,000 per import

### 2.2 Document Structure

Word documents must contain **tables** with the following structure:

- **First row:** Column headers (required)
- **Subsequent rows:** Protocol data

#### 2.2.1 Required Table Columns

1. **Date column:** Protocol date (various formats supported)
2. **Note column:** Protocol note/description
3. **Action column:** Action item or follow-up (optional)

#### 2.2.2 Example Table Structure

```
| Date       | Note                                    | Action              |
|------------|-----------------------------------------|---------------------|
| 2024-01-15 | Customer visit - discussed new project  | Follow up next week |
| 15.01.24   | Phone call - confirmed delivery date    | Send quote          |
| 15 Jan 24  | Email sent - project proposal            | Wait for response   |
```

### 2.3 Table Extraction

#### 2.3.1 Table Detection

- System scans Word document for tables
- If multiple tables exist, user selects which table to import
- System extracts table structure (headers, rows, columns)

#### 2.3.2 Column Mapping

- **Automatic mapping:** System attempts to identify columns by header
  - `Date`, `Datum`, `Datum/Zeit` → Date column
  - `Note`, `Notiz`, `Beschreibung`, `Protokoll` → Note column
  - `Action`, `Aktion`, `Folgeaktion`, `To-Do` → Action column

- **Manual mapping:** User selects columns if automatic mapping fails
  - Date column: Required
  - Note column: Required
  - Action column: Optional

### 2.4 Date Parsing

#### 2.4.1 Supported Date Formats

The system supports a wide variety of date formats:

**ISO Format:**

- `2024-01-15`
- `2024-01-15T14:30:00Z`

**German Format:**

- `15.01.2024`
- `15.01.24`
- `15.1.2024`
- `15.1.24`

**Text Format:**

- `15. Januar 2024`
- `15. Jan 2024`
- `15 Jan 2024`
- `15.01.2024`

**Numeric Format:**

- `15012024`
- `150124`
- `20240115`

**Mixed Format:**

- `15/01/2024`
- `15-01-2024`
- `2024/01/15`

#### 2.4.2 Date Parsing Logic

1. **Try common formats first:**
   - ISO format: `YYYY-MM-DD`
   - German format: `DD.MM.YYYY`
   - German short format: `DD.MM.YY`

2. **Try text formats:**
   - German month names: `Januar`, `Februar`, `März`, etc.
   - English month names: `January`, `February`, `March`, etc.
   - Short month names: `Jan`, `Feb`, `Mar`, etc.

3. **Try numeric formats:**
   - 8 digits: `DDMMYYYY` or `YYYYMMDD`
   - 6 digits: `DDMMYY` or `YYMMDD`

4. **Try fuzzy parsing:**
   - Extract numbers and try different combinations
   - Use context clues (year > 2000, month 1-12, day 1-31)

5. **Fallback to manual entry:**
   - If parsing fails, show date field for user to correct
   - User can select date from date picker
   - User can type date in known format

#### 2.4.3 Date Validation

- **Valid date:** Date is parsed successfully
- **Invalid date:** Date cannot be parsed → User must correct
- **Out of range:** Date is too far in past/future → Warning shown
- **Ambiguous date:** Multiple interpretations possible → User must choose

#### 2.4.4 Date Correction UI

When date parsing fails:

1. **Show original value:** Display the original date string
2. **Show parsing attempts:** Show what the system tried to parse
3. **Manual entry:** Date picker for user to select correct date
4. **Format hint:** Show example formats (e.g., "DD.MM.YYYY")
5. **Apply to all:** Option to apply same correction to similar dates

### 2.5 Protocol Data Mapping

#### 2.5.1 Protocol Fields

- **date:** Protocol date (required, parsed from date column)
- **note:** Protocol note/description (required, from note column)
- **action:** Action item or follow-up (optional, from action column)
- **customerId:** Customer ID (required, user must select customer)
- **contactId:** Contact ID (optional, user can select contact)
- **userId:** User ID (defaults to current user, can be changed)
- **protocolType:** Protocol type (default: "visit", can be changed)

#### 2.5.2 Customer Assignment

- **Single customer:** User selects one customer for all protocols
- **Multiple customers:** User can assign different customers to different protocols
- **Customer matching:** System can attempt to match customers by name (if customer name is in note)

### 2.6 Validation

#### 2.6.1 Protocol Validation

- **Date:** Valid date (required)
- **Note:** Non-empty string, 2-2000 characters (required)
- **Action:** Optional, 2-500 characters (if provided)
- **Customer:** Valid customer ID (required)

#### 2.6.2 Validation Results

- **Valid protocols:** ✅ Green checkmark
- **Warnings:** ⚠️ Amber warning (e.g., date out of range)
- **Errors:** ❌ Red error (e.g., missing date, missing note)

### 2.7 Import Process

1. **Upload file:** User uploads Word document
2. **Table detection:** System detects tables in document
3. **Table selection:** User selects table to import (if multiple tables)
4. **Column mapping:** Automatic mapping with manual override option
5. **Date parsing:** System parses dates with fallback to manual entry
6. **Customer assignment:** User assigns customers to protocols
7. **Validation:** System validates all protocols
8. **Preview:** User reviews validation results
9. **Confirm:** User confirms import
10. **Import:** System imports valid protocols
11. **Results:** System shows import results and error log

### 2.8 Import Results

- **Successfully imported:** Number of protocols imported
- **Skipped (errors):** Number of protocols skipped due to errors
- **Date corrections:** Number of dates that required manual correction
- **Error log:** CSV file with error details (downloadable)

---

## 3. Export Functionality

### 3.1 Customer Export

#### 3.1.1 Supported Formats

- **CSV:** `.csv` (UTF-8)
- **Excel:** `.xlsx`
- **JSON:** `.json` (API format)
- **DATEV:** `.csv` (GoBD-compliant format)

#### 3.1.2 Export Options

- **Entity type:** Customers, Contacts, Locations
- **Date range:** All, custom range, last 30 days, etc.
- **Fields:** All fields, custom selection
- **Filters:** By owner, by rating, by status, etc.

#### 3.1.3 Export Process

1. **Select entity:** User selects entity type (Customers, Contacts, etc.)
2. **Select date range:** User selects date range
3. **Select format:** User selects export format (CSV, Excel, JSON, DATEV)
4. **Select fields:** User selects fields to export
5. **Apply filters:** User applies filters (optional)
6. **Preview:** User previews export data (first 5 rows)
7. **Export:** System generates export file
8. **Download:** User downloads export file

### 3.2 Contact Protocol Export

#### 3.2.1 Supported Formats

- **CSV:** `.csv` (UTF-8)
- **Excel:** `.xlsx`
- **Word:** `.docx` (table format)
- **JSON:** `.json` (API format)

#### 3.2.2 Export Options

- **Customer:** Export protocols for specific customer
- **Date range:** All, custom range, last 30 days, etc.
- **Protocol type:** All types, specific type (visit, call, email, etc.)
- **Fields:** All fields, custom selection

#### 3.2.3 Export Process

1. **Select customer:** User selects customer (optional, can export all)
2. **Select date range:** User selects date range
3. **Select format:** User selects export format (CSV, Excel, Word, JSON)
4. **Select fields:** User selects fields to export
5. **Apply filters:** User applies filters (optional)
6. **Preview:** User previews export data (first 5 rows)
7. **Export:** System generates export file
8. **Download:** User downloads export file

#### 3.2.4 Word Export Format

- **Table structure:** Exports as Word table
- **Columns:** Date, Note, Action, Customer, Contact, User
- **Date format:** German format (DD.MM.YYYY)
- **Styling:** Professional table styling with headers

---

## 4. API Endpoints

### 4.1 Customer Import Endpoints

#### 4.1.1 Upload Customer Import File

**POST** `/api/v1/customers/import/upload`

Upload Excel/CSV file for customer import.

**Auth:** PLAN, ADM, GF  
**Permission:** Customer.IMPORT

**Request:**

- **Content-Type:** `multipart/form-data`
- **Body:** File (Excel/CSV)

**Response (200 OK):**

```json
{
  "importId": "import-123",
  "filename": "customers.xlsx",
  "rowCount": 512,
  "headers": ["companyName", "vatNumber", "email", "phone"],
  "status": "uploaded"
}
```

#### 4.1.2 Map Customer Import Fields

**POST** `/api/v1/customers/import/:importId/map`

Map CSV columns to internal fields.

**Auth:** PLAN, ADM, GF  
**Permission:** Customer.IMPORT

**Request Body:**

```json
{
  "mappings": {
    "company_name": "companyName",
    "vat_number": "vatNumber",
    "email": "email",
    "phone": "phone",
    "address_street": "billingAddress.street",
    "address_zip": "billingAddress.zipCode",
    "address_city": "billingAddress.city"
  },
  "autoDetect": true
}
```

**Response (200 OK):**

```json
{
  "importId": "import-123",
  "mappings": {
    "company_name": "companyName",
    "vat_number": "vatNumber"
  },
  "unmappedColumns": ["custom_field_1"],
  "status": "mapped"
}
```

#### 4.1.3 Validate Customer Import

**POST** `/api/v1/customers/import/:importId/validate`

Validate imported data.

**Auth:** PLAN, ADM, GF  
**Permission:** Customer.IMPORT

**Response (200 OK):**

```json
{
  "importId": "import-123",
  "totalRows": 512,
  "validRows": 487,
  "invalidRows": 15,
  "duplicateRows": 10,
  "validationResults": [
    {
      "row": 2,
      "status": "error",
      "field": "vatNumber",
      "error": "Invalid VAT number format",
      "value": "123456789"
    },
    {
      "row": 5,
      "status": "warning",
      "field": "email",
      "error": "Invalid email format",
      "value": "test@"
    }
  ],
  "status": "validated"
}
```

#### 4.1.4 Execute Customer Import

**POST** `/api/v1/customers/import/:importId/execute`

Execute customer import.

**Auth:** PLAN, ADM, GF  
**Permission:** Customer.IMPORT

**Request Body:**

```json
{
  "options": {
    "skipErrors": true,
    "skipDuplicates": true,
    "updateDuplicates": false
  }
}
```

**Response (200 OK):**

```json
{
  "importId": "import-123",
  "importedCount": 487,
  "skippedCount": 25,
  "errorCount": 15,
  "duplicateCount": 10,
  "status": "completed",
  "errorLogUrl": "/api/v1/customers/import/import-123/errors"
}
```

### 4.2 Contact Protocol Import Endpoints

#### 4.2.1 Upload Protocol Import File

**POST** `/api/v1/protocols/import/upload`

Upload Word document for protocol import.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Request:**

- **Content-Type:** `multipart/form-data`
- **Body:** File (Word document)

**Response (200 OK):**

```json
{
  "importId": "import-456",
  "filename": "protocols.docx",
  "tableCount": 1,
  "rowCount": 150,
  "status": "uploaded"
}
```

#### 4.2.2 Extract Protocol Table

**POST** `/api/v1/protocols/import/:importId/extract`

Extract table from Word document.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Request Body:**

```json
{
  "tableIndex": 0,
  "columnMappings": {
    "date": 0,
    "note": 1,
    "action": 2
  }
}
```

**Response (200 OK):**

```json
{
  "importId": "import-456",
  "tableIndex": 0,
  "headers": ["Date", "Note", "Action"],
  "rowCount": 150,
  "sampleRows": [
    {
      "date": "2024-01-15",
      "note": "Customer visit - discussed new project",
      "action": "Follow up next week"
    }
  ],
  "status": "extracted"
}
```

#### 4.2.3 Parse Protocol Dates

**POST** `/api/v1/protocols/import/:importId/parse-dates`

Parse dates from protocol import.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Response (200 OK):**

```json
{
  "importId": "import-456",
  "totalRows": 150,
  "parsedCount": 140,
  "failedCount": 10,
  "dateParsingResults": [
    {
      "row": 5,
      "originalValue": "15.01.24",
      "parsedValue": "2024-01-15",
      "status": "success"
    },
    {
      "row": 12,
      "originalValue": "15 Jan 24",
      "parsedValue": "2024-01-15",
      "status": "success"
    },
    {
      "row": 25,
      "originalValue": "invalid-date",
      "parsedValue": null,
      "status": "failed",
      "requiresManualEntry": true
    }
  ],
  "status": "parsed"
}
```

#### 4.2.4 Assign Protocol Customers

**POST** `/api/v1/protocols/import/:importId/assign-customers`

Assign customers to protocols.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Request Body:**

```json
{
  "defaultCustomerId": "customer-123",
  "customerAssignments": [
    {
      "row": 5,
      "customerId": "customer-123"
    },
    {
      "row": 12,
      "customerId": "customer-456"
    }
  ]
}
```

**Response (200 OK):**

```json
{
  "importId": "import-456",
  "assignedCount": 150,
  "status": "assigned"
}
```

#### 4.2.5 Validate Protocol Import

**POST** `/api/v1/protocols/import/:importId/validate`

Validate imported protocols.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Response (200 OK):**

```json
{
  "importId": "import-456",
  "totalRows": 150,
  "validRows": 140,
  "invalidRows": 10,
  "validationResults": [
    {
      "row": 25,
      "status": "error",
      "field": "date",
      "error": "Date is required",
      "value": null
    },
    {
      "row": 30,
      "status": "error",
      "field": "note",
      "error": "Note is required",
      "value": ""
    }
  ],
  "status": "validated"
}
```

#### 4.2.6 Execute Protocol Import

**POST** `/api/v1/protocols/import/:importId/execute`

Execute protocol import.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Request Body:**

```json
{
  "options": {
    "skipErrors": true,
    "defaultUserId": "user-123",
    "defaultProtocolType": "visit"
  }
}
```

**Response (200 OK):**

```json
{
  "importId": "import-456",
  "importedCount": 140,
  "skippedCount": 10,
  "errorCount": 10,
  "status": "completed",
  "errorLogUrl": "/api/v1/protocols/import/import-456/errors"
}
```

### 4.3 Export Endpoints

#### 4.3.1 Export Customers

**GET** `/api/v1/customers/export`

Export customers to CSV/Excel/JSON.

**Auth:** PLAN, ADM, GF, BUCH  
**Permission:** Customer.EXPORT

**Query Parameters:**

- `format`: `csv` | `excel` | `json` | `datev`
- `dateRange`: `all` | `last30days` | `custom`
- `startDate`: ISO date (if custom range)
- `endDate`: ISO date (if custom range)
- `fields`: Comma-separated field list
- `filters`: JSON-encoded filters

**Response (200 OK):**

- **Content-Type:** `text/csv` (CSV), `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (Excel), `application/json` (JSON)
- **Content-Disposition:** `attachment; filename="customers_export_2025-01-27.csv"`

#### 4.3.2 Export Contact Protocols

**GET** `/api/v1/protocols/export`

Export contact protocols to CSV/Excel/Word/JSON.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.EXPORT

**Query Parameters:**

- `format`: `csv` | `excel` | `word` | `json`
- `customerId`: Customer ID (optional)
- `dateRange`: `all` | `last30days` | `custom`
- `startDate`: ISO date (if custom range)
- `endDate`: ISO date (if custom range)
- `protocolType`: Protocol type (optional)
- `fields`: Comma-separated field list

**Response (200 OK):**

- **Content-Type:** `text/csv` (CSV), `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (Excel), `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (Word), `application/json` (JSON)
- **Content-Disposition:** `attachment; filename="protocols_export_2025-01-27.docx"`

---

## 5. Implementation Requirements

### 5.1 Libraries

#### 5.1.1 Excel/CSV Parsing

- **Backend:** `xlsx` (Node.js) or `exceljs` (Node.js)
- **Frontend:** `papaparse` (CSV) or `xlsx` (Excel)

#### 5.1.2 Word Document Parsing

- **Backend:** `mammoth` (Node.js) or `docx` (Node.js)
- **Table extraction:** Custom logic using `mammoth` or `docx`

#### 5.1.3 Date Parsing

- **Backend:** `date-fns` (Node.js) or `moment` (Node.js)
- **Date parsing library:** `chrono-node` (natural language date parsing)

#### 5.1.4 Validation

- **Backend:** `zod` (TypeScript) or `class-validator` (NestJS)
- **Frontend:** `zod` (TypeScript) or `yup` (JavaScript)

### 5.2 File Storage

- **Temporary storage:** Import files stored temporarily during import process
- **Error logs:** Error logs stored for 30 days
- **Export files:** Export files generated on-demand (not stored)

### 5.3 Performance Considerations

- **Large files:** Process files in chunks (1000 rows at a time)
- **Progress tracking:** Show progress bar for long-running imports
- **Background jobs:** Use background jobs for large imports (>5000 rows)
- **Rate limiting:** Limit import/export requests to prevent abuse

### 5.4 Error Handling

- **Validation errors:** Show detailed error messages for each row
- **Parsing errors:** Show parsing attempts and allow manual correction
- **Duplicate detection:** Show duplicate matches and allow user decision
- **Error log:** Generate downloadable error log CSV file

### 5.5 Security

- **File validation:** Validate file type and size before processing
- **Malicious files:** Scan files for malicious content
- **RBAC:** Enforce RBAC permissions for import/export operations
- **Audit trail:** Log all import/export operations for audit purposes

---

## 6. UI/UX Requirements

### 6.1 Import Workflow

1. **File upload:** Drag-and-drop or file picker
2. **File validation:** Validate file type and size
3. **Field mapping:** Automatic mapping with manual override
4. **Validation:** Show validation results
5. **Preview:** Show preview of imported data
6. **Confirm:** User confirms import
7. **Progress:** Show progress bar during import
8. **Results:** Show import results and error log

### 6.2 Export Workflow

1. **Select entity:** User selects entity type
2. **Select format:** User selects export format
3. **Select options:** User selects export options (date range, fields, filters)
4. **Preview:** User previews export data
5. **Export:** System generates export file
6. **Download:** User downloads export file

### 6.3 Date Parsing UI

1. **Show original value:** Display original date string
2. **Show parsing attempts:** Show what system tried to parse
3. **Manual entry:** Date picker for user to select correct date
4. **Format hint:** Show example formats
5. **Apply to all:** Option to apply same correction to similar dates

### 6.4 Error Handling UI

1. **Validation errors:** Show error table with row, field, error, value
2. **Parsing errors:** Show parsing error with manual correction option
3. **Duplicate detection:** Show duplicate matches with user decision options
4. **Error log:** Downloadable error log CSV file

---

## 7. Testing Requirements

### 7.1 Unit Tests

- **File parsing:** Test Excel/CSV/Word parsing
- **Field mapping:** Test automatic and manual field mapping
- **Date parsing:** Test various date formats
- **Validation:** Test field validation rules
- **Duplicate detection:** Test duplicate detection logic

### 7.2 Integration Tests

- **Import workflow:** Test complete import workflow
- **Export workflow:** Test complete export workflow
- **Error handling:** Test error handling and recovery
- **Performance:** Test performance with large files

### 7.3 E2E Tests

- **Customer import:** Test customer import from Excel/CSV
- **Protocol import:** Test protocol import from Word document
- **Date parsing:** Test date parsing with various formats
- **Export:** Test customer and protocol export

---

## 8. Future Enhancements

### 8.1 Phase 2

- **Batch import:** Support for multiple files in one import
- **Scheduled import:** Schedule automatic imports from external systems
- **API import:** Direct API import without file upload
- **Incremental import:** Import only new/changed records

### 8.2 Phase 3

- **AI-assisted mapping:** Use AI to improve field mapping accuracy
- **Smart date parsing:** Use AI to improve date parsing accuracy
- **Duplicate merging:** Automatic duplicate merging with user approval
- **Data enrichment:** Enrich imported data with external sources

---

## References

- **API Specification:** `docs/specifications/reviews/API_SPECIFICATION.md`
- **Data Model:** `docs/specifications/data-model.md`
- **UI/UX Documentation:** `ui-ux/08-specialized/data-export-import.md`
- **Product Vision:** `docs/product-vision/Produktvision & Zielbild – Kontakt- & Kundenverwaltung (CRM-Basis).md`

---

**End of IMPORT_EXPORT_SPECIFICATION.md v1.0**
