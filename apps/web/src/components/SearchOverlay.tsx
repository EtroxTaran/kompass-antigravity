import { useNavigate } from 'react-router-dom';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Calendar,
    Settings,
    User,
    Briefcase,
    Building2,
    Plus,
} from 'lucide-react';

interface SearchOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
    const navigate = useNavigate();

    const handleSelect = (path: string) => {
        navigate(path);
        onOpenChange(false);
    };

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Suche nach Kunden, Projekten oder Funktionen..." />
            <CommandList>
                <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>

                <CommandGroup heading="Schnellzugriff">
                    <CommandItem onSelect={() => handleSelect('/')}>
                        <Briefcase className="mr-2 h-4 w-4" />
                        Dashboard
                    </CommandItem>
                    <CommandItem onSelect={() => handleSelect('/tasks')}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Meine Aufgaben
                    </CommandItem>
                    <CommandItem onSelect={() => handleSelect('/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Einstellungen
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Kunden">
                    <CommandItem onSelect={() => handleSelect('/customers')}>
                        <Building2 className="mr-2 h-4 w-4" />
                        Alle Kunden
                    </CommandItem>
                    {/* Mock Data */}
                    <CommandItem onSelect={() => handleSelect('/customers/1')}>
                        <User className="mr-2 h-4 w-4" />
                        Hofladen Müller GmbH
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Aktionen">
                    <CommandItem onSelect={() => handleSelect('/customers/new')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Neuer Kunde
                    </CommandItem>
                    <CommandItem onSelect={() => handleSelect('/projects/new')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Neues Projekt
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
