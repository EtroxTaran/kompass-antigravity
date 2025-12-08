import { useOpportunities } from '@/hooks/useOpportunities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Opportunity } from '@kompass/shared';

const STAGES: Opportunity['stage'][] = [
    'lead',
    'qualified',
    'proposal',
    'negotiation',
    'closed_won',
];

export function OpportunityBoard() {
    const { opportunities, loading, addOpportunity } = useOpportunities();

    const handleAddDummy = () => {
        const dummy: Omit<Opportunity, '_id' | '_rev'> = {
            type: 'opportunity',
            title: `Deal ${Date.now()}`,
            customerId: 'customer-1',
            stage: 'lead',
            probability: 10,
            expectedValue: Math.floor(Math.random() * 10000),
            currency: 'EUR',
            owner: 'user-1',
            createdBy: 'user-1',
            createdAt: new Date().toISOString(),
            modifiedBy: 'user-1',
            modifiedAt: new Date().toISOString(),
            version: 1,
        };
        addOpportunity(dummy);
    };

    if (loading) return <div>Loading Pipeline...</div>;

    return (
        <div className="space-y-4 mt-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Sales Pipeline</h2>
                <Button onClick={handleAddDummy}>New Opportunity</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto min-h-[500px]">
                {STAGES.map((stage) => (
                    <div key={stage} className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-4 uppercase text-sm text-muted-foreground">
                            {stage.replace('_', ' ')}
                        </h3>
                        <div className="space-y-3">
                            {opportunities
                                .filter((op) => op.stage === stage)
                                .map((op) => (
                                    <Card key={op._id} className="cursor-pointer hover:shadow-md transition-shadow">
                                        <CardHeader className="p-4 pb-2">
                                            <CardTitle className="text-sm font-medium">{op.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <div className="text-2xl font-bold">
                                                {op.expectedValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {op.probability}% Prob.
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
