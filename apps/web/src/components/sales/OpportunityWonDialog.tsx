import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/hooks/useUsers";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface OpportunityWonDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (data: { startDate?: string; projectManagerId?: string }) => Promise<void>;
    isLoading?: boolean;
}

export function OpportunityWonDialog({
    open,
    onOpenChange,
    onConfirm,
    isLoading,
}: OpportunityWonDialogProps) {
    const [startDate, setStartDate] = useState(
        new Date().toISOString().split("T")[0],
    );
    const [projectManagerId, setProjectManagerId] = useState<string>("");
    const { users, loading: usersLoading } = useUsers();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onConfirm({ startDate, projectManagerId });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Opportunity Won - Create Project</DialogTitle>
                        <DialogDescription>
                            Marking this opportunity as won will create a new project and copy
                            materials from the latest offer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="start-date" className="text-right">
                                Start Date
                            </Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="pm" className="text-right">
                                Project Manager
                            </Label>
                            <div className="col-span-3">
                                <Select
                                    value={projectManagerId}
                                    onValueChange={setProjectManagerId}
                                    disabled={usersLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Project Manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {!usersLoading &&
                                            users.map((user) => (
                                                <SelectItem key={user._id} value={user._id}>
                                                    {user.displayName}
                                                </SelectItem>
                                            ))}
                                        {users.length === 0 && !usersLoading && (
                                            <SelectItem value="current" disabled>
                                                No users found
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {/* Fallback if users list is empty/protected? Maybe show a hint */}
                                <p className="text-[0.8rem] text-muted-foreground mt-1">
                                    Leave empty to assign to Opportunity Owner.
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Processing..." : "Confirm & Create Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
