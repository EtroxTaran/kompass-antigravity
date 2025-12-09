import {
  IsString,
  IsEnum,
  IsOptional,
  Length,
  MaxLength,
  IsDateString,
  Matches,
} from 'class-validator';

export class CreateUserTaskDto {
  @IsString()
  @Length(5, 200)
  @Matches(/^[a-zA-ZäöüÄÖÜß0-9\s.\-&(),!?]+$/, {
    message: 'Title can only contain letters, numbers, and basic punctuation',
  })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsEnum(['open', 'in_progress', 'completed', 'cancelled'])
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';

  @IsEnum(['low', 'medium', 'high', 'urgent'])
  priority: 'low' | 'medium' | 'high' | 'urgent';

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  relatedCustomerId?: string;

  @IsOptional()
  @IsString()
  relatedOpportunityId?: string;

  @IsOptional()
  @IsString()
  relatedProjectId?: string;
}

export class UpdateUserTaskDto {
  @IsOptional()
  @IsString()
  @Length(5, 200)
  @Matches(/^[a-zA-ZäöüÄÖÜß0-9\s.\-&(),!?]+$/, {
    message: 'Title can only contain letters, numbers, and basic punctuation',
  })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(['open', 'in_progress', 'completed', 'cancelled'])
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';

  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'urgent'])
  priority?: 'low' | 'medium' | 'high' | 'urgent';

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  relatedCustomerId?: string;

  @IsOptional()
  @IsString()
  relatedOpportunityId?: string;

  @IsOptional()
  @IsString()
  relatedProjectId?: string;
}

export class UpdateTaskStatusDto {
  @IsEnum(['open', 'in_progress', 'completed', 'cancelled'])
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
}
