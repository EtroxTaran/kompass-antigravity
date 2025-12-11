import { Button } from "@/components/ui/button";
import { useTieredStorage } from "@/hooks/useTieredStorage";
import { Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PinButtonProps {
  docId: string;
  className?: string;
  variant?: "ghost" | "outline" | "default" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function PinButton({ 
  docId, 
  className,
  variant = "ghost",
  size = "icon",
  showLabel = false
}: PinButtonProps) {
  const { isPinned, pinDocument, unpinDocument } = useTieredStorage();
  const [isPending, setIsPending] = useState(false);
  
  const pinned = isPinned(docId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPending(true);
    try {
      if (pinned) {
        await unpinDocument(docId);
      } else {
        await pinDocument(docId);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("h-8 w-8", className, pinned && "text-blue-500")}
      onClick={handleToggle}
      disabled={isPending}
      title={pinned ? "Nicht mehr offline verfügbar halten" : "Für Offline-Zugriff pinnen"}
    >
      {pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
      {showLabel && (
        <span className="ml-2">
          {pinned ? "Gepinned" : "Pinnen"}
        </span>
      )}
    </Button>
  );
}
