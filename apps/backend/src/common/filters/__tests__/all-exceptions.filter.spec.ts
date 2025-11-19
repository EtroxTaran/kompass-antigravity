import { HttpException, HttpStatus, type ArgumentsHost } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';

import { AllExceptionsFilter } from '../all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);

    // Mock response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock request
    mockRequest = {
      url: '/api/v1/customers',
      method: 'GET',
      user: { id: 'user-123' },
    };

    // Mock ArgumentsHost
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  describe('HttpException handling', () => {
    it('should return RFC 7807 format for BadRequestException', () => {
      const exception = new HttpException(
        'Validation failed',
        HttpStatus.BAD_REQUEST
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('bad-request'),
          title: 'Bad Request',
          status: 400,
          instance: '/api/v1/customers',
          timestamp: expect.any(String),
        })
      );
    });

    it('should return RFC 7807 format for UnauthorizedException', () => {
      const exception = new HttpException(
        'Unauthorized',
        HttpStatus.UNAUTHORIZED
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('unauthorized'),
          title: 'Unauthorized',
          status: 401,
          instance: '/api/v1/customers',
        })
      );
    });

    it('should return RFC 7807 format for ForbiddenException', () => {
      const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('forbidden'),
          title: 'Forbidden',
          status: 403,
          instance: '/api/v1/customers',
        })
      );
    });

    it('should return RFC 7807 format for NotFoundException', () => {
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('not-found'),
          title: 'Not Found',
          status: 404,
          instance: '/api/v1/customers',
        })
      );
    });

    it('should handle validation errors with message array', () => {
      const exception = new HttpException(
        {
          message: ['Company name is required', 'Email must be valid'],
          error: 'Bad Request',
          statusCode: 400,
        },
        HttpStatus.BAD_REQUEST
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('validation-error'),
          title: 'Validation Failed',
          status: 400,
          errors: expect.arrayContaining([
            expect.objectContaining({
              field: expect.any(String),
              message: expect.any(String),
            }),
          ]),
        })
      );
    });
  });

  describe('Unknown error handling', () => {
    it('should return RFC 7807 format for unknown errors', () => {
      const exception = new Error('Unexpected error');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining('server-error'),
          title: 'Internal Server Error',
          status: 500,
          instance: '/api/v1/customers',
          timestamp: expect.any(String),
        })
      );
    });

    it('should sanitize error messages in production', () => {
      process.env.NODE_ENV = 'production';
      const exception = new Error('Sensitive error details');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: 'An internal server error occurred',
        })
      );

      // Reset
      delete process.env.NODE_ENV;
    });

    it('should show detailed error messages in development', () => {
      process.env.NODE_ENV = 'development';
      const exception = new Error('Detailed error message');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: 'Detailed error message',
        })
      );

      // Reset
      delete process.env.NODE_ENV;
    });
  });

  describe('Error logging', () => {
    it('should log server errors as error level', () => {
      const exception = new Error('Server error');
      const logSpy = jest.spyOn(filter['logger'], 'error');

      filter.catch(exception, mockArgumentsHost);

      expect(logSpy).toHaveBeenCalledWith(
        'Server error occurred',
        expect.objectContaining({
          message: 'Server error',
          url: '/api/v1/customers',
          method: 'GET',
          statusCode: 500,
        })
      );
    });

    it('should log client errors as warn level', () => {
      const exception = new HttpException(
        'Bad request',
        HttpStatus.BAD_REQUEST
      );
      const logSpy = jest.spyOn(filter['logger'], 'warn');

      filter.catch(exception, mockArgumentsHost);

      expect(logSpy).toHaveBeenCalledWith(
        'Client error occurred',
        expect.objectContaining({
          statusCode: 400,
        })
      );
    });
  });
});
