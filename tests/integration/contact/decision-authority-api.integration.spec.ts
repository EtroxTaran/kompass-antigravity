/**
 * Integration Test: Contact Decision Authority API
 * 
 * Tests decision authority endpoints with real database
 * Validates RBAC restrictions (PLAN/GF only)
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../apps/backend/src/app.module';
import { DecisionMakingRole, FunctionalRole } from '@kompass/shared/types/enums';

describe('Contact Decision Authority API (Integration)', () => {
  let app: INestApplication;
  let admToken: string;
  let planToken: string;
  let gfToken: string;
  let contactId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get auth tokens
    const admResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'adm@example.com', password: 'test123' });
    admToken = admResponse.body.token;

    const planResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'plan@example.com', password: 'test123' });
    planToken = planResponse.body.token;

    const gfResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'gf@example.com', password: 'test123' });
    gfToken = gfResponse.body.token;

    // Create test contact
    const contactResponse = await request(app.getHttpServer())
      .post('/api/v1/contacts')
      .set('Authorization', `Bearer ${admToken}`)
      .send({
        firstName: 'Thomas',
        lastName: 'Schmidt',
        customerId: 'customer-123',
        email: 'schmidt@example.com',
      });
    contactId = contactResponse.body._id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/contacts/:contactId/decision-authority', () => {
    it('should return decision authority for all roles', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/contacts/${contactId}/decision-authority`)
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        contactId: contactId,
        contactName: expect.any(String),
        decisionMakingRole: expect.any(String),
        authorityLevel: expect.any(String),
        canApproveOrders: expect.any(Boolean),
      });
    });
  });

  describe('PUT /api/v1/contacts/:contactId/decision-authority', () => {
    it('should prevent ADM from updating decision authority', async () => {
      const updateDto = {
        decisionMakingRole: DecisionMakingRole.KEY_INFLUENCER,
        authorityLevel: 'high' as const,
        canApproveOrders: true,
        approvalLimitEur: 50000,
        functionalRoles: [FunctionalRole.PURCHASING_MANAGER],
        departmentInfluence: ['purchasing'],
      };

      const response = await request(app.getHttpServer())
        .put(`/api/v1/contacts/${contactId}/decision-authority`)
        .set('Authorization', `Bearer ${admToken}`)
        .send(updateDto)
        .expect(HttpStatus.FORBIDDEN);

      expect(response.body.detail).toContain('Nur ADM+ Nutzer');
    });

    it('should allow PLAN to update decision authority', async () => {
      const updateDto = {
        decisionMakingRole: DecisionMakingRole.KEY_INFLUENCER,
        authorityLevel: 'high' as const,
        canApproveOrders: true,
        approvalLimitEur: 50000,
        functionalRoles: [FunctionalRole.PURCHASING_MANAGER],
        departmentInfluence: ['purchasing', 'operations'],
      };

      const response = await request(app.getHttpServer())
        .put(`/api/v1/contacts/${contactId}/decision-authority`)
        .set('Authorization', `Bearer ${planToken}`)
        .send(updateDto)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        contactId: contactId,
        decisionMakingRole: DecisionMakingRole.KEY_INFLUENCER,
        authorityLevel: 'high',
        canApproveOrders: true,
        approvalLimitEur: 50000,
      });
    });

    it('should allow GF to update decision authority', async () => {
      const updateDto = {
        decisionMakingRole: DecisionMakingRole.DECISION_MAKER,
        authorityLevel: 'final_authority' as const,
        canApproveOrders: true,
        approvalLimitEur: 1000000,
        functionalRoles: [FunctionalRole.OWNER_CEO],
        departmentInfluence: ['all'],
      };

      await request(app.getHttpServer())
        .put(`/api/v1/contacts/${contactId}/decision-authority`)
        .set('Authorization', `Bearer ${gfToken}`)
        .send(updateDto)
        .expect(HttpStatus.OK);
    });

    it('should validate approval limit when canApproveOrders=true', async () => {
      const invalidDto = {
        decisionMakingRole: DecisionMakingRole.KEY_INFLUENCER,
        authorityLevel: 'high' as const,
        canApproveOrders: true,
        // Missing approvalLimitEur!
        functionalRoles: [],
        departmentInfluence: [],
      };

      const response = await request(app.getHttpServer())
        .put(`/api/v1/contacts/${contactId}/decision-authority`)
        .set('Authorization', `Bearer ${planToken}`)
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toContain('Genehmigungslimit');
    });
  });
});

