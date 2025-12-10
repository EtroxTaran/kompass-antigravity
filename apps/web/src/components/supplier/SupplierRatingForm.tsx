
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

export function SupplierRatingForm({ supplierId, supplierName, projectId, open, onOpenChange, onSuccess }: SupplierRatingFormProps) {
    const { rateSupplier } = useSupplier(supplierId);
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
                title: "Unvollständige Bewertung",
                description: "Bitte bewerten Sie alle 4 Kategorien.",
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
                feedback,
                projectId
            });

            toast({
                title: "Bewertung gespeichert",
                description: `Bewertung für ${supplierName} wurde erfolgreich gespeichert.`
            });
            onOpenChange(false);
            // Reset form
            setQuality(0);
            setReliability(0);
            setCommunication(0);
            setPriceValue(0);
            setFeedback('');

            if (onSuccess) onSuccess();
        } catch {
            toast({
                title: "Fehler",
                description: "Bewertung konnte nicht gespeichert werden.",
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
                    <DialogTitle>Lieferant bewerten: {supplierName}</DialogTitle>
                    <DialogDescription>
                        Bitte bewerten Sie die Leistung des Lieferanten{projectId ? ` für dieses Projekt` : ''}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Qualität</Label>
                        <div className="col-span-3">
                            <StarRating rating={quality} onRatingChange={setQuality} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Zuverlässigkeit</Label>
                        <div className="col-span-3">
                            <StarRating rating={reliability} onRatingChange={setReliability} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Kommunikation</Label>
                        <div className="col-span-3">
                            <StarRating rating={communication} onRatingChange={setCommunication} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Preis/Leistung</Label>
                        <div className="col-span-3">
                            <StarRating rating={priceValue} onRatingChange={setPriceValue} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="feedback">Feedback (Optional)</Label>
                        <Textarea
                            id="feedback"
                            placeholder="Zusätzliche Anmerkungen..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Abbrechen</Button>
                    <Button onClick={handleSubmit} disabled={submitting}>Bewertung speichern</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
