
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRfq } from '@/hooks/useRfq';
import { RequestForQuote, RfqStatus } from '@kompass/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send, ArrowLeft } from 'lucide-react';
import { RfqComparisonTable } from './RfqComparisonTable';

export function RfqDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getRfq, sendRfq, awardQuote, loading } = useRfq();
    const [rfq, setRfq] = useState<RequestForQuote | null>(null);

    useEffect(() => {
        if (id) {
            loadRfq(id);
        }
    }, [id]);

    const loadRfq = async (rfqId: string) => {
        try {
            const data = await getRfq(rfqId);
            if (data) {
                setRfq(data);
            }
        } catch (error) {
            console.error('Failed to load RFQ', error);
        }
    };

    const handleSend = async () => {
        if (rfq && id) {
            try {
                await sendRfq(id);
                loadRfq(id); // Reload to update status
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

    if (loading && !rfq) return <div>Loading...</div>;
    if (!rfq) return <div>RFQ not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/rfqs')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{rfq.rfqNumber}</h1>
                        <p className="text-muted-foreground">{rfq.title}</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Badge variant="outline" className="text-lg">
                        {rfq.status}
                    </Badge>
                    {rfq.status === RfqStatus.DRAFT && (
                        <Button onClick={handleSend}>
                            <Send className="mr-2 h-4 w-4" /> Send RFQ
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-semibold">Project:</span>
                            <span>{rfq.projectId || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Deadline:</span>
                            <span>{new Date(rfq.responseDeadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Quantity:</span>
                            <span>{rfq.quantity} {rfq.unit}</span>
                        </div>
                        <div className="pt-4">
                            <h4 className="font-semibold mb-2">Specifications</h4>
                            <p className="whitespace-pre-wrap text-sm text-gray-700">{rfq.specifications}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Suppliers & Quotes</CardTitle>
                        <CardDescription>{rfq.quotes?.length || 0} quotes received from {rfq.invitedSuppliers?.length || 0} invited</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RfqComparisonTable rfq={rfq} onAward={handleAward} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
