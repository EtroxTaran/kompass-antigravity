import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import { AddCommentDto } from './dto/add-comment.dto';
import { Comment } from '@kompass/shared';
import { v4 as uuidv4 } from 'uuid';
import { PresenceGateway } from '../presence/presence.gateway';
import { ProjectRepository } from '../project/project.repository';
import { OfferRepository } from '../offer/offer.repository';
import { InvoiceRepository } from '../invoice/invoice.repository';
import { ProjectTaskRepository } from '../project-task/project-task.repository';
import { OpportunityRepository } from '../opportunity/opportunity.repository';
import { KeycloakService } from '../../auth/keycloak.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly offerRepository: OfferRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly taskRepository: ProjectTaskRepository,
    private readonly opportunityRepository: OpportunityRepository,
    private readonly presenceGateway: PresenceGateway,
    private readonly keycloakService: KeycloakService,
    private readonly notificationService: NotificationService,
  ) { }

  private getRepository(
    entityType: string,
  ):
    | ProjectRepository
    | OfferRepository
    | InvoiceRepository
    | ProjectTaskRepository
    | OpportunityRepository {
    switch (entityType) {
      case 'project':
        return this.projectRepository;
      case 'offer':
        return this.offerRepository;
      case 'invoice':
        return this.invoiceRepository;
      case 'task':
        return this.taskRepository;
      case 'opportunity':
        return this.opportunityRepository;
      default:
        throw new BadRequestException(
          `Entity type ${entityType} not supported for comments`,
        );
    }
  }

  // Helper to fetch entity and verify existence via Service (safer)
  // Actually, easiest way is to modify the entity and save.
  // BaseRepository has update method.
  // Let's assume services expose 'repository' public or we use a better pattern.
  // For MVP, accessing repository is acceptable if services are in same module context or exported.
  // Wait, Repository injection in CommentService is cleaner but many repos.
  // Let's rely on services. But services don't have generic "addComment".
  // I will cheat slightly and cast service to any accessing repository for update. Not clean but fast for MVP.
  // Better: Inject Repositories directly if they are exported.
  // Accessing service.repository is fine for now as they are usually public in NestJS if strictly typed.
  // But Typescript might block private access.
  // Checking ProjectService to see if repository is public.

  async addComment(
    entityType: string,
    entityId: string,
    dto: AddCommentDto,
    user: AuthenticatedUser,
  ): Promise<Comment> {
    const repository = this.getRepository(entityType);

    // Check if entity exists
    const entity = await repository.findById(entityId);
    if (!entity) throw new NotFoundException(`${entityType} not found`);

    const newComment: Comment = {
      id: uuidv4(),
      content: dto.content,
      author: {
        userId: user.id,
        name: user.username,
      },
      createdAt: new Date().toISOString(),
      contextId: dto.contextId,
      resolved: false,
      replies: [],
      mentions: [],
    };

    // Parse mentions
    const mentionRegex = /@(\w+)/g;
    const matches = [...dto.content.matchAll(mentionRegex)];
    const mentionedUsernames = [...new Set(matches.map((match) => match[1]))];

    if (mentionedUsernames.length > 0) {
      for (const username of mentionedUsernames) {
        // Skip self-mentions
        if (username === user.username) continue;

        const mentionedUser =
          await this.keycloakService.findUserByUsername(username);

        if (mentionedUser) {
          // Add user ID to mentions array
          if (!newComment.mentions) newComment.mentions = [];
          newComment.mentions.push(mentionedUser._id);

          // Create notification
          // Assuming keycloakId is the correct recipient identifier for the notification system
          await this.notificationService.create(
            {
              recipientId: mentionedUser.keycloakId!,
              notificationType: NotificationType.MENTION,
              title: 'You were mentioned',
              message: `${user.username} mentioned you in a comment`,
              data: {
                entityType,
                entityId,
                commentId: newComment.id,
              },
            },
            { id: user.id, email: user.email },
          );
        }
      }
    }

    const comments = entity.comments || [];
    comments.push(newComment);

    // BaseRepository update signature: update(id, data, userId, userEmail?)
    // Using user.id and user.email
    await repository.update(entityId, { comments }, user.id, user.email);

    // Emit event
    if (this.presenceGateway && this.presenceGateway.server) {
      this.presenceGateway.server
        .to(`${entityType}:${entityId}`)
        .emit('comment:added', newComment);
    }

    return newComment;
  }

  async resolveComment(
    entityType: string,
    entityId: string,
    commentId: string,
    user: AuthenticatedUser,
  ) {
    const repository = this.getRepository(entityType);
    const entity = await repository.findById(entityId);
    if (!entity) throw new NotFoundException();

    const comments = entity.comments || [];
    const commentIndex = comments.findIndex((c: Comment) => c.id === commentId);

    if (commentIndex === -1) throw new NotFoundException('Comment not found');

    comments[commentIndex].resolved = true;
    comments[commentIndex].updatedAt = new Date().toISOString();

    await repository.update(entityId, { comments } as any, user.id, user.email);

    if (this.presenceGateway && this.presenceGateway.server) {
      this.presenceGateway.server
        .to(`${entityType}:${entityId}`)
        .emit('comment:resolved', commentId);
    }

    return comments[commentIndex];
  }
}
