
import { RequestForQuote, SupplierQuote, QuoteStatus } from '@kompass/shared';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface RfqComparisonTableProps {
    rfq: RequestForQuote;
    onAward: (quoteId: string) => void;
}

export function RfqComparisonTable({ rfq, onAward }: RfqComparisonTableProps) {
    const quotes = rfq.quotes || [];

    if (quotes.length === 0) {
        return <div className="text-center p-4">No quotes received yet.</div>;
    }

    // Find the lowest price to highlight
    const lowestPrice = Math.min(...quotes.map((q: SupplierQuote) => q.quotedPrice));

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Delivery Days</TableHead>
                        <TableHead>Valid Until</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {quotes.map((quote: SupplierQuote) => (
                        <TableRow key={quote.id} className={quote.status === QuoteStatus.AWARDED ? 'bg-green-50' : ''}>
                            <TableCell className="font-medium">
                                {/* Ideally fetch supplier name, for now ID */}
                                {quote.supplierId}
                            </TableCell>
                            <TableCell>
                                <span className={quote.quotedPrice === lowestPrice ? 'font-bold text-green-600' : ''}>
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(quote.quotedPrice)}
                                </span>
                            </TableCell>
                            <TableCell>{quote.deliveryDays}</TableCell>
                            <TableCell>{new Date(quote.validUntil).toLocaleDateString()}</TableCell>
                            <TableCell>
                                {quote.status === QuoteStatus.AWARDED && <Badge className="bg-green-500">Awarded</Badge>}
                                {quote.status === QuoteStatus.REJECTED && <Badge variant="destructive">Rejected</Badge>}
                                {quote.status === QuoteStatus.RECEIVED && <Badge variant="secondary">Received</Badge>}
                            </TableCell>
                            <TableCell className="text-right">
                                {rfq.status !== 'Awarded' && quote.status === QuoteStatus.RECEIVED && (
                                    <Button size="sm" onClick={() => onAward(quote.id)}>
                                        <Check className="mr-2 h-4 w-4" /> Award
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
