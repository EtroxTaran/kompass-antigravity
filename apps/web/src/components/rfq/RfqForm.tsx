
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRfq } from '@/hooks/useRfq';
import { CreateRfqDto } from '@kompass/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Assuming we have a SupplierSelect component or similar, otherwise plain input for MVP
// import { SupplierSelect } from '@/components/inventory/SupplierSelect'; 

export function RfqForm() {
    const navigate = useNavigate();
    const { createRfq, loading } = useRfq();
    const form = useForm<CreateRfqDto>({
        defaultValues: {
            title: '',
            description: '',
            specifications: '',
            quantity: 1,
            unit: 'pcs',
            responseDeadline: new Date().toISOString().split('T')[0],
            invitedSuppliers: [], // Initialize as empty array
        },
    });

    const onSubmit = async (data: CreateRfqDto) => {
        // Ensure invitedSuppliers is array of strings. 
        // For MVP, if we don't have multi-select UI, we might accept comma separated IDs or just single ID
        // Let's assume we want to invite at least one supplier.
        // Or we can add suppliers later in Detail view? 
        // Requirement says "Create RFQ ... Select Suppliers".
        // Let's keep it simple: Create basic details first.

        try {
            const result = await createRfq(data);
            navigate(`/rfqs/${result._id}`);
        } catch (error) {
            console.error('Failed to create RFQ', error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Request for Quote</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            rules={{ required: 'Title is required' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="RFQ Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                rules={{ required: 'Quantity is required', min: 1 }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="unit"
                                rules={{ required: 'Unit is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. pcs, kg" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="responseDeadline"
                            rules={{ required: 'Deadline is required' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Response Deadline</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="specifications"
                            rules={{ required: 'Specifications are required' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specifications</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Detailed specifications..." className="h-32" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Project ID Selection - Optional for MVP or simple input */}
                        <FormField
                            control={form.control}
                            name="projectId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project ID (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Project ID" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => navigate('/rfqs')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                Create RFQ
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
