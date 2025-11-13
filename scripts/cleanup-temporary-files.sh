#!/bin/bash

# Temporary Files Cleanup Script
# Identifies and optionally deletes temporary markdown files
# See: .cursor/rules/temporary-files-prevention.mdc

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Temporary file patterns (from .cursor/rules/temporary-files-prevention.mdc)
PATTERNS=(
    "**/LINEAR_ISSUE*.md"
    "**/LINEAR_ISSUES*.md"
    "**/*linear-issue*.md"
    "**/*AUDIT*.md"
    "**/*AUDIT_FINDINGS*.md"
    "**/*FINDINGS*.md"
    "**/*PLANNING_PROMPT*.md"
    "**/*PLANNING*.md"
    "**/*STATUS_*.md"
    "**/*_STATUS_*.md"
    "**/*BUG_FIX*.md"
    "**/*BUG_FIX_SUMMARY*.md"
    "**/*SEARCH_RESULTS*.md"
    "**/*RESULTS*.md"
    "**/*ANALYSIS*.md"
    "**/*ANALYZ*.md"
    "**/*DESIGN_DOCUMENTS*.md"
    "**/*DESIGN*.md"
    "**/IMPLEMENTATION_NOTES*.md"
    "**/*NOTES*.md"
    "**/CLEANUP_*.md"
    "**/*CLEANUP*.md"
    "**/*_CLEANUP*.md"
    "**/validation-report.md"
    "**/*validation-report*.md"
    "**/FINAL_DELIVERABLES*.md"
    "**/*FINAL_DELIVERABLES*.md"
)

# Exceptions (permanent files that match patterns but should be kept)
EXCEPTIONS=(
    "**/*_IMPLEMENTATION_SUMMARY.md"
    "**/*_INTEGRATION_SUMMARY.md"
    "**/*_IMPLEMENTATION_COMPLETE.md"
    "**/*_IMPLEMENTATION_GUIDE.md"
    "**/*_INTEGRATION_GUIDE.md"
    "**/*_ROADMAP.md"
    "**/*_STRATEGY.md"
    "**/*_SPECIFICATION.md"
    "**/*_SPEC.md"
    "**/*_ARCHITECTURE.md"
    "**/ui-ux/00-updates/FIGMA-UPDATE*.md"
    "**/ui-ux/00-updates/MIGRATION-*.md"
)

# Check if file matches exception pattern (glob pattern matching)
matches_exception() {
    local file="$1"
    local exception="$2"
    
    # Normalize file path (remove leading ./ if present)
    local normalized_file="${file#./}"
    
    # Convert glob pattern to bash case pattern
    # **/ means "match any path prefix", so we remove it
    # * means "match any characters including /"
    local pattern="${exception//\*\*\//}"
    # Remove leading ./ if present
    pattern="${pattern#./}"
    
    # Use case statement for pattern matching
    # In bash case, * matches across / boundaries
    # Try matching both with and without leading ./
    case "$normalized_file" in
        $pattern)
            return 0  # Match
            ;;
        *)
            # Also try with ./ prefix in case pattern needs it
            case "./$normalized_file" in
                $pattern)
                    return 0  # Match
                    ;;
                *)
                    return 1  # No match
                    ;;
            esac
            ;;
    esac
}

# Check if file should be excluded (matches any exception)
is_exception_file() {
    local file="$1"
    
    for exception in "${EXCEPTIONS[@]}"; do
        if matches_exception "$file" "$exception"; then
            return 0  # Is exception
        fi
    done
    
    return 1  # Not an exception
}

# Convert glob pattern to find -name pattern
glob_to_find_pattern() {
    local glob="$1"
    # Remove **/ prefix (find searches recursively by default)
    local pattern="${glob#\*\*/}"
    # Remove leading ./ if present
    pattern="${pattern#./}"
    # Return the pattern (find will use it with -name)
    echo "$pattern"
}

# Find temporary files
find_temp_files() {
    local temp_files=()
    local root_dir="${1:-.}"
    
    # Build find conditions from PATTERNS array
    local find_conditions=()
    for pattern in "${PATTERNS[@]}"; do
        local find_pattern=$(glob_to_find_pattern "$pattern")
        find_conditions+=(-o -name "$find_pattern")
    done
    
    # Remove the first -o (we'll use -o only between conditions)
    if [ ${#find_conditions[@]} -gt 0 ]; then
        find_conditions=("${find_conditions[@]:1}")  # Remove first -o
    fi
    
    # Find all files matching patterns
    while IFS= read -r -d '' file; do
        # Skip node_modules and .git directories
        if [[ "$file" == *"/node_modules/"* ]] || [[ "$file" == *"/.git/"* ]]; then
            continue
        fi
        
        # Check if file matches any exception pattern
        if is_exception_file "$file"; then
            continue  # Skip exception files
        fi
        
        # Add to temp files list
        temp_files+=("$file")
    done < <(find "$root_dir" -type f \( "${find_conditions[@]}" \) 2>/dev/null | tr '\n' '\0')
    
    printf '%s\n' "${temp_files[@]}" | sort -u
}

# Scan for temporary files
scan() {
    echo -e "${YELLOW}Scanning for temporary files...${NC}"
    echo ""
    
    local temp_files
    temp_files=$(find_temp_files)
    
    if [ -z "$temp_files" ]; then
        echo -e "${GREEN}✅ No temporary files found!${NC}"
        return 0
    fi
    
    local count=$(echo "$temp_files" | wc -l)
    echo -e "${RED}Found $count temporary file(s):${NC}"
    echo ""
    
    echo "$temp_files" | while IFS= read -r file; do
        echo -e "${RED}  ❌ $file${NC}"
    done
    
    echo ""
    echo -e "${YELLOW}These files should be deleted or moved to /tmp${NC}"
    return 1
}

# Delete temporary files
delete() {
    echo -e "${YELLOW}Scanning for temporary files...${NC}"
    echo ""
    
    local temp_files
    temp_files=$(find_temp_files)
    
    if [ -z "$temp_files" ]; then
        echo -e "${GREEN}✅ No temporary files found!${NC}"
        return 0
    fi
    
    local count=$(echo "$temp_files" | wc -l)
    echo -e "${RED}Found $count temporary file(s):${NC}"
    echo ""
    
    echo "$temp_files" | while IFS= read -r file; do
        echo -e "${RED}  ❌ $file${NC}"
    done
    
    echo ""
    read -p "Delete these files? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo -e "${YELLOW}Cancelled.${NC}"
        return 1
    fi
    
    echo ""
    echo -e "${YELLOW}Deleting files...${NC}"
    
    local deleted=0
    echo "$temp_files" | while IFS= read -r file; do
        if [ -f "$file" ]; then
            rm "$file"
            echo -e "${GREEN}  ✅ Deleted: $file${NC}"
            ((deleted++))
        fi
    done
    
    echo ""
    echo -e "${GREEN}✅ Deleted $deleted file(s)${NC}"
}

# Main
case "${1:-scan}" in
    scan)
        scan
        ;;
    delete)
        delete
        ;;
    *)
        echo "Usage: $0 [scan|delete]"
        echo ""
        echo "  scan   - Scan for temporary files (default)"
        echo "  delete - Delete temporary files (with confirmation)"
        exit 1
        ;;
esac

