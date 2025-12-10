
import { useState, useCallback } from 'react';
import { CreateRfqDto, RecordQuoteDto } from '@kompass/shared';
import { rfqApi } from '../services/apiClient';
import { useToast } from '@/components/ui/use-toast';

export const useRfq = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchRfqs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await rfqApi.list();
            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch RFQs';
            setError(message);
            toast({ title: 'Error', description: message, variant: 'destructive' });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const getRfq = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const rfq = await rfqApi.get(id);
            return rfq;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch RFQ';
            setError(message);
            toast({ title: 'Error', description: message, variant: 'destructive' });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const createRfq = useCallback(async (data: CreateRfqDto) => {
        setLoading(true);
        setError(null);
        try {
            const rfq = await rfqApi.create(data);
            toast({ title: 'Success', description: 'RFQ created successfully' });
            return rfq;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to create RFQ';
            setError(message);
            toast({ title: 'Error', description: message, variant: 'destructive' });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const sendRfq = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const rfq = await rfqApi.send(id);
            toast({ title: 'Success', description: 'RFQ sent to suppliers' });
            return rfq;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to send RFQ';
            setError(message);
            toast({ title: 'Error', description: message, variant: 'destructive' });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const recordQuote = useCallback(async (id: string, data: RecordQuoteDto) => {
        setLoading(true);
        setError(null);
        try {
            const rfq = await rfqApi.recordQuote(id, data);
            toast({ title: 'Success', description: 'Quote recorded' });
            return rfq;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to record quote';
            setError(message);
            toast({ title: 'Error', description: message, variant: 'destructive' });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const awardQuote = useCallback(async (id: string, quoteId: string) => {
        setLoading(true);
        setError(null);
        try {
            const rfq = await rfqApi.awardQuote(id, quoteId);
            toast({ title: 'Success', description: 'Quote awarded and contract created' });
            return rfq;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to award quote';
            setError(message);
            toast({ title: 'Error', description: message, variant: 'destructive' });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [toast]);

    return {
        loading,
        error,
        fetchRfqs,
        getRfq,
        createRfq,
        sendRfq,
        recordQuote,
        awardQuote,
    };
};
