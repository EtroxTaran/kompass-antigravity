import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GoogleProvider } from './google.provider';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GoogleProvider', () => {
  let provider: GoogleProvider;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'GOOGLE_MAPS_API_KEY') return 'test-key';
              return null;
            }),
          },
        },
      ],
    }).compile();

    provider = module.get<GoogleProvider>(GoogleProvider);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should throw error if API key is missing', async () => {
    jest.spyOn(configService, 'get').mockReturnValue(null);
    await expect(
      provider.calculateRoute([
        { lat: 0, lng: 0 },
        { lat: 1, lng: 1 },
      ]),
    ).rejects.toThrow('GOOGLE_MAPS_API_KEY not configured');
  });

  it('should call Google Routes API and parse response', async () => {
    const responseData = {
      routes: [
        {
          distanceMeters: 5000,
          duration: '300s',
          optimizedIntermediateWaypointIndex: [1, 0], // Swapped
        },
      ],
    };
    mockedAxios.post.mockResolvedValue({ data: responseData });

    const stops = [
      { lat: 0, lng: 0 }, // Origin
      { lat: 10, lng: 10 }, // Intermediate 0
      { lat: 5, lng: 5 }, // Intermediate 1
    ];
    // Input indices: 0 (Org), 1, 2.
    // Result logic should return:
    // Origin, Inte(1)=Stop2, Inte(0)=Stop1, Origin/Dest

    const result = await provider.calculateRoute(stops);

    expect(mockedAxios.post).toHaveBeenCalled();
    expect(result.totalDistanceKm).toBe(5);
    expect(result.totalDurationMinutes).toBe(5); // 300s / 60

    // Check optimizedStops
    // 0: Origin (Index 0)
    // 1: Stop 2 (Index 2) -> from optimizedIntermediateWaypointIndex[0] = 1 -> original stops[1+1] = stops[2]
    // 2: Stop 1 (Index 1) -> from optimizedIntermediateWaypointIndex[1] = 0 -> original stops[0+1] = stops[1]
    // 3: Destination (Index 0)

    expect(result.optimizedStops[0].index).toBe(0);
    expect(result.optimizedStops[1].index).toBe(2);
    expect(result.optimizedStops[2].index).toBe(1);
  });
});
