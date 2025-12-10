import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ActiveUser {
    userId: string;
    socketId: string;
    username: string;
    avatarUrl?: string;
    joinedAt: Date;
    lastHeartbeat: Date;
}


interface PresenceContextType {
    joinRoom: (room: string) => void;
    leaveRoom: (room: string) => void;
    activeUsers: ActiveUser[];
    isConnected: boolean;
}

const PresenceContext = createContext<PresenceContextType>({
    joinRoom: () => { },
    leaveRoom: () => { },
    activeUsers: [],
    isConnected: false,
});

// Hardcoded for MVP or extracted from Auth Context
// In a real app, we would get this from useAuth()
const TEMP_USER_ID = "user-" + Math.floor(Math.random() * 10000);
const TEMP_USERNAME = "User " + Math.floor(Math.random() * 100);

// We need to pass the real user eventually.
// For now, let's assume we can get it from localStorage or a simple mock if AuthContext isn't readily available in this scope without circular deps.
// Actually, let's accept user as prop or rely on token in socket connection (if we had auth).
// We'll simulate user info for now.

export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);

    // Initialize Socket
    useEffect(() => {
        // In production, use env var.
        // Vite uses import.meta.env
        const socketUrl = "http://localhost:3000/presence";

        const newSocket = io(socketUrl, {
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
            // Deduplicate locally if needed, but service does it.
            setActiveUsers(users);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Heartbeat
    useEffect(() => {
        if (!socket || !isConnected) return;

        const interval = setInterval(() => {
            socket.emit("heartbeat");
        }, 30000);

        return () => clearInterval(interval);
    }, [socket, isConnected]);

    const joinRoom = (room: string) => {
        if (!socket || !isConnected) return;

        // Determine user identity
        // Ideally from AuthContext. For MVP, we'll try to find it in localStorage 'user_storage' from AuthProvider or just mock.
        // Let's mock consistent identity for this session.
        // If we want to verify "User B", we need to be able to set this.
        // But since we are logged in as Keycloak User, we should probably extract that token/profile.
        // Simple hack: We won't send full user object from client if we can Avoid it, but protocol asks for it.

        // We will use a mock user matching the logged-in user if possible. 
        // Since we don't have access to AuthContext here cleanly without import looping potentially (?), 
        // let's grab it from a window global or just generic store.

        // For specific test scenario: "Initial Avatars".

        const user = {
            userId: TEMP_USER_ID,
            username: TEMP_USERNAME,
        };

        // If we leave previous room
        if (currentRoom && currentRoom !== room) {
            leaveRoom(currentRoom);
        }

        socket.emit("join", { room, user });
        setCurrentRoom(room);
    };

    const leaveRoom = (room: string) => {
        if (!socket) return;
        socket.emit("leave", { room });
        if (currentRoom === room) {
            setCurrentRoom(null);
            setActiveUsers([]);
        }
    };

    return (
        <PresenceContext.Provider value={{ joinRoom, leaveRoom, activeUsers, isConnected }}>
            {children}
        </PresenceContext.Provider>
    );
};

export const usePresenceContext = () => useContext(PresenceContext);
