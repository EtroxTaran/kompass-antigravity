import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { ProjectRepository } from '../project/project.repository';
import { OfferRepository } from '../offer/offer.repository';
import { InvoiceRepository } from '../invoice/invoice.repository';
import { ProjectTaskRepository } from '../project-task/project-task.repository';
import { OpportunityRepository } from '../opportunity/opportunity.repository';
import { PresenceGateway } from '../presence/presence.gateway';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import { KeycloakService } from '../../auth/keycloak.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';

// Mock dependencies
const mockRepository = {
  findById: jest.fn(),
  update: jest.fn(),
};

const mockPresenceGateway = {
  server: {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  },
};

const mockKeycloakService = {
  findUserByUsername: jest.fn(),
};

const mockNotificationService = {
  create: jest.fn(),
};

const mockUser = {
  id: 'user-123',
  username: 'testuser',
  email: 'test@example.com',
  roles: [],
  primaryRole: 'user',
} as unknown as AuthenticatedUser;

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: ProjectRepository, useValue: mockRepository },
        { provide: OfferRepository, useValue: mockRepository },
        { provide: InvoiceRepository, useValue: mockRepository },
        { provide: ProjectTaskRepository, useValue: mockRepository },
        { provide: OpportunityRepository, useValue: mockRepository },
        { provide: PresenceGateway, useValue: mockPresenceGateway },
        { provide: KeycloakService, useValue: mockKeycloakService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addComment', () => {
    it('should add a comment to an existing entity', async () => {
      const entityId = 'project-1';
      const entityType = 'project';
      const dto = { content: 'Test comment' };
      const existingEntity = { id: entityId, comments: [] };

      mockRepository.findById.mockResolvedValue(existingEntity);
      mockRepository.update.mockResolvedValue({
        ...existingEntity,
        comments: [{ content: 'Test comment' }],
      });

      const result = await service.addComment(
        entityType,
        entityId,
        dto,
        mockUser,
      );

      expect(result).toMatchObject({
        content: 'Test comment',
        author: { userId: mockUser.id, name: mockUser.username },
        resolved: false,
      });
      expect(result.id).toBeDefined();
      expect(mockRepository.findById).toHaveBeenCalledWith(entityId);
      expect(mockRepository.update).toHaveBeenCalled();
    });

    it('should parse mentions and send notification', async () => {
      const entityId = 'project-1';
      const entityType = 'project';
      const dto = { content: 'Hello @alice how are you?' };
      const existingEntity = { id: entityId, comments: [] };

      const mentionedUser = {
        _id: 'user-alice',
        keycloakId: 'kc-alice',
        username: 'alice',
        email: 'alice@example.com',
      };

      mockRepository.findById.mockResolvedValue(existingEntity);
      mockKeycloakService.findUserByUsername.mockResolvedValue(mentionedUser);

      const result = await service.addComment(
        entityType,
        entityId,
        dto,
        mockUser,
      );

      expect(mockKeycloakService.findUserByUsername).toHaveBeenCalledWith(
        'alice',
      );
      expect(mockNotificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: 'kc-alice',
          notificationType: NotificationType.MENTION,
        }),
        expect.anything(),
      );
      expect(result.mentions).toContain('user-alice');
    });

    it('should throw NotFoundException if entity does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.addComment(
          'project',
          'non-existent',
          { content: 'Test' },
          mockUser,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for unsupported entity type', async () => {
      await expect(
        service.addComment('invalid', 'id', { content: 'Test' }, mockUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('resolveComment', () => {
    it('should resolve an existing comment', async () => {
      const entityId = 'project-1';
      const commentId = 'comment-1';
      const existingComment = {
        id: commentId,
        content: 'Test',
        resolved: false,
        author: { userId: 'u1', name: 'u1' },
        createdAt: new Date().toISOString(),
      };
      const existingEntity = { id: entityId, comments: [existingComment] };

      mockRepository.findById.mockResolvedValue(existingEntity);

      const result = await service.resolveComment(
        'project',
        entityId,
        commentId,
        mockUser,
      );

      expect(result.resolved).toBe(true);
      expect(mockRepository.update).toHaveBeenCalled();
      expect(mockPresenceGateway.server.emit).toHaveBeenCalledWith(
        'comment:resolved',
        commentId,
      );
    });

    it('should throw NotFoundException if comment does not exist', async () => {
      const entityId = 'project-1';
      const existingEntity = { id: entityId, comments: [] };
      mockRepository.findById.mockResolvedValue(existingEntity);

      await expect(
        service.resolveComment(
          'project',
          entityId,
          'non-existent-comment',
          mockUser,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
