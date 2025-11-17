import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { register } from '../auth-api';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
  isAxiosError: ReturnType<typeof vi.fn>;
};

describe('auth-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    const mockRegisterResponse = {
      _id: 'user-123',
      type: 'user',
      email: 'test@example.com',
      displayName: 'Test User',
      roles: ['ADM'],
      primaryRole: 'ADM',
      active: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      modifiedAt: '2024-01-01T00:00:00.000Z',
    };

    it('should register user successfully', async () => {
      mockedAxios.post.mockResolvedValue({
        data: mockRegisterResponse,
      });

      const result = await register(
        'test@example.com',
        'Test User',
        'SecurePassword123!'
      );

      expect(result).toEqual(mockRegisterResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/auth/register'),
        {
          email: 'test@example.com',
          displayName: 'Test User',
          password: 'SecurePassword123!',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should throw error for duplicate email (409)', async () => {
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 409,
          data: {
            message: 'User already exists',
          },
        },
      });
      mockedAxios.isAxiosError = vi.fn().mockReturnValue(true);

      await expect(
        register('existing@example.com', 'Test User', 'SecurePassword123!')
      ).rejects.toThrow(
        'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits'
      );
    });

    it('should throw error for validation failure (400)', async () => {
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            detail: 'Email is required',
          },
        },
      });
      mockedAxios.isAxiosError = vi.fn().mockReturnValue(true);

      await expect(
        register('', 'Test User', 'SecurePassword123!')
      ).rejects.toThrow('Validation failed');
    });

    it('should throw error for server error (500)', async () => {
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 500,
          data: {
            message: 'Internal server error',
          },
        },
      });
      mockedAxios.isAxiosError = vi.fn().mockReturnValue(true);

      await expect(
        register('test@example.com', 'Test User', 'SecurePassword123!')
      ).rejects.toThrow('Internal server error');
    });

    it('should throw generic error for network errors', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'));
      mockedAxios.isAxiosError = vi.fn().mockReturnValue(false);

      await expect(
        register('test@example.com', 'Test User', 'SecurePassword123!')
      ).rejects.toThrow(
        'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
      );
    });
  });
});
