import { useMemo, useState } from 'react';
import { SupplierPrice } from '@kompass/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    ArrowUpDown,
    Star,
    TrendingDown,
    Check,
} from 'lucide-react';

type SortField = 'price' | 'leadTime' | 'moq' | 'supplierName';
type SortDirection = 'asc' | 'desc';

interface MaterialPriceComparisonProps {
    supplierPrices?: SupplierPrice[];
    unit?: string;
    onSelectSupplier?: (supplierId: string, supplierName: string, unitPrice: number) => void;
}

/**
 * Material Price Comparison Component
 * Displays supplier prices in a sortable table for KALK to compare and select
 */
export function MaterialPriceComparison({
    supplierPrices = [],
    unit = 'Stück',
    onSelectSupplier,
}: MaterialPriceComparisonProps) {
    const [sortField, setSortField] = useState<SortField>('price');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Find lowest price for highlighting
    const lowestPrice = useMemo(() => {
        if (supplierPrices.length === 0) return 0;
        return Math.min(...supplierPrices.map(p => p.unitPrice));
    }, [supplierPrices]);

    // Sort prices
    const sortedPrices = useMemo(() => {
        return [...supplierPrices].sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'price':
                    comparison = a.unitPrice - b.unitPrice;
                    break;
                case 'leadTime':
                    comparison = a.leadTimeDays - b.leadTimeDays;
                    break;
                case 'moq':
                    comparison = a.minimumOrderQuantity - b.minimumOrderQuantity;
                    break;
                case 'supplierName':
                    comparison = a.supplierName.localeCompare(b.supplierName);
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [supplierPrices, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 -ml-2 font-medium"
            onClick={() => handleSort(field)}
        >
            {children}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );

    if (supplierPrices.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Preisvergleich</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Keine Lieferantenpreise hinterlegt.</p>
                        <p className="text-sm mt-2">
                            Fügen Sie Lieferanten hinzu, um Preise zu vergleichen.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    Preisvergleich
                    <Badge variant="secondary" className="font-normal">
                        {supplierPrices.length} Lieferant{supplierPrices.length > 1 ? 'en' : ''}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">
                                <SortHeader field="supplierName">Lieferant</SortHeader>
                            </TableHead>
                            <TableHead className="text-right">
                                <SortHeader field="price">Preis/{unit}</SortHeader>
                            </TableHead>
                            <TableHead className="text-right">
                                <SortHeader field="moq">MOQ</SortHeader>
                            </TableHead>
                            <TableHead className="text-right">
                                <SortHeader field="leadTime">Lieferzeit</SortHeader>
                            </TableHead>
                            {onSelectSupplier && (
                                <TableHead className="text-right w-[100px]">Aktion</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedPrices.map((price) => {
                            const isLowest = price.unitPrice === lowestPrice;
                            const isPreferred = price.isPreferred;

                            return (
                                <TableRow
                                    key={price.supplierId}
                                    className={isLowest ? 'bg-green-50 dark:bg-green-950/20' : ''}
                                >
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {price.supplierName}
                                            {isPreferred && (
                                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className={isLowest ? 'text-green-600 font-semibold' : ''}>
                                                {price.unitPrice.toLocaleString('de-DE', {
                                                    style: 'currency',
                                                    currency: price.currency || 'EUR',
                                                })}
                                            </span>
                                            {isLowest && (
                                                <Badge variant="default" className="bg-green-600 text-xs">
                                                    Günstigster
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {price.minimumOrderQuantity} {unit}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {price.leadTimeDays} Tage
                                    </TableCell>
                                    {onSelectSupplier && (
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onSelectSupplier(
                                                    price.supplierId,
                                                    price.supplierName,
                                                    price.unitPrice
                                                )}
                                            >
                                                <Check className="h-4 w-4 mr-1" />
                                                Wählen
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {/* Price summary */}
                <div className="mt-4 pt-4 border-t flex justify-between text-sm text-muted-foreground">
                    <span>
                        Günstigster: {lowestPrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </span>
                    <span>
                        Durchschnitt: {(supplierPrices.reduce((sum, p) => sum + p.unitPrice, 0) / supplierPrices.length).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
