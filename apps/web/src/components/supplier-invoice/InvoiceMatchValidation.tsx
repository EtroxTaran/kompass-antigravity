import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Truck, FileText, Ban } from 'lucide-react';
import { MatchValidationResult } from '@/types/supplier-invoice';

interface InvoiceMatchValidationProps {
    validation: MatchValidationResult;
}

export function InvoiceMatchValidation({ validation }: InvoiceMatchValidationProps) {
    const { poMatch, deliveryMatch, amountVariance, autoApproved, flags } = validation;

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">3-Way Match Validation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* PO Match */}
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                        <div className="flex items-center gap-3">
                            <FileText className={`h-5 w-5 ${poMatch ? 'text-green-500' : 'text-red-500'}`} />
                            <span className="font-medium">Order Match</span>
                        </div>
                        {poMatch ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <Ban className="h-5 w-5 text-red-500" />
                        )}
                    </div>

                    {/* Delivery Match */}
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                        <div className="flex items-center gap-3">
                            <Truck className={`h-5 w-5 ${deliveryMatch ? 'text-green-500' : 'text-red-500'}`} />
                            <span className="font-medium">Delivery Match</span>
                        </div>
                        {deliveryMatch ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <Ban className="h-5 w-5 text-red-500" />
                        )}
                    </div>

                    {/* Amount Variance */}
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                        <div className="flex items-center gap-3">
                            <AlertCircle className={`h-5 w-5 ${amountVariance <= 10 ? 'text-green-500' : 'text-yellow-500'}`} />
                            <span className="font-medium">Variance</span>
                        </div>
                        <Badge variant={amountVariance <= 10 ? 'outline' : 'destructive'}>
                            {amountVariance.toFixed(1)}%
                        </Badge>
                    </div>
                </div>

                {flags.length > 0 && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                        <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" /> Discrepancies Found
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-destructive">
                            {flags.map((flag, i) => (
                                <li key={i}>{flag}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {autoApproved && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium text-sm">Valid for Auto-Approval (&lt;1000€)</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
