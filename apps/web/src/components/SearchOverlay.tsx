import { useState } from "react";
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
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import {
  Layers,
  Users,
  TrendingUp,
  Package,
  FileText,
  MapPin,
} from "lucide-react";

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const navigate = useNavigate();
  const { results, loading } = useGlobalSearch();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResults = results.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
      case "invoice":
        return <FileText className="mr-2 h-4 w-4" />;
      case "warehouse":
        return <MapPin className="mr-2 h-4 w-4" />;
      case "location":
        return <MapPin className="mr-2 h-4 w-4" />;
      default:
        return <Layers className="mr-2 h-4 w-4" />;
    }
  };

  const handleSelect = (url: string) => {
    navigate(url);
    onOpenChange(false);
  };

  const groupedResults = {
    Kunden: filteredResults.filter((r) => r.type === "customer"),
    Projekte: filteredResults.filter((r) => r.type === "project"),
    "Verkauf & Rechnungen": filteredResults.filter((r) =>
      ["opportunity", "invoice"].includes(r.type),
    ),
    "Inventar & Lager": filteredResults.filter((r) =>
      ["supplier", "material", "warehouse", "location"].includes(r.type),
    ),
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Suche nach Kunden, Projekten, Rechnungen..."
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList>
        <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
        {loading && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Lade Daten...
          </div>
        )}

        {Object.entries(groupedResults).map(
          ([group, groupResults]) =>
            groupResults.length > 0 && (
              <div key={group}>
                <CommandGroup heading={group}>
                  {groupResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title + result.subtitle}
                      onSelect={() => handleSelect(result.url)}
                    >
                      {getIcon(result.type)}
                      <div className="flex flex-col">
                        <span>{result.title}</span>
                        {result.subtitle && (
                          <span className="text-xs text-muted-foreground">
                            {result.subtitle}
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
