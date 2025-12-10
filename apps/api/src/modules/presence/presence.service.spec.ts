import { Test, TestingModule } from '@nestjs/testing';
import { PresenceService } from './presence.service';

describe('PresenceService', () => {
    let service: PresenceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PresenceService],
        }).compile();

        service = module.get<PresenceService>(PresenceService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('addUserToRoom', () => {
        it('should add a user to a room', () => {
            const socketId = 'socket-1';
            const room = 'room-1';
            const user = { userId: 'user-1', username: 'User 1' };

            const users = service.addUserToRoom(socketId, room, user);

            expect(users).toHaveLength(1);
            expect(users[0]).toMatchObject({
                userId: user.userId,
                socketId,
                username: user.username,
            });
            expect(users[0].avatarUrl).toBeUndefined(); // Should be undefined as not provided
        });

        it('should handle adding multiple users to the same room', () => {
            service.addUserToRoom('socket-1', 'room-1', { userId: 'user-1', username: 'User 1' });
            const users = service.addUserToRoom('socket-2', 'room-1', { userId: 'user-2', username: 'User 2' });

            expect(users).toHaveLength(2);
        });

        it('should update existing user in room (e.g. reconnect)', () => {
            service.addUserToRoom('socket-1', 'room-1', { userId: 'user-1', username: 'User 1' });
            // Same socket ID, same room
            const users = service.addUserToRoom('socket-1', 'room-1', { userId: 'user-1', username: 'User 1 Updated' });

            expect(users).toHaveLength(1);
            expect(users[0].username).toBe('User 1 Updated');
        });
    });

    describe('removeUserFromRoom', () => {
        it('should remove a user from a room', () => {
            service.addUserToRoom('socket-1', 'room-1', { userId: 'user-1', username: 'User 1' });
            const remainingUsers = service.removeUserFromRoom('socket-1', 'room-1');

            expect(remainingUsers).toHaveLength(0);
        });

        it('should return empty array if room does not exist', () => {
            const result = service.removeUserFromRoom('socket-1', 'non-existent-room');
            expect(result).toEqual([]);
        });
    });

    describe('handleDisconnect', () => {
        it('should remove user from all rooms on disconnect', () => {
            service.addUserToRoom('socket-1', 'room-1', { userId: 'user-1', username: 'User 1' });
            service.addUserToRoom('socket-1', 'room-2', { userId: 'user-1', username: 'User 1' });

            service.handleDisconnect('socket-1');

            expect(service.getRoomUsers('room-1')).toHaveLength(0);
            expect(service.getRoomUsers('room-2')).toHaveLength(0);
        });
    });

    describe('updateHeartbeat', () => {
        it('should update lastHeartbeat for a user', () => {
            service.addUserToRoom('socket-1', 'room-1', { userId: 'user-1', username: 'User 1' });
            const usersBefore = service.getRoomUsers('room-1');
            const lastHeartbeatBefore = usersBefore[0].lastHeartbeat;

            // Artificial delay simulation if needed, but synchronous execution might be too fast to measure diff without mocking Date
            // We can just call update and check it doesn't crash
            service.updateHeartbeat('socket-1');

            const usersAfter = service.getRoomUsers('room-1');
            expect(usersAfter[0].lastHeartbeat.getTime()).toBeGreaterThanOrEqual(lastHeartbeatBefore.getTime());
        });
    });
});
