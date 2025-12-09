# Project Structure

This document defines the high-level structure of the KOMPASS workspace.

## Root Directory

| Directory | Purpose                                                                                       |
| :-------- | :-------------------------------------------------------------------------------------------- |
| `app/`    | **The Application Source Code.** (To be created) - The actual CRM application.                |
| `docs/`   | **Documentation.** - Architecture, requirements, and guides.                                  |
| `ui-ux/`  | **UI/UX Reference.** - Contains the design system documentation and the reference repository. |
| `.agent/` | **Agent Configuration.** - Rules and workflows for AI agents.                                 |

## ui-ux/ Directory

| Directory                    | Purpose                                                                                  |
| :--------------------------- | :--------------------------------------------------------------------------------------- |
| `Kompassuimusterbibliothek/` | **Reference Repository.** A clone of the UI library. **READ-ONLY**. Do not develop here. |
| `*.md`                       | **Design Specs.** Markdown files describing the UI patterns (e.g. `customer-form.md`).   |

## app/ Directory (Planned)

| Directory     | Purpose                                            |
| :------------ | :------------------------------------------------- |
| `src/`        | React source code.                                 |
| `components/` | Reusable UI components.                            |
| `features/`   | Feature-based modules (Customers, Projects, etc.). |
