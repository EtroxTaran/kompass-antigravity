import { Test, TestingModule } from '@nestjs/testing';
import { TourService } from './tour.service';
import { TourRepository } from './tour.repository';
import { BadRequestException } from '@nestjs/common';

describe('TourService', () => {
  let service: TourService;
  let repository: Partial<TourRepository>;

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TourService,
        { provide: TourRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<TourService>(TourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('optimizeRoute', () => {
    it('should throw error for empty stops', () => {
      expect(() => service.optimizeRoute({ stops: [] })).toThrow(
        BadRequestException,
      );
    });

    it('should return single stop with zero distance', async () => {
      const singleStop = {
        id: '1',
        name: 'Test Location',
        address: 'Test Address',
        lat: 48.1372,
        lng: 11.5755,
      };

      const result = await service.optimizeRoute({ stops: [singleStop] });

      expect(result.stops).toHaveLength(1);
      expect(result.totalDistanceKm).toBe(0);
      expect(result.estimatedDurationMinutes).toBe(15); // Just stop time
    });

    it('should optimize route with multiple stops using nearest-neighbor', async () => {
      // Munich area stops - arranged suboptimally
      const stops = [
        {
          id: '1',
          name: 'Location A',
          address: 'Address A',
          lat: 48.1351,
          lng: 11.582,
        }, // Center
        {
          id: '3',
          name: 'Location C',
          address: 'Address C',
          lat: 48.1551,
          lng: 11.582,
        }, // North
        {
          id: '2',
          name: 'Location B',
          address: 'Address B',
          lat: 48.1401,
          lng: 11.582,
        }, // Between A and C
      ];

      const result = await service.optimizeRoute({ stops });

      // Should have all 3 stops
      expect(result.stops).toHaveLength(3);
      expect(result.totalDistanceKm).toBeGreaterThan(0);
      expect(result.estimatedDurationMinutes).toBeGreaterThan(0);

      // First stop should be Location A (starting point)
      expect(result.stops[0].id).toBe('1');
      // Location B is closer to A than C, so should be second
      expect(result.stops[1].id).toBe('2');
      // Location C should be last
      expect(result.stops[2].id).toBe('3');
    });

    it('should calculate distance correctly using Haversine formula', async () => {
      // Two points roughly 2km apart in Munich
      const stops = [
        {
          id: '1',
          name: 'Marienplatz',
          address: 'Marienplatz, München',
          lat: 48.1372,
          lng: 11.5755,
        },
        {
          id: '2',
          name: 'Hauptbahnhof',
          address: 'Hauptbahnhof, München',
          lat: 48.1402,
          lng: 11.5595,
        },
      ];

      const result = await service.optimizeRoute({ stops });

      // Distance should be approximately 1.2-1.5 km
      expect(result.totalDistanceKm).toBeGreaterThan(1);
      expect(result.totalDistanceKm).toBeLessThan(2);
    });

    it('should use custom start location when provided', async () => {
      const stops = [
        { id: '1', name: 'Far', address: 'Far', lat: 48.2, lng: 11.5 },
        { id: '2', name: 'Near', address: 'Near', lat: 48.101, lng: 11.501 },
      ];

      const startLocation = { lat: 48.1, lng: 11.5 }; // Closer to 'Near'

      const result = await service.optimizeRoute({ stops, startLocation });

      // 'Near' should be first since it's closer to startLocation
      expect(result.stops[0].id).toBe('2');
      expect(result.stops[1].id).toBe('1');
    });

    it('should include stop time in duration calculation', async () => {
      const stops = [
        { id: '1', name: 'A', address: 'A', lat: 48.1, lng: 11.5 },
        { id: '2', name: 'B', address: 'B', lat: 48.1, lng: 11.5 }, // Same location
      ];

      const result = await service.optimizeRoute({ stops });

      // Should include 15 min per stop (2 stops = 30 min) even if no travel time
      expect(result.estimatedDurationMinutes).toBeGreaterThanOrEqual(30);
    });
  });
});
