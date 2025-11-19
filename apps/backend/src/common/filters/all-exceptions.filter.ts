import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';

import type { Request, Response } from 'express';

/**
 * Problem Details (RFC 7807) interface
 */
interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: ValidationError[];
  timestamp?: string;
}

/**
 * Validation error structure
 */
interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Global Exception Filter
 *
 * Catches all exceptions and returns RFC 7807 Problem Details format.
 * Sanitizes error messages in production to prevent information leakage.
 *
 * @see https://tools.ietf.org/html/rfc7807
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine HTTP status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract error response
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    // Build Problem Details response
    const problemDetails = this.buildProblemDetails(
      exception,
      status,
      request,
      exceptionResponse
    );

    // Log full error server-side (never log sensitive data)
    this.logError(exception, request, status);

    // Return sanitized error to client
    response.status(status).json(problemDetails);
  }

  /**
   * Build RFC 7807 Problem Details response
   */
  private buildProblemDetails(
    exception: unknown,
    status: number,
    request: Request,
    _exceptionResponse: unknown
  ): ProblemDetails {
    const isProduction = process.env.NODE_ENV === 'production';
    const instance = request.url;

    // Handle HttpException (NestJS standard exceptions)
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      // Handle validation errors (BadRequestException with validation details)
      if (
        status === HttpStatus.BAD_REQUEST &&
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const message = response.message as string | string[];
        const errors = Array.isArray(message)
          ? this.extractValidationErrors(message)
          : undefined;

        return {
          type: 'https://api.kompass.de/errors/validation-error',
          title: 'Validation Failed',
          status,
          detail: isProduction
            ? 'Request validation failed'
            : Array.isArray(message)
              ? message.join(', ')
              : String(message),
          instance,
          errors,
          timestamp: new Date().toISOString(),
        };
      }

      // Handle standard HttpException
      const message =
        typeof response === 'string'
          ? response
          : typeof response === 'object' &&
              response !== null &&
              'message' in response
            ? String(response.message)
            : 'An error occurred';

      return {
        type: this.getErrorType(status),
        title: this.getErrorTitle(status),
        status,
        detail: isProduction ? this.getGenericMessage(status) : message,
        instance,
        timestamp: new Date().toISOString(),
      };
    }

    // Handle unknown errors
    const errorMessage =
      exception instanceof Error ? exception.message : 'Internal server error';

    return {
      type: 'https://api.kompass.de/errors/server-error',
      title: 'Internal Server Error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      detail: isProduction ? 'An internal server error occurred' : errorMessage,
      instance,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Extract validation errors from message array
   */
  private extractValidationErrors(messages: string[]): ValidationError[] {
    return messages.map((message) => {
      // Try to extract field name from message (e.g., "companyName must be...")
      const fieldMatch = message.match(/^(\w+)\s/);
      const field = fieldMatch ? fieldMatch[1] : 'unknown';

      return {
        field: field as string,
        message,
      };
    });
  }

  /**
   * Get error type URI based on status code
   */
  private getErrorType(status: number): string {
    const errorTypes: Record<number, string> = {
      400: 'https://api.kompass.de/errors/bad-request',
      401: 'https://api.kompass.de/errors/unauthorized',
      403: 'https://api.kompass.de/errors/forbidden',
      404: 'https://api.kompass.de/errors/not-found',
      409: 'https://api.kompass.de/errors/conflict',
      422: 'https://api.kompass.de/errors/unprocessable-entity',
      429: 'https://api.kompass.de/errors/too-many-requests',
      500: 'https://api.kompass.de/errors/server-error',
      503: 'https://api.kompass.de/errors/service-unavailable',
    };

    return errorTypes[status] || 'https://api.kompass.de/errors/server-error';
  }

  /**
   * Get error title based on status code
   */
  private getErrorTitle(status: number): string {
    const titles: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      503: 'Service Unavailable',
    };

    return titles[status] || 'An Error Occurred';
  }

  /**
   * Get generic error message for production
   */
  private getGenericMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'The request is invalid',
      401: 'Authentication required',
      403: 'You do not have permission to perform this action',
      404: 'The requested resource was not found',
      409: 'A conflict occurred',
      422: 'The request could not be processed',
      429: 'Too many requests. Please try again later',
      500: 'An internal server error occurred',
      503: 'The service is temporarily unavailable',
    };

    return messages[status] || 'An error occurred';
  }

  /**
   * Log error with full context (server-side only)
   */
  private logError(exception: unknown, request: Request, status: number): void {
    const errorMessage =
      exception instanceof Error ? exception.message : 'Unknown error';
    const errorStack = exception instanceof Error ? exception.stack : undefined;

    const logContext = {
      message: errorMessage,
      stack: errorStack,
      url: request.url,
      method: request.method,
      userId:
        (request.user as { _id?: string; id?: string })?._id ||
        (request.user as { _id?: string; id?: string })?.id,
      statusCode: status,
      timestamp: new Date().toISOString(),
    };

    if (status >= 500) {
      // Server errors - log as error
      this.logger.error('Server error occurred', logContext);
    } else if (status >= 400) {
      // Client errors - log as warn
      this.logger.warn('Client error occurred', logContext);
    } else {
      // Other errors - log as debug
      this.logger.debug('Exception caught', logContext);
    }
  }
}
