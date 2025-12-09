import { useSupplierInvoice } from '@/hooks/useSupplierInvoice';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InvoiceMatchValidation } from './InvoiceMatchValidation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { SupplierInvoice } from '@/types/supplier-invoice';

interface SupplierInvoiceListProps {
    supplierId?: string;
}

export function SupplierInvoiceList({ supplierId }: SupplierInvoiceListProps) {
    const navigate = useNavigate();
    const { useInvoices, approveInvoice } = useSupplierInvoice();
    const { data: invoices, isLoading } = useInvoices(supplierId);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

    if (isLoading) {
        return <div>Loading invoices...</div>;
    }

    const handleApprove = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await approveInvoice.mutateAsync(id);
        } catch (err) {
            console.error("Failed to approve", err);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Supplier Invoices</h2>
                <Button onClick={() => navigate('/supplier-invoices/new')}>
                    <Plus className="h-4 w-4 mr-2" /> Record Invoice
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Match</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices?.map((invoice: SupplierInvoice) => (
                                <TableRow key={invoice._id} className="cursor-pointer" onClick={() => setSelectedInvoiceId(invoice._id)}>
                                    <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{invoice.invoiceNumber}</TableCell>
                                    <TableCell>{invoice.grossAmount.toFixed(2)} €</TableCell>
                                    <TableCell>
                                        <Badge variant={invoice.paymentStatus === 'Approved' ? 'default' : 'secondary'}>
                                            {invoice.paymentStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {invoice.matchValidation && (
                                            <div className="flex gap-1">
                                                {invoice.matchValidation.poMatch ? <span className="text-green-500">PO</span> : <span className="text-red-500">PO</span>}
                                                <span>/</span>
                                                {invoice.matchValidation.deliveryMatch ? <span className="text-green-500">DEL</span> : <span className="text-red-500">DEL</span>}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {invoice.paymentStatus === 'Pending' && (
                                            <Button size="sm" variant="outline" onClick={(e) => handleApprove(invoice._id, e)}>
                                                <Check className="h-4 w-4 mr-1" /> Approve
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!invoices || invoices.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No invoices found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Detail Dialog/Modal for Match Validation */}
            <Dialog open={!!selectedInvoiceId} onOpenChange={(open) => !open && setSelectedInvoiceId(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Invoice Details</DialogTitle>
                    </DialogHeader>
                    {selectedInvoiceId && invoices?.find((i: SupplierInvoice) => i._id === selectedInvoiceId)?.matchValidation && (
                        <InvoiceMatchValidation validation={invoices.find((i: SupplierInvoice) => i._id === selectedInvoiceId)!.matchValidation!} />
                    )}
                    {selectedInvoiceId && !invoices?.find((i: SupplierInvoice) => i._id === selectedInvoiceId)?.matchValidation && (
                        <p>No 3-way match data available.</p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
