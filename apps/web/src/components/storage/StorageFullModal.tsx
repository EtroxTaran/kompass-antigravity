import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSyncStatus } from "@/hooks/useSyncStatus";
import { useNavigate } from "react-router-dom";
import { AlertCircle, HardDrive } from "lucide-react";

export function StorageFullModal() {
    const { isStorageCritical, storage } = useSyncStatus();
    const navigate = useNavigate();

    // If storage info is missing but marked critical, something is wrong, but we show generic
    const used = storage ? Math.round(storage.used / 1024 / 1024) + " MB" : "Unknown";
    const total = storage ? Math.round(storage.total / 1024 / 1024) + " MB" : "Unknown";

    const handleManage = () => {
        navigate("/settings/storage");
    };

    return (
        <Dialog open={isStorageCritical}>
            <DialogContent className="sm:max-w-[425px] border-red-200 bg-red-50 dark:bg-red-950/20">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="h-5 w-5" />
                        Offline-Speicher voll
                    </DialogTitle>
                    <DialogDescription className="pt-2 text-gray-700 dark:text-gray-300">
                        Ihr lokaler Speicher ist fast voll ({used} / {total}).
                        <br className="mb-2" />
                        Die automatische Synchronisierung wurde pausiert, um Datenverlust / Abstürze zu vermeiden.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center p-4">
                    <HardDrive className="h-12 w-12 text-red-200" />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Trotzdem versuchen (Neuladen)
                    </Button>
                    <Button variant="destructive" onClick={handleManage}>
                        Speicher verwalten
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
