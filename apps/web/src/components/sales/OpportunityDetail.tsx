import { useState } from "react";
import { Opportunity } from "@kompass/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useCustomer } from "@/hooks/useCustomer";
import { ActivityTimeline } from "@/components/crm/ActivityTimeline";
import { Separator } from "@/components/ui/separator";
import { OpportunityWonDialog } from "./OpportunityWonDialog";
import { opportunitiesApi } from "@/services/apiClient";
import { CommentSection } from "@/components/common/comments/CommentSection";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OpportunityDetailProps {
  opportunity: Opportunity;
}

export function OpportunityDetail({ opportunity }: OpportunityDetailProps) {
  const navigate = useNavigate();
  const { customer } = useCustomer(opportunity.customerId);
  const [showWonDialog, setShowWonDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const handleMarkAsWon = async (data: {
    startDate?: string;
    projectManagerId?: string;
  }) => {
    setIsProcessing(true);
    try {
      const response = await opportunitiesApi.markAsWon(opportunity._id, data);
      const project = (response as any).project;
      navigate(`/projects/${project._id}`);
    } catch (error) {
      console.error("Failed to mark as won:", error);
      // Ideally show toast here
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {opportunity.title}
          </h2>
          <p className="text-muted-foreground mt-1">
            {customer ? (
              <span
                className="hover:underline cursor-pointer text-primary"
                onClick={() => navigate(`/customers/${customer._id}`)}
              >
                {customer.companyName}
              </span>
            ) : (
              "Loading customer..."
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {opportunity.stage !== "closed_won" && (
            <Button onClick={() => setShowWonDialog(true)}>Mark as Won</Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate(`/sales/${opportunity._id}/edit`)}
          >
            Edit Opportunity
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">
                    {opportunity.description || "No description provided."}
                  </p>
                </CardContent>
              </Card>
              <Separator className="my-6" />
              <ActivityTimeline
                customerId={opportunity.customerId}
                customerName={customer?.companyName}
                // Note: ActivityTimeline filters by contactId or ActivityType, but maybe we want to filter by context (Opportunity)?
                // The current Activity model doesn't link to Opportunity directly.
                // I will display all activities for this customer for now, or just leave it as customer timeline.
                // Ideally we'd link activities to opportunities, but Activity type (contact.ts/activity.ts) doesn't seem to have opportunityId.
              />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pipeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-muted-foreground">
                      Stage
                    </span>
                    <Badge variant="secondary" className="uppercase">
                      {opportunity.stage.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-muted-foreground">
                      Value
                    </span>
                    <span className="text-lg font-bold">
                      {opportunity.expectedValue.toLocaleString("de-DE", {
                        style: "currency",
                        currency: opportunity.currency,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-muted-foreground">
                      Probability
                    </span>
                    <span>{opportunity.probability}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-muted-foreground">
                      Expected Close
                    </span>
                    <span>{opportunity.expectedCloseDate || "-"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assignments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-muted-foreground">
                      Owner
                    </span>
                    <span>{opportunity.owner}</span>{" "}
                    {/* Resolve User Name later */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="h-[600px]">
          <CommentSection
            entityType="opportunity"
            entityId={opportunity._id}
            comments={opportunity.comments || []}
            onCommentAdded={() => {
              queryClient.invalidateQueries({ queryKey: ["opportunities"] }); // or specific ID query
            }}
            onCommentResolved={() => {
              queryClient.invalidateQueries({ queryKey: ["opportunities"] });
            }}
          />
        </TabsContent>
      </Tabs>

      <OpportunityWonDialog
        open={showWonDialog}
        onOpenChange={setShowWonDialog}
        onConfirm={handleMarkAsWon}
        isLoading={isProcessing}
      />
    </div>
  );
}
