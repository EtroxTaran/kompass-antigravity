import { Injectable } from '@nestjs/common';

export interface ActiveUser {
  userId: string;
  socketId: string;
  username: string;
  avatarUrl?: string; // Placeholder for future
  joinedAt: Date;
  lastHeartbeat: Date;
}

@Injectable()
export class PresenceService {
  // Map<RoomName, Map<SocketId, ActiveUser>>
  private rooms: Map<string, Map<string, ActiveUser>> = new Map();
  // Map<SocketId, Set<RoomName>> - to easily handle disconnects
  private socketRooms: Map<string, Set<string>> = new Map();

  private readonly INACTIVITY_TIMEOUT = 120000; // 2 minutes

  constructor() {
    // Cleanup interval
    setInterval(() => this.cleanupInactiveUsers(), 30000);
  }

  addUserToRoom(
    socketId: string,
    room: string,
    user: { userId: string; username: string },
  ) {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Map());
    }

    const roomUsers = this.rooms.get(room);
    if (!roomUsers) return []; // Should not happen

    const activeUser: ActiveUser = {
      userId: user.userId,
      socketId,
      username: user.username,
      joinedAt: new Date(),
      lastHeartbeat: new Date(),
    };

    roomUsers.set(socketId, activeUser);

    // Track for socket
    let userRooms = this.socketRooms.get(socketId);
    if (!userRooms) {
      userRooms = new Set();
      this.socketRooms.set(socketId, userRooms);
    }
    userRooms.add(room);

    return this.getRoomUsers(room);
  }

  removeUserFromRoom(socketId: string, room: string) {
    const roomUsers = this.rooms.get(room);
    if (roomUsers) {
      roomUsers.delete(socketId);
      if (roomUsers.size === 0) {
        this.rooms.delete(room);
      }
    }

    const userRooms = this.socketRooms.get(socketId);
    if (userRooms) {
      userRooms.delete(room);
      if (userRooms.size === 0) {
        this.socketRooms.delete(socketId);
      }
    }

    return this.getRoomUsers(room);
  }

  handleDisconnect(socketId: string) {
    const userRooms = this.socketRooms.get(socketId);
    if (!userRooms) return;

    const affectedRooms: string[] = Array.from(userRooms);

    for (const room of affectedRooms) {
      this.removeUserFromRoom(socketId, room);
    }

    return affectedRooms;
  }

  updateHeartbeat(socketId: string) {
    const userRooms = this.socketRooms.get(socketId);
    if (!userRooms) return;

    for (const room of userRooms) {
      const roomUsers = this.rooms.get(room);
      if (roomUsers && roomUsers.has(socketId)) {
        const user = roomUsers.get(socketId);
        if (user) {
          user.lastHeartbeat = new Date();
        }
      }
    }
  }

  getRoomUsers(room: string): ActiveUser[] {
    const roomUsers = this.rooms.get(room);
    if (!roomUsers) return [];

    const uniqueUsers = new Map<string, ActiveUser>();
    for (const user of roomUsers.values()) {
      const existing = uniqueUsers.get(user.userId);
      if (!existing || existing.lastHeartbeat < user.lastHeartbeat) {
        uniqueUsers.set(user.userId, user);
      }
    }
    return Array.from(uniqueUsers.values());
  }

  private cleanupInactiveUsers() {
    const now = new Date().getTime();

    this.rooms.forEach((users, roomName) => {
      users.forEach((user, socketId) => {
        if (now - user.lastHeartbeat.getTime() > this.INACTIVITY_TIMEOUT) {
          this.removeUserFromRoom(socketId, roomName);
        }
      });
    });
  }
}
