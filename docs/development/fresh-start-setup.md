# Fresh Start Application Setup

## Overview

We are building the KOMPASS application from scratch ("Fresh Start").
The repository structure separates our **Active Application** from the **UI Reference**.

- **Active Application**: `app/` (Proposed) or Project Root.
- **UI Reference**: `ui-ux/Kompassuimusterbibliothek` (Read-Only).

## Setup Instructions

### 1. Initialize the Application

We recommend initializing the application in a dedicated `app/` directory or the project root if it's empty of other code.

**Recommended Command (Vite + React + TS):**

```bash
npm create vite@latest app -- --template react-ts
cd app
npm install
```

### 2. Configure shadcn-cli (for the NEW app)

Once the app is created, configure `shadcn-cli` **inside the app directory**.

1.  **Initialize shadcn**:
    ```bash
    cd app
    npx shadcn@latest init
    ```
2.  **Add Shadcraft Registry**:
    Update `app/components.json` to include the registry (see `shadcn-guide.md`).
3.  **Add License Key**:
    Create `app/.env.local` with `SHADCRAFT_LICENSE_KEY`.

### 3. Development Workflow

1.  **Look** at `ui-ux/Kompassuimusterbibliothek` for the design pattern.
2.  **Re-implement** it in `app/src/...` using shadcn components.
3.  **Use** the CLI to add base components: `npx shadcn@latest add ...`

## Project Structure

```
kompass/
├── app/                        # <--- THIS IS YOUR CODE
│   ├── src/
│   ├── components.json         # <--- CONFIG GOES HERE
│   └── .env.local              # <--- KEY GOES HERE
├── ui-ux/
│   ├── Kompassuimusterbibliothek # <--- REFERENCE ONLY
│   └── README.md
└── docs/
```
