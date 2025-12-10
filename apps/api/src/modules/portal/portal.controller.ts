import { Controller, Post, Body, Get, UseGuards, Request, Param, NotFoundException } from '@nestjs/common';
import { MagicLinkService } from './magic-link.service';
import { ProjectService } from '../project/project.service';
import { PortalAuthGuard } from './guards/portal-auth.guard';

// For MVP, we'll verify the token manually or use a standard JWT guard if the payload matches structure.
// If we issued a 'role: customer_portal' token, standard RBAC might fail if it checks for internal roles.
// Let's use a custom guard or just verify in service for now if simpler.
// Actually, standard JwtAuthGuard just validates signature and attaches user. RBAC checks roles.
// So we can use JwtAuthGuard, but need to ensure it doesn't strictly require 'user' db entity if we used 'sub' as ID.
// Standard JwtStrategy often fetches user from DB. If it fetches from 'users' collection, it will fail for Contacts.
// So we likely need a PortalJwtStrategy or just handle it here.
// For MVP: Simple solution -> RequestLink/Verify are public. Projects endpoints verify token manually or use a simple middleware.

@Controller('portal')
export class PortalController {
    constructor(
        private readonly magicLinkService: MagicLinkService,
        private readonly projectService: ProjectService
    ) { }

    @Post('auth/request-link')
    async requestLink(@Body('email') email: string) {
        await this.magicLinkService.requestLink(email);
        return { message: 'If the email exists, a link has been sent.' };
    }

    @Post('auth/verify')
    async verify(@Body('token') token: string) {
        return this.magicLinkService.verifyToken(token);
    }

    // Retrieve projects for the authenticated customer
    // We need to decode the token header to get customerId
    // For MVP, passing token in Authorization header.
    // We can write a quick decorator or just parse it.

    @UseGuards(PortalAuthGuard)
    @Get('projects')
    async getProjects(@Request() req: any) {
        const customerId = req.user.customerId;
        // Assuming ProjectService.findAll supports filtering by customerId, or we add findByCustomer
        // Looking at ProjectService usually it has findAll(options).
        // If not, we will need to update ProjectService.
        return this.projectService.findAll({ customerId });
    }

    @UseGuards(PortalAuthGuard)
    @Get('projects/:id')
    async getProject(@Request() req: any, @Param('id') id: string) {
        const customerId = req.user.customerId;
        const project = await this.projectService.findById(id);

        // Security check: ensure project belongs to customer
        if (project.customerId !== customerId) {
            throw new NotFoundException('Project not found'); // Do not reveal existence
        }

        return project;
    }
}
