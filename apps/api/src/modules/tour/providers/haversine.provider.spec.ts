import { Test, TestingModule } from '@nestjs/testing';
import { HaversineProvider } from './haversine.provider';

describe('HaversineProvider', () => {
  let provider: HaversineProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HaversineProvider],
    }).compile();

    provider = module.get<HaversineProvider>(HaversineProvider);
  });

  describe('calculateRoute', () => {
    it('should return empty/single result for <= 1 stop', async () => {
      const singleStop = [{ lat: 10, lng: 10 }];
      const result = await provider.calculateRoute(singleStop);
      expect(result.totalDistanceKm).toBe(0);
      expect(result.optimizedStops).toHaveLength(1);
    });

    it('should calculate distance correctly', async () => {
      // Munich center points
      const stops = [
        { lat: 48.1372, lng: 11.5755 }, // Marienplatz
        { lat: 48.1402, lng: 11.5595 }, // Hauptbahnhof
      ];
      const result = await provider.calculateRoute(stops);
      expect(result.totalDistanceKm).toBeGreaterThan(1);
      expect(result.totalDistanceKm).toBeLessThan(2);
    });

    it('should optimize route (verify nearest neighbor)', async () => {
      const stops = [
        { lat: 48.1351, lng: 11.582 }, // A
        { lat: 48.1551, lng: 11.582 }, // C (Far)
        { lat: 48.1401, lng: 11.582 }, // B (Near)
      ];
      // Provided order: A -> C -> B
      // Optimal: A -> B -> C

      const result = await provider.calculateRoute(stops);
      // optimizedStops has { lat, lng, index }
      // The original indices were 0, 1, 2.
      // We expect: 0 (A), 2 (B), 1 (C)

      expect(result.optimizedStops[0].index).toBe(0);
      expect(result.optimizedStops[1].index).toBe(2);
      expect(result.optimizedStops[2].index).toBe(1);
    });
  });
});
