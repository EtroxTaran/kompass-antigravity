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
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    namespace: 'notifications',
    cors: {
        origin: '*',
    },
})
export class NotificationGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger = new Logger(NotificationGateway.name);

    handleConnection(client: Socket) {
        // this.logger.log(`Notification Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        // this.logger.log(`Notification Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('join')
    handleJoin(
        @MessageBody() data: { userId: string },
        @ConnectedSocket() client: Socket,
    ) {
        if (data.userId) {
            const room = `user_${data.userId}`;
            client.join(room);
            // this.logger.log(`User ${data.userId} joined notification room ${room}`);
        }
    }

    sendToUser(userId: string, payload: any) {
        const room = `user_${userId}`;
        this.server.to(room).emit('notification:new', payload);
    }
}
