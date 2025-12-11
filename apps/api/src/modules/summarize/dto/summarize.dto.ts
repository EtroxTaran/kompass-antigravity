import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class SummarizeRequestDto {
    @IsString()
    @IsNotEmpty()
    text: string;
}

export class ActionItemDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    dueDate?: string;
}

export class SummarizeResponseDto {
    @IsString()
    summary: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ActionItemDto)
    actionItems: ActionItemDto[];

    @IsDateString()
    @IsOptional()
    suggestedFollowUpDate?: string;
}

export class CreateActionItemsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ActionItemDto)
    items: ActionItemDto[];
}
