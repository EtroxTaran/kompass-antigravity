import { IsEnum, IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
    @IsNotEmpty()
    @IsString()
    recipientId: string;

    @IsEnum(NotificationType)
    notificationType: NotificationType;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsOptional()
    @IsObject()
    data?: Record<string, any>;
}
