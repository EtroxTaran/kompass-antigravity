import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';

import { DATABASE_CONNECTION } from '../../database/database.constants';
import { HealthService } from '../health.service';

import type * as Nano from 'nano';

describe('HealthService', () => {
  let service: HealthService;
  let mockNano: jest.Mocked<Nano.ServerScope>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    // Mock Nano
    const mockDbList = jest.fn();
    mockNano = {
      db: {
        list: mockDbList,
      },
    } as any;

    // Mock ConfigService
    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: string) => {
        const config: Record<string, string> = {
          KEYCLOAK_URL: 'http://keycloak:8080',
          KEYCLOAK_REALM: 'kompass',
        };
        return config[key] || defaultValue;
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockNano,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  describe('checkHealth', () => {
    it('should return ok status when all services are healthy', async () => {
      // Mock successful database check
      (mockNano.db.list as jest.Mock).mockResolvedValue(['kompass']);

      // Mock successful Keycloak check
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
      });

      const result = await service.checkHealth();

      expect(result.status).toBe('ok');
      expect(result.database).toBe('connected');
      expect(result.keycloak).toBe('reachable');
      expect(result.timestamp).toBeDefined();
    });

    it('should return degraded status when database is disconnected', async () => {
      // Mock database failure
      (mockNano.db.list as jest.Mock).mockRejectedValue(
        new Error('Connection failed')
      );

      // Mock successful Keycloak check
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
      });

      const result = await service.checkHealth();

      expect(result.status).toBe('degraded');
      expect(result.database).toBe('disconnected');
      expect(result.keycloak).toBe('reachable');
    });

    it('should return degraded status when Keycloak is unreachable', async () => {
      // Mock successful database check
      (mockNano.db.list as jest.Mock).mockResolvedValue(['kompass']);

      // Mock Keycloak failure
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const result = await service.checkHealth();

      expect(result.status).toBe('degraded');
      expect(result.database).toBe('connected');
      expect(result.keycloak).toBe('unreachable');
    });

    it('should return down status when all services are unavailable', async () => {
      // Mock database failure
      (mockNano.db.list as jest.Mock).mockRejectedValue(
        new Error('Connection failed')
      );

      // Mock Keycloak failure
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const result = await service.checkHealth();

      expect(result.status).toBe('down');
      expect(result.database).toBe('disconnected');
      expect(result.keycloak).toBe('unreachable');
    });

    it('should handle Keycloak timeout', async () => {
      // Mock successful database check
      (mockNano.db.list as jest.Mock).mockResolvedValue(['kompass']);

      // Mock Keycloak timeout (AbortController)
      const abortController = new AbortController();
      abortController.abort();
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('Aborted'));
      });

      const result = await service.checkHealth();

      expect(result.status).toBe('degraded');
      expect(result.keycloak).toBe('unreachable');
    });
  });

  describe('checkDatabase', () => {
    it('should return connected when database is accessible', async () => {
      (mockNano.db.list as jest.Mock).mockResolvedValue(['kompass']);

      const status = await (service as any).checkDatabase();

      expect(status).toBe('connected');
    });

    it('should return disconnected when database check fails', async () => {
      (mockNano.db.list as jest.Mock).mockRejectedValue(
        new Error('Connection failed')
      );

      const status = await (service as any).checkDatabase();

      expect(status).toBe('disconnected');
    });
  });

  describe('checkKeycloak', () => {
    it('should return reachable when Keycloak responds', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
      });

      const status = await (service as any).checkKeycloak();

      expect(status).toBe('reachable');
    });

    it('should return unreachable when Keycloak is down', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const status = await (service as any).checkKeycloak();

      expect(status).toBe('unreachable');
    });

    it('should return unreachable when Keycloak returns non-200 status', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 503,
      });

      const status = await (service as any).checkKeycloak();

      expect(status).toBe('unreachable');
    });
  });
});
