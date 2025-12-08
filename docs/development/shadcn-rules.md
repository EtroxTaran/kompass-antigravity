# Shadcn CLI & Shadcraft Workflow

## Usage Rules

1.  **Always use the CLI**: When adding components, use the shadcn CLI.
    ```bash
    npx shadcn@latest add @shadcraft/component-name
    ```

2.  **Environment Configuration**:
    - Ensure `.env.local` exists in `ui-ux/Kompassuimusterbibliothek/` with your `SHADCRAFT_LICENSE_KEY`.
    - Do NOT commit `.env.local` or share your license key.

3.  **Registry**: The project is configured to use the `@shadcraft` registry via `components.json`.
    - Registry URL: `https://registry-shadcraft.vercel.app/r/{name}`

4.  **Dependencies**:
    - If a component fails to install due to missing dependencies, check `package.json` for `tailwindcss`, `tailwindcss-animate`, and `lucide-react`.

5.  **Troubleshooting**:
    - **401 Unauthorized**: Check if `SHADCRAFT_LICENSE_KEY` is correct in `.env.local`.
    - **Component not found**: Verify the component name on [shadcraft.com](https://shadcraft.com).
