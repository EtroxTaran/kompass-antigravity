
import { useState } from 'react';
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { StarRating } from "../ui/StarRating";
import { useToast } from "../ui/use-toast";
import { useSupplier } from "../../hooks/useSupplier";

interface SupplierRatingFormProps {
    supplierId: string;
    supplierName: string;
    projectId?: string; // Optional context
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function SupplierRatingForm({ supplierId, supplierName, open, onOpenChange, onSuccess }: SupplierRatingFormProps) {
    const { rateSupplier } = useSupplier();
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);

    // 4 dimensions
    const [quality, setQuality] = useState(0);
    const [reliability, setReliability] = useState(0);
    const [communication, setCommunication] = useState(0);
    const [priceValue, setPriceValue] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async () => {
        if (quality === 0 || reliability === 0 || communication === 0 || priceValue === 0) {
            toast({
                title: "Incomplete Rating",
                description: "Please rate all 4 dimensions.",
                variant: "destructive"
            });
            return;
        }

        try {
            setSubmitting(true);
            await rateSupplier(supplierId, {
                quality,
                reliability,
                communication,
                priceValue,
                feedback
            });

            toast({
                title: "Rating Submitted",
                description: `Rating for ${supplierName} has been recorded.`
            });
            onOpenChange(false);
            // Reset form
            setQuality(0);
            setReliability(0);
            setCommunication(0);
            setPriceValue(0);
            setFeedback('');

            if (onSuccess) onSuccess();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit rating.",
                variant: "destructive"
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Rate Supplier: {supplierName}</DialogTitle>
                    <DialogDescription>
                        Please rate the supplier performance on completed work.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Quality</Label>
                        <div className="col-span-3">
                            <StarRating rating={quality} onRatingChange={setQuality} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Reliability</Label>
                        <div className="col-span-3">
                            <StarRating rating={reliability} onRatingChange={setReliability} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Communication</Label>
                        <div className="col-span-3">
                            <StarRating rating={communication} onRatingChange={setCommunication} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Price/Value</Label>
                        <div className="col-span-3">
                            <StarRating rating={priceValue} onRatingChange={setPriceValue} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="feedback">Feedback (Optional)</Label>
                        <Textarea
                            id="feedback"
                            placeholder="Additional comments..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={submitting}>Submit Rating</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
