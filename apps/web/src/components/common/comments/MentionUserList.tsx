import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface User {
    _id: string;
    displayName: string;
    username?: string;
    email: string;
}

interface MentionUserListProps {
    users: User[];
    onSelect: (user: User) => void;
    selectedIndex: number;
}

export const MentionUserList: React.FC<MentionUserListProps> = ({
    users,
    onSelect,
    selectedIndex,
}) => {
    if (users.length === 0) return null;

    return (
        <div className="absolute bottom-full left-0 w-64 mb-2 bg-popover text-popover-foreground border rounded-md shadow-md overflow-hidden z-50">
            <div className="p-1 max-h-48 overflow-y-auto">
                {users.map((user, index) => (
                    <button
                        key={user._id}
                        className={cn(
                            "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm text-left outline-none",
                            index === selectedIndex
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent/50",
                        )}
                        onClick={() => onSelect(user)}
                        onMouseDown={(e) => e.preventDefault()} // Prevent losing focus from input
                    >
                        <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px]">
                                {user.displayName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate font-medium">{user.displayName}</span>
                            <span className="text-xs text-muted-foreground truncate">
                                @{user.username || user.email.split("@")[0]}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
