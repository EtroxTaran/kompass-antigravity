import { useEffect } from "react";
import { usePresenceContext } from "../contexts/PresenceContext";

export function usePresence(entityType: string, entityId?: string) {
    const { joinRoom, leaveRoom, activeUsers, isConnected } = usePresenceContext();

    useEffect(() => {
        if (!entityId || !isConnected) return;

        const room = `${entityType}:${entityId}`;
        joinRoom(room);

        return () => {
            leaveRoom(room);
        };
    }, [entityType, entityId, isConnected]); // Re-join if connection drops/reconnects? 
    // Context handles connection state. If isConnected changes to true, we should probably re-join.

    return { activeUsers };
}
