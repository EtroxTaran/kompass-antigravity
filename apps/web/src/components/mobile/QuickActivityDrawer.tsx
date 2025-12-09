import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ActivityForm } from "@/components/crm/ActivityForm";
import { useActivities, Activity } from "@/hooks/useActivities";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuickActivityDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickActivityDrawer({
  open,
  onOpenChange,
}: QuickActivityDrawerProps) {
  const { addActivity } = useActivities();

  const handleSubmit = async (data: Partial<Activity>) => {
    try {
      await addActivity(data as any); // Type assertion needed or fix hook types
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save activity", error);
      // In a real app, show toast error here
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Aktivität erfassen</DrawerTitle>
          <DrawerDescription>
            Protokollieren Sie einen Anruf, ein Meeting oder eine Notiz.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pt-0 h-full overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <ActivityForm
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
            />
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
