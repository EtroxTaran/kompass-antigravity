import {
  IsString,
  IsEnum,
  IsOptional,
  Length,
  MaxLength,
  IsDateString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateProjectTaskDto {
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

  @IsEnum(['todo', 'in_progress', 'review', 'done', 'blocked'])
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';

  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority: 'low' | 'medium' | 'high' | 'critical';

  @IsString()
  assignedTo: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(['planning', 'execution', 'delivery', 'closure'])
  phase?: 'planning' | 'execution' | 'delivery' | 'closure';

  @IsOptional()
  @IsString()
  milestone?: string;

  // blockingReason is required if status is 'blocked'
  @ValidateIf((o) => o.status === 'blocked')
  @IsString()
  @Length(10, 500, { message: 'Blocking reason must be 10-500 characters' })
  blockingReason?: string;
}

export class UpdateProjectTaskDto {
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
  @IsEnum(['todo', 'in_progress', 'review', 'done', 'blocked'])
  status?: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';

  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority?: 'low' | 'medium' | 'high' | 'critical';

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(['planning', 'execution', 'delivery', 'closure'])
  phase?: 'planning' | 'execution' | 'delivery' | 'closure';

  @IsOptional()
  @IsString()
  milestone?: string;

  @IsOptional()
  @IsString()
  @Length(10, 500, { message: 'Blocking reason must be 10-500 characters' })
  blockingReason?: string;
}

export class UpdateProjectTaskStatusDto {
  @IsEnum(['todo', 'in_progress', 'review', 'done', 'blocked'])
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';

  @IsOptional()
  @IsString()
  @Length(10, 500, { message: 'Blocking reason must be 10-500 characters' })
  blockingReason?: string;
}
