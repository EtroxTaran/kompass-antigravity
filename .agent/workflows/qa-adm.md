---
description: QA workflow for testing UI as the ADM (Administrator) persona
---

# /qa-adm - The QA Engineer (ADM Persona)

**Category**: Quality Assurance
**Persona**: QA Engineer simulating ADM (Administrator)
**Mission**: Validate core functionalities and user flows for the ADM persona, ensuring the platform is stable and usable for administrators.

---

## Workflow Steps

### 1. Setup & Login

1.  Start the application if not running.
2.  Open Browser (`open_browser`).
3.  Navigate to the login page.
4.  **Login as ADM user**:
    - **Note**: Check `apps/api/src/db/seeds` or relevant seed files if credentials are unknown. Common default: `admin@example.com` / `password` or similar.
5.  Verify successful redirection to the Dashboard.

### 2. User Profile Verification

1.  Navigate to the **User Profile** page (often via Avatar menu).
2.  Verify:
    - User details (Name, Email, Role) are displayed correctly.
    - Edit profile functionality (if implemented): Try changing display name or other editable fields and save.
3.  **Report**: Log any crashes, visual bugs, or data inconsistencies.

### 3. Settings Verification

1.  Navigate to the **Settings** page (System or User settings).
2.  Verify:
    - Navigation through different settings tabs/sections.
    - Toggle switches and input fields are responsive.
    - Changes are persisted after page reload (if applicable).
3.  **Report**: Log any errors or non-functional settings.

### 4. Customer Management Flow

1.  Navigate to the **Customers** section.
2.  **Create New Customer**:
    - Click "New Customer" (or equivalent).
    - Fill in the form (Name: "Test Company [Timestamp]", Industry, Contact details, etc.).
    - Submit the form.
    - Verify success message/toast.
3.  **Verify Created Customer**:
    - Check the Customer List; ensure the new customer appears.
    - Click on the new customer to view details.
    - Verify all entered data is correctly displayed on the Detail view.
    - Verify specific sub-tabs (Contacts, Locations, Protocols) if available.
4.  **Report**: Log issues for validation errors, submission failures, or data mismatches.

### 5. General & Exploratory Testing

1.  Click through ALL Sidebar menu items to ensure no 404s or crashes.
2.  Check for console errors in the DevTools for each major page.
3.  Verify responsiveness: Resize window to check layout stability for mobile/tablet views if required.

---

## Reporting

- For every issue found, create a GitHub issue.
- **Title Format**: `[QA] [ADM] <Short Description of Bug>`
- **Body**:
  - **Description**: What went wrong.
  - **Steps to Reproduce**: Detailed list of actions.
  - **Expected Result**: What should have happened.
  - **Actual Result**: What actually happened.
  - **Screenshot/Recording**: Attach if possible.

## Definition of Done

- [ ] Login checked.
- [ ] Profile and Settings pages verified.
- [ ] Customer creation flow completed and verified.
- [ ] All major navigation paths checked.
- [ ] Issues created for all identified bugs.
