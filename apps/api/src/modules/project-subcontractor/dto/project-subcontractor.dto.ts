import { IsString, IsEnum, IsNumber, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceCategory, SubcontractorStatus, AssignSubcontractorDto, UpdateAssignmentDto, RateSubcontractorDto } from '@kompass/shared';

// Implementing the shared interfaces with validation decorators

export class AssignSubcontractorDtoImpl implements AssignSubcontractorDto {
    @IsString()
    @IsUUID()
    supplierId: string;

    @IsString()
    @IsUUID()
    projectId: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    contractId?: string;

    @IsString()
    workPackage: string;

    @IsEnum(ServiceCategory)
    serviceCategory: ServiceCategory;

    @IsString()
    description: string;

    @IsDateString()
    plannedStartDate: string;

    @IsDateString()
    plannedEndDate: string;

    @IsNumber()
    estimatedCost: number;
}

export class UpdateAssignmentDtoImpl implements UpdateAssignmentDto {
    @IsOptional()
    @IsString()
    workPackage?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    plannedStartDate?: string;

    @IsOptional()
    @IsDateString()
    plannedEndDate?: string;

    @IsOptional()
    @IsDateString()
    actualStartDate?: string;

    @IsOptional()
    @IsDateString()
    actualEndDate?: string;

    @IsOptional()
    @IsNumber()
    estimatedCost?: number;

    @IsOptional()
    @IsEnum(SubcontractorStatus)
    status?: SubcontractorStatus;

    @IsOptional()
    @IsNumber()
    completionPercentage?: number;

    @IsOptional()
    @IsString()
    notes?: string;
}

export class RateSubcontractorDtoImpl implements RateSubcontractorDto {
    @IsNumber()
    qualityRating: number;

    @IsNumber()
    timelinessRating: number;

    @IsNumber()
    communicationRating: number;
}
