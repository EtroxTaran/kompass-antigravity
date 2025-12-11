import { IsString, IsEnum, IsBoolean, IsOptional, IsNumber, IsArray } from 'class-validator';
import { DecisionMakingRole, FunctionalRole } from '@kompass/shared';

export class CreateContactDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    position?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    mobile?: string;

    @IsString()
    customerId: string;

    @IsEnum(DecisionMakingRole)
    decisionMakingRole: DecisionMakingRole;

    @IsString() // Enum validation for simple string union type
    authorityLevel: "low" | "medium" | "high" | "final_authority";

    @IsBoolean()
    canApproveOrders: boolean;

    @IsNumber()
    @IsOptional()
    approvalLimitEur?: number;

    @IsArray()
    @IsEnum(FunctionalRole, { each: true })
    functionalRoles: FunctionalRole[];

    @IsArray()
    @IsString({ each: true })
    departmentInfluence: string[];

    @IsArray()
    @IsString({ each: true })
    assignedLocationIds: string[];

    @IsArray()
    @IsString({ each: true })
    isPrimaryContactForLocations: string[];

    @IsString()
    @IsOptional()
    preferredContactMethod?: "email" | "phone" | "mobile";

    @IsString()
    @IsOptional()
    language?: string;
}
