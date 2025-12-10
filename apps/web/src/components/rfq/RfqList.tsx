
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRfq } from '@/hooks/useRfq';
import { RequestForQuote, RfqStatus } from '@kompass/shared';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function RfqList() {
    const navigate = useNavigate();
    const { fetchRfqs, loading } = useRfq();
    const [rfqs, setRfqs] = useState<RequestForQuote[]>([]);
    const [search, setSearch] = useState('');

    const loadRfqs = useCallback(async () => {
        try {
            const data = await fetchRfqs();
            if (data) {
                setRfqs(data);
            }
        } catch (error) {
            console.error('Failed to load RFQs', error);
        }
    }, [fetchRfqs]);

    useEffect(() => {
        loadRfqs();
    }, [loadRfqs]);

    const filteredRfqs = rfqs.filter((rfq) =>
        rfq.title.toLowerCase().includes(search.toLowerCase()) ||
        rfq.rfqNumber.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status: RfqStatus) => {
        switch (status) {
            case RfqStatus.DRAFT:
                return <Badge variant="secondary">Draft</Badge>;
            case RfqStatus.SENT:
                return <Badge variant="default" className="bg-blue-500">Sent</Badge>;
            case RfqStatus.QUOTES_RECEIVED:
                return <Badge variant="default" className="bg-yellow-500">Quotes Received</Badge>;
            case RfqStatus.AWARDED:
                return <Badge variant="default" className="bg-green-500">Awarded</Badge>;
            case RfqStatus.CANCELLED:
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">Request for Quotes</CardTitle>
                <Button onClick={() => navigate('/rfqs/new')}>
                    <Plus className="mr-2 h-4 w-4" /> New RFQ
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search RFQs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>RFQ Number</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Deadline</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Quotes</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : filteredRfqs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No RFQs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRfqs.map((rfq) => (
                                    <TableRow key={rfq._id}>
                                        <TableCell className="font-medium">{rfq.rfqNumber}</TableCell>
                                        <TableCell>{rfq.title}</TableCell>
                                        <TableCell>{rfq.projectId || '-'}</TableCell>
                                        <TableCell>
                                            {new Date(rfq.responseDeadline).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(rfq.status)}</TableCell>
                                        <TableCell>{rfq.quotes?.length || 0}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => navigate(`/rfqs/${rfq._id}`)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
