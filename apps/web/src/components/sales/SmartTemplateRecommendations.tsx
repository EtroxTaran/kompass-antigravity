import { useState, useEffect, useCallback } from "react";
import { offersApi } from "@/services/apiClient";
import { Offer } from "@kompass/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Recommendation {
    id: string;
    description: string;
    totalEur: number;
    lineItemCount: number;
    tags: string[];
    offerData: Partial<Offer>;
}

interface SmartTemplateRecommendationsProps {
    initialCustomerId?: string;
    onApply: (offerData: Partial<Offer>) => void;
}

export function SmartTemplateRecommendations({
    initialCustomerId,
    onApply,
}: SmartTemplateRecommendationsProps) {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tags, setTags] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    // If customer ID changes, we might want to auto-fetch?
    // But requirement says "Suggest 'Standard Store Template'" (implies some logic)
    // Let's rely on manual trigger or explicit tags for now to avoid noise.

    const handleSearch = useCallback(async () => {
        setIsLoading(true);
        setHasSearched(true);
        try {
            const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
            const results = await offersApi.getRecommendations({
                customerId: initialCustomerId,
                tags: tagList,
            });
            // Cast the result's offerData to Partial<Offer> as we know the shape from backend
            const typedResults: Recommendation[] = results.map(r => ({
                ...r,
                offerData: r.offerData as Partial<Offer>
            }));
            setRecommendations(typedResults);
        } catch (error) {
            console.error("Failed to fetch recommendations", error);
        } finally {
            setIsLoading(false);
        }
    }, [initialCustomerId, tags]);

    useEffect(() => {
        if (initialCustomerId || tags) {
            // Debounce or just wait for user? 
            // Let's auto-search if customerId is present initially?
            // Maybe better to wait for user interaction to be "Smart" but not annoying.
            // But for "pattern matching", if we have a customer, we should show "Similar projects for this customer".
            if (initialCustomerId && !hasSearched) {
                handleSearch();
            }
        }
    }, [initialCustomerId, hasSearched, handleSearch, tags]);

    if (!initialCustomerId && !tags && !hasSearched) {
        return null; // Don't show if no context
    }

    return (
        <Card className="mb-6 bg-slate-50 border-blue-100">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                    <Sparkles className="h-4 w-4" />
                    Smart Recommendations
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 mb-4 items-end">
                    <div className="flex-1">
                        <Label htmlFor="tags-input" className="text-xs text-muted-foreground mb-1 block">
                            Find similar projects by tags (e.g. "Store, Office")
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="tags-input"
                                placeholder="Enter tags..."
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                                className="bg-white"
                            />
                            <Button variant="secondary" size="sm" onClick={handleSearch} disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find"}
                            </Button>
                        </div>
                    </div>
                </div>

                {recommendations.length > 0 ? (
                    <div className="space-y-3">
                        {recommendations.map((rec) => (
                            <div
                                key={rec.id}
                                className="flex items-center justify-between p-3 bg-white rounded-md border text-sm"
                            >
                                <div className="space-y-1">
                                    <div className="font-medium text-slate-800">
                                        {rec.description}
                                    </div>
                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                        <span>{rec.lineItemCount} items</span>
                                        <span>•</span>
                                        <span>
                                            {new Intl.NumberFormat("de-DE", {
                                                style: "currency",
                                                currency: "EUR",
                                            }).format(rec.totalEur)}
                                        </span>
                                    </div>
                                    {rec.tags.length > 0 && (
                                        <div className="flex gap-1 mt-1">
                                            {rec.tags.map(tag => (
                                                <Badge key={tag} variant="outline" className="text-[10px] h-4 px-1">{tag}</Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => onApply(rec.offerData)}
                                >
                                    Use Template
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    hasSearched && !isLoading && (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                            No matching templates found.
                        </div>
                    )
                )}
            </CardContent>
        </Card>
    );
}
