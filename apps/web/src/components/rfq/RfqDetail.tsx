
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRfq } from '@/hooks/useRfq';
import { RequestForQuote, RfqStatus, RecordQuoteDto } from '@kompass/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send, ArrowLeft, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { RfqComparisonTable } from './RfqComparisonTable';
import { RfqQuoteForm } from './RfqQuoteForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function RfqDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getRfq, sendRfq, awardQuote, recordQuote, loading } = useRfq();
    const [rfq, setRfq] = useState<RequestForQuote | null>(null);

    const loadRfq = useCallback(async (rfqId: string) => {
        try {
            const data = await getRfq(rfqId);
            if (data) {
                setRfq(data);
            }
        } catch (error) {
            console.error('Failed to load RFQ', error);
        }
    }, [getRfq]);

    useEffect(() => {
        if (id) {
            loadRfq(id);
        }
    }, [id, loadRfq]);

    const handleSend = async () => {
        if (rfq && id) {
            try {
                await sendRfq(id);
                loadRfq(id);
            } catch (error) {
                console.error('Failed to send RFQ', error);
            }
        }
    };

    const handleAward = async (quoteId: string) => {
        if (rfq && id) {
            try {
                await awardQuote(id, quoteId);
                loadRfq(id);
            } catch (error) {
                console.error('Failed to award quote', error);
            }
        }
    };

    const handleRecordQuote = async (data: RecordQuoteDto) => {
        if (rfq && id) {
            await recordQuote(id, data);
            loadRfq(id);
        }
    };

    const getStatusBadge = (status: RfqStatus) => {
        switch (status) {
            case RfqStatus.DRAFT:
                return <Badge variant="secondary" className="text-lg">Draft</Badge>;
            case RfqStatus.SENT:
                return <Badge variant="default" className="bg-blue-500 text-lg">Sent</Badge>;
            case RfqStatus.QUOTES_RECEIVED:
                return <Badge variant="default" className="bg-yellow-500 text-lg">Quotes Received</Badge>;
            case RfqStatus.AWARDED:
                return <Badge variant="default" className="bg-green-500 text-lg">Awarded</Badge>;
            case RfqStatus.CANCELLED:
                return <Badge variant="destructive" className="text-lg">Cancelled</Badge>;
            default:
                return <Badge variant="outline" className="text-lg">{status}</Badge>;
        }
    };

    // Check if deadline has passed
    const isDeadlinePassed = rfq && new Date(rfq.responseDeadline) < new Date();

    if (loading && !rfq) return <div className="text-center p-8">Loading...</div>;
    if (!rfq) return <div className="text-center p-8">RFQ not found</div>;

    const canRecordQuotes = rfq.status === RfqStatus.SENT || rfq.status === RfqStatus.QUOTES_RECEIVED;
    const canAward = rfq.status === RfqStatus.QUOTES_RECEIVED && (rfq.quotes?.length || 0) > 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/rfqs')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{rfq.rfqNumber}</h1>
                        <p className="text-muted-foreground">{rfq.title}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    {getStatusBadge(rfq.status)}
                    {rfq.status === RfqStatus.DRAFT && (
                        <Button onClick={handleSend} disabled={loading || (rfq.invitedSuppliers?.length || 0) === 0}>
                            <Send className="mr-2 h-4 w-4" /> Send RFQ
                        </Button>
                    )}
                    {canRecordQuotes && (
                        <RfqQuoteForm
                            invitedSupplierIds={rfq.invitedSuppliers || []}
                            onSubmit={handleRecordQuote}
                            loading={loading}
                        />
                    )}
                </div>
            </div>

            {/* Alerts */}
            {rfq.status === RfqStatus.DRAFT && (rfq.invitedSuppliers?.length || 0) === 0 && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No Suppliers Selected</AlertTitle>
                    <AlertDescription>
                        This RFQ has no suppliers selected. Please edit the RFQ to add suppliers before sending.
                    </AlertDescription>
                </Alert>
            )}

            {isDeadlinePassed && rfq.status !== RfqStatus.AWARDED && (
                <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertTitle>Deadline Passed</AlertTitle>
                    <AlertDescription>
                        The response deadline for this RFQ has passed. You can still record any late quotes.
                    </AlertDescription>
                </Alert>
            )}

            {rfq.status === RfqStatus.AWARDED && (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Quote Awarded</AlertTitle>
                    <AlertDescription className="text-green-700">
                        A supplier has been selected for this RFQ.
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>RFQ Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Project</span>
                                <p className="font-medium">{rfq.projectId || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Response Deadline</span>
                                <p className={`font-medium ${isDeadlinePassed ? 'text-red-600' : ''}`}>
                                    {new Date(rfq.responseDeadline).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Quantity</span>
                                <p className="font-medium">{rfq.quantity} {rfq.unit}</p>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Created</span>
                                <p className="font-medium">{new Date(rfq.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {rfq.description && (
                            <div className="pt-4 border-t">
                                <h4 className="text-sm text-muted-foreground mb-2">Description</h4>
                                <p className="text-sm">{rfq.description}</p>
                            </div>
                        )}

                        <div className="pt-4 border-t">
                            <h4 className="text-sm text-muted-foreground mb-2">Specifications</h4>
                            <p className="whitespace-pre-wrap text-sm bg-muted p-3 rounded-md">
                                {rfq.specifications}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Quotes Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quotes</CardTitle>
                        <CardDescription>
                            {rfq.quotes?.length || 0} quotes received from {rfq.invitedSuppliers?.length || 0} invited suppliers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RfqComparisonTable
                            rfq={rfq}
                            onAward={canAward ? handleAward : undefined}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
