import { useEffect, useRef } from 'react';
import { usePresenceContext } from '@/contexts/PresenceContext';

export const usePresence = (entityType: string, entityId?: string) => {
    const { joinRoom, leaveRoom, activeUsers, isConnected } = usePresenceContext();
    const roomRef = useRef<string | null>(null);

    useEffect(() => {
        if (!entityId || !isConnected) return;

        const room = `${entityType}:${entityId}`;
        roomRef.current = room;
        joinRoom(room);

        return () => {
            if (roomRef.current) {
                leaveRoom(roomRef.current);
            }
        };
    }, [entityId, entityType, isConnected, joinRoom, leaveRoom]);

    return {
        activeUsers,
        isConnected
    };
};
