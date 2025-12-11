import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { NotificationGateway } from './notification.gateway';
import { CreateNotificationDto } from './dto/notification.dto';
import { Notification } from './entities/notification.entity';
import type { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly notificationGateway: NotificationGateway,
    ) { }

    async create(
        dto: CreateNotificationDto,
        creatorUser?: { id: string; email: string },
    ): Promise<Notification> {
        const notification = await this.notificationRepository.create(
            {
                ...dto,
                isRead: false,
                type: 'notification',
            },
            creatorUser?.id || 'system',
            creatorUser?.email || 'system@kompass.de',
        );

        // Real-time emit
        this.notificationGateway.sendToUser(dto.recipientId, notification);

        return notification;
    }

    async findAll(userId: string, page: number = 1, limit: number = 20) {
        return this.notificationRepository.findByRecipient(userId, {
            page,
            limit,
            sort: 'createdAt',
            order: 'desc',
        });
    }

    async getUnreadCount(userId: string) {
        return this.notificationRepository.countUnread(userId);
    }

    async markAsRead(id: string, userId: string) {
        const notification = await this.notificationRepository.findById(id);
        if (!notification) {
            throw new NotFoundException(`Notification not found`);
        }

        if (notification.recipientId !== userId) {
            // Ideally generic ForbiddenException or similar, but for now we just verify ownership implicitly or trust the caller logic (Controller guards)
            // Throw 404 to assume not found for this user
            throw new NotFoundException(`Notification not found`);
        }

        if (notification.isRead) {
            return notification;
        }

        return this.notificationRepository.update(
            id,
            { isRead: true },
            userId,
            'user-action',
        );
    }

    async markAllAsRead(userId: string) {
        // This is expensive in CouchDB if we iterate one by one. 
        // Ideally we'd use a bulk update.
        // BaseRepository doesn't support bulk update easily.
        // Fetch all unread, then update them.

        // 1. Find all unread
        const result = await this.notificationRepository.findBySelector(
            { recipientId: userId, isRead: false },
            { limit: 100 }, // Cap at 100 for safety per batch
        );

        // 2. Update each
        const updates = result.data.map(async (n) => {
            // Avoid firing events or audit logs for every single read update if possible, 
            // but to stay clean we use service update or repo update.
            // Direct repo update bypasses service logic (if any).
            return this.notificationRepository.update(
                (n as any)._id!, // non-null assertion as it comes from DB
                { isRead: true },
                userId,
                'user-action',
            );
        });

        await Promise.all(updates);

        return { count: updates.length };
    }
}
