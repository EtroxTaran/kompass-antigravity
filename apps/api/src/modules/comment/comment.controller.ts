import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto/add-comment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post(':entityType/:entityId')
  async addComment(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Body() dto: AddCommentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commentService.addComment(entityType, entityId, dto, user);
  }

  @Put(':entityType/:entityId/:commentId/resolve')
  async resolveComment(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Param('commentId') commentId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.commentService.resolveComment(
      entityType,
      entityId,
      commentId,
      user,
    );
  }
}
