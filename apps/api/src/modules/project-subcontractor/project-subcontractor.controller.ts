import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    UseGuards,
    Req,
    Query,
} from '@nestjs/common';
import { ProjectSubcontractorService } from './project-subcontractor.service';
import {
    AssignSubcontractorDtoImpl,
    UpdateAssignmentDtoImpl,
    RateSubcontractorDtoImpl
} from './dto/project-subcontractor.dto';
// Assuming JwtAuthGuard exists in shared/auth or similar
// Inspecting ... standard nestjs pattern usually.
// I'll rely on global guards or imports if I see them.
// For now, I'll assume standard Request object has user.

@Controller('api/v1')
export class ProjectSubcontractorController {
    constructor(private readonly service: ProjectSubcontractorService) { }

    @Post('projects/:projectId/subcontractors')
    async assign(
        @Param('projectId') projectId: string,
        @Body() dto: AssignSubcontractorDtoImpl,
        @Req() req: any,
    ) {
        // Ensure dto.projectId matches param or override
        dto.projectId = projectId;
        return this.service.assign(dto, req.user);
    }

    @Get('projects/:projectId/subcontractors')
    async findByProject(@Param('projectId') projectId: string) {
        return this.service.findByProject(projectId);
    }

    @Put('projects/:projectId/subcontractors/:id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateAssignmentDtoImpl,
        @Req() req: any,
    ) {
        return this.service.update(id, dto, req.user);
    }

    @Put('projects/:projectId/subcontractors/:id/rate')
    async rate(
        @Param('id') id: string,
        @Body() dto: RateSubcontractorDtoImpl,
        @Req() req: any,
    ) {
        return this.service.rate(id, dto, req.user);
    }
}
