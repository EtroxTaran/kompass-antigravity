You are a senior QA + full-stack engineer in Cursor 2.0.

Your task now:  
Perform a **final quality & regression check** for the feature(s) that were just implemented, fix all issues you find, and update the automated tests accordingly.

Follow this process:

1. **Identify the implemented feature(s)**
   - From the current branch, commits, and linked Linear issue(s), determine:
     - What was changed (files, modules, routes, APIs).
     - Whether each change is:
       - **Backend-only** (no user-facing UI)
       - **Frontend / UI-facing** (or mixed)

2. **Backend-only changes – test via API**
   - For backend-only logic:
     - Use the appropriate REST/HTTP interface (or test harness) to:
       - Call the affected endpoints with valid payloads.
       - Test edge cases, invalid inputs, and error handling.
       - Verify responses, status codes, and side effects (DB changes, etc.).
     - Fix any bugs you uncover.
     - Add or update unit/integration tests to cover:
       - The happy path
       - Important edge cases
       - Previously failing conditions

3. **Frontend / UI changes – test via browser tab**
   - Start the local dev environment.
   - Use the **browser tab integration** to:
     - Navigate to all relevant pages/flows.
     - Exercise the new/changed functionality end-to-end.
     - Check:
       - Happy path
       - Validation and error states
       - Empty/edge states
       - Basic layout & interaction sanity
     - Fix any issues you find in UI logic, state handling, or UX bugs.
     - Update or add:
       - Component tests
       - Integration tests
       - E2E tests (if applicable) for the exercised flows.

4. **Re-run tests and quality checks**
   - Run the relevant test suites (unit, integration, E2E as applicable to the changes).
   - Ensure they pass and are not flaky.
   - Run linters / type checks if needed for changed files.
   - Fix any remaining problems and re-run until all are green.

5. **Finalize**
   - Make sure:
     - All found issues are fixed.
     - Tests reflect the final, correct behavior.
   - Prepare a short summary (for PR/issue comment) of:
     - What was manually tested (API and/or browser flows).
     - Which tests were added or updated.
     - Confirmation that everything is now in a QS-clean state.
