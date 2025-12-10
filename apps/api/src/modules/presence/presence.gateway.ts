import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PresenceService } from './presence.service';
import { Logger, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // WS Auth is tricky with Headers, often done in Connection

@WebSocketGateway({
    namespace: 'presence',
    cors: {
        origin: '*', // Adjust for production
    },
})
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger = new Logger(PresenceGateway.name);

    constructor(private readonly presenceService: PresenceService) { }

    handleConnection(client: Socket) {
        // this.logger.log(`Client connected: ${client.id}`);
        // Auth token extraction usually happens here or middleware
        // For MVP, we trust the join payload or implement simple token verification if critical.
    }

    handleDisconnect(client: Socket) {
        // this.logger.log(`Client disconnected: ${client.id}`);
        const rooms = this.presenceService.handleDisconnect(client.id);
        if (rooms) {
            rooms.forEach((room) => {
                this.server.to(room).emit('presence:update', this.presenceService.getRoomUsers(room));
            });
        }
    }

    @SubscribeMessage('join')
    handleJoin(
        @MessageBody() data: { room: string; user: { userId: string; username: string } },
        @ConnectedSocket() client: Socket,
    ) {
        // this.logger.log(`User ${data.user.username} joining ${data.room}`);
        client.join(data.room);
        const users = this.presenceService.addUserToRoom(client.id, data.room, data.user);
        this.server.to(data.room).emit('presence:update', users);
    }

    @SubscribeMessage('leave')
    handleLeave(
        @MessageBody() data: { room: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.leave(data.room);
        const users = this.presenceService.removeUserFromRoom(client.id, data.room);
        this.server.to(data.room).emit('presence:update', users);
    }

    @SubscribeMessage('heartbeat')
    handleHeartbeat(@ConnectedSocket() client: Socket) {
        this.presenceService.updateHeartbeat(client.id);
    }
}
