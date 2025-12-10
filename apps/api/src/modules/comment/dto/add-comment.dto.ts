import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AddCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  contextId?: string;
}
