# Development Scripts

This directory contains helper scripts for development tasks.

## UI Reference Repository Scripts

These scripts help you work with the GitHub UI reference repository (`EtroxTaran/Kompassuimusterbibliothek`).

### list-ui-reference.sh

Lists directory structure of the reference repository.

**Usage:**

```bash
./scripts/list-ui-reference.sh [path]
```

**Examples:**

```bash
# List root directory
./scripts/list-ui-reference.sh

# List src directory
./scripts/list-ui-reference.sh src

# List components directory
./scripts/list-ui-reference.sh src/components
```

**Requirements:**

- GitHub CLI (`gh`) installed and authenticated
- Or use GitHub MCP tools in Cursor

### search-ui-reference.sh

Searches for files/components in the reference repository.

**Usage:**

```bash
./scripts/search-ui-reference.sh <search-term>
```

**Examples:**

```bash
# Search for customer-related files
./scripts/search-ui-reference.sh Customer

# Search for form components
./scripts/search-ui-reference.sh form

# Search with multiple words
./scripts/search-ui-reference.sh "customer list"
```

**Requirements:**

- GitHub CLI (`gh`) installed and authenticated
- Or use GitHub MCP tools in Cursor

### fetch-ui-reference.sh

Fetches specific file from the reference repository.

**Usage:**

```bash
./scripts/fetch-ui-reference.sh <file-path> [--open]
```

**Examples:**

```bash
# Fetch a component file
./scripts/fetch-ui-reference.sh src/components/CustomerForm.tsx

# Fetch and open in editor
./scripts/fetch-ui-reference.sh src/pages/CustomerPage.tsx --open
```

**Output:**

- Files are saved to `/tmp/kompass-ui-reference/`
- Use `--open` flag to open in your default editor

**Requirements:**

- GitHub CLI (`gh`) installed and authenticated
- Or use GitHub MCP tools in Cursor

## Other Scripts

See individual script files for documentation on other development scripts.
