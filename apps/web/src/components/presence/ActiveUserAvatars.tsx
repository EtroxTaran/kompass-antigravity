import React from "react";
import { usePresence } from "@/hooks/usePresence";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActiveUserAvatarsProps {
  entityType: string;
  entityId?: string;
}

export const ActiveUserAvatars: React.FC<ActiveUserAvatarsProps> = ({
  entityType,
  entityId,
}) => {
  const { activeUsers } = usePresence(entityType, entityId);

  if (activeUsers.length === 0) return null;

  return (
    <div className="flex -space-x-2 overflow-hidden items-center ml-4">
      {activeUsers.map((user) => (
        <TooltipProvider key={user.socketId}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-white cursor-help">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.username} is viewing this</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      {activeUsers.length > 0 && (
        <span className="ml-4 text-xs text-muted-foreground animate-pulse">
          ● Active
        </span>
      )}
    </div>
  );
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
