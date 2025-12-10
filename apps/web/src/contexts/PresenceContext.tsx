import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";

interface ActiveUser {
    userId: string;
    socketId: string;
    username: string;
    avatarUrl?: string; // Placeholder for future
    joinedAt: Date;
    lastHeartbeat: Date;
}

interface PresenceContextType {
    joinRoom: (room: string) => void;
    leaveRoom: (room: string) => void;
    activeUsers: ActiveUser[];
    isConnected: boolean;
    socket: Socket | null;
}

const PresenceContext = createContext<PresenceContextType>({
    joinRoom: () => { },
    leaveRoom: () => { },
    activeUsers: [],
    isConnected: false,
    socket: null,
});

export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);

    // Initialize Socket
    useEffect(() => {
        // In production, use env var.
        // Vite uses import.meta.env
        const socketUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : "http://localhost:3000";

        const newSocket = io(`${socketUrl}/presence`, {
            transports: ["websocket"],
            autoConnect: true,
        });

        newSocket.on("connect", () => {
            console.log("Presence Socket Connected:", newSocket.id);
            setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
            console.log("Presence Socket Disconnected");
            setIsConnected(false);
        });

        newSocket.on("presence:update", (users: ActiveUser[]) => {
            setActiveUsers(users);
        });

        socketRef.current = newSocket;

        return () => {
            newSocket.disconnect();
            socketRef.current = null;
        };
    }, []);

    // Heartbeat
    useEffect(() => {
        if (!isConnected) return;

        const interval = setInterval(() => {
            socketRef.current?.emit("heartbeat");
        }, 30000);

        return () => clearInterval(interval);
    }, [isConnected]);

    const joinRoom = (room: string) => {
        if (!socketRef.current || !isConnected || !user) return;

        // If we leave previous room
        if (currentRoom && currentRoom !== room) {
            leaveRoom(currentRoom);
        }

        const socketUser = {
            userId: user._id,
            username: user.displayName,
        };

        socketRef.current.emit("join", { room, user: socketUser });
        setCurrentRoom(room);
    };

    const leaveRoom = (room: string) => {
        if (!socketRef.current) return;
        socketRef.current.emit("leave", { room });
        if (currentRoom === room) {
            setCurrentRoom(null);
            setActiveUsers([]);
        }
    };

    return (
        <PresenceContext.Provider value={{ joinRoom, leaveRoom, activeUsers, isConnected, socket: socketRef.current }}>
            {children}
        </PresenceContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePresenceContext = () => useContext(PresenceContext);
