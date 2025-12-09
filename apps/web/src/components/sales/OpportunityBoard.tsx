import { useOpportunities } from "@/hooks/useOpportunities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Opportunity } from "@kompass/shared";
import { useNavigate } from "react-router-dom";

const STAGES: Opportunity["stage"][] = [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "closed_won",
];

export function OpportunityBoard() {
  const { opportunities, loading } = useOpportunities();
  const navigate = useNavigate();

  if (loading) return <div>Loading Pipeline...</div>;

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pipeline Board</h2>
        <Button onClick={() => navigate("/sales/new")}>New Opportunity</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto min-h-[500px]">
        {STAGES.map((stage) => (
          <div key={stage} className="bg-muted/50 p-4 rounded-lg min-w-[250px]">
            <h3 className="font-semibold mb-4 uppercase text-sm text-muted-foreground">
              {stage.replace("_", " ")}
            </h3>
            <div className="space-y-3">
              {opportunities
                .filter((op) => op.stage === stage)
                .map((op) => (
                  <Card
                    key={op._id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/sales/${op._id}`)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {op.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">
                        {op.expectedValue.toLocaleString("de-DE", {
                          style: "currency",
                          currency: op.currency || "EUR",
                        })}
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
