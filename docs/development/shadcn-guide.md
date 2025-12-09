# Shadcn CLI & Shadcraft Usage Guide

## Overview

This project uses [shadcn/ui](https://ui.shadcn.com/) components enhanced by the [Shadcraft](https://shadcraft.com/) registry. This allows for rapid component installation via CLI.

## Prerequisities

### 1. License Key

You need a Shadcraft License Key.

1. Obtain your key from [Shadcraft](https://shadcraft.com/).
2. Create environment file: `ui-ux/Kompassuimusterbibliothek/.env.local`
3. Add your key:
   ```bash
   SHADCRAFT_LICENSE_KEY=sk_...
   ```

### 2. Dependencies

Ensure you have the necessary dependencies installed. Run this in `ui-ux/Kompassuimusterbibliothek/`:

```bash
npm install -D tailwindcss postcss autoprefixer tailwindcss-animate
npm install lucide-react class-variance-authority clsx tailwind-merge
```

## How to Install Components

Use the `shadcn` CLI to add components. The configuration in `components.json` points to the Shadcraft registry.

### Command

```bash
npx shadcn@latest add @shadcraft/component-name
```

_Example:_

```bash
npx shadcn@latest add @shadcraft/button
```

## Configuration Files

- **components.json**: Defines the project structure and registry connection.
- **tailwind.config.js**: Configures Tailwind CSS (required for shadcn).
- **.env.local**: Stores your private license key.

## Troubleshooting

### Missing License Key

If you see a 401 error or "Unauthorized", ensure your `.env.local` file is correct and the key is valid.

### Style Issues

If components look unstyled:

- Ensure `src/index.css` imports tailwind directives (or is properly set up).
- Ensure `tailind.config.js` `content` array matches your file structure.
