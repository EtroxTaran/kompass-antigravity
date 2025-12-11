import { useState, useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useGlobalSearch, SearchResult } from "@/hooks/useGlobalSearch";
import {
  Layers,
  Users,
  TrendingUp,
  Package,
  FileText,
  Loader2,
} from "lucide-react";

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const navigate = useNavigate();
  const { results, loading, error, search, clearResults } = useGlobalSearch();
  const [searchTerm, setSearchTerm] = useState("");

  // Trigger search when term changes
  useEffect(() => {
    if (searchTerm) {
      search(searchTerm);
    } else {
      clearResults();
    }
  }, [searchTerm, search, clearResults]);

  // Clear search on close
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setSearchTerm("");
        clearResults();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open, clearResults]);

  const getIcon = (type: string) => {
    switch (type) {
      case "customer":
        return <Users className="mr-2 h-4 w-4" />;
      case "project":
        return <Layers className="mr-2 h-4 w-4" />;
      case "opportunity":
        return <TrendingUp className="mr-2 h-4 w-4" />;
      case "supplier":
        return <Package className="mr-2 h-4 w-4" />;
      case "material":
        return <Package className="mr-2 h-4 w-4" />;
      default:
        return <FileText className="mr-2 h-4 w-4" />;
    }
  };

  const handleSelect = (url: string) => {
    navigate(url);
    onOpenChange(false);
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query || query.length < 2) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  // Group results by type
  const groupedResults = {
    Kunden: results.filter((r) => r.type === "customer"),
    Projekte: results.filter((r) => r.type === "project"),
    Verkaufschancen: results.filter((r) => r.type === "opportunity"),
    Lieferanten: results.filter((r) => r.type === "supplier"),
    Materialien: results.filter((r) => r.type === "material"),
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Suche nach Kunden, Projekten, Materialien..."
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList>
        {loading && (
          <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Suche läuft...
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-sm text-red-500">{error}</div>
        )}

        {!loading && searchTerm.length >= 2 && results.length === 0 && (
          <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
        )}

        {!loading && searchTerm.length < 2 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Gib mindestens 2 Zeichen ein...
          </div>
        )}

        {!loading &&
          Object.entries(groupedResults).map(
            ([group, groupResults]) =>
              groupResults.length > 0 && (
                <div key={group}>
                  <CommandGroup heading={group}>
                    {groupResults.map((result: SearchResult) => (
                      <CommandItem
                        key={result.id}
                        value={result.title + (result.subtitle || "")}
                        onSelect={() => handleSelect(result.url)}
                      >
                        {getIcon(result.type)}
                        <div className="flex flex-col">
                          <span>
                            {highlightMatch(result.title, searchTerm)}
                          </span>
                          {result.subtitle && (
                            <span className="text-xs text-muted-foreground">
                              {highlightMatch(result.subtitle, searchTerm)}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </div>
              ),
          )}
      </CommandList>
    </CommandDialog>
  );
}
