import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  [key: string]: any;
}

/**
 * Global exception filter implementing RFC 7807 Problem Details for HTTP APIs
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let problemDetails: ProblemDetails;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        // If already in RFC 7807 format, use it
        if ('type' in exceptionResponse && 'title' in exceptionResponse) {
          problemDetails = {
            ...(exceptionResponse as ProblemDetails),
            instance: request.url,
          };
        } else {
          // Convert NestJS format to RFC 7807
          const resp = exceptionResponse as any;
          problemDetails = {
            type: this.getErrorType(status),
            title: this.getErrorTitle(status),
            status,
            detail: resp.message || exception.message,
            instance: request.url,
            ...(resp.errors && { errors: resp.errors }),
          };
        }
      } else {
        problemDetails = {
          type: this.getErrorType(status),
          title: this.getErrorTitle(status),
          status,
          detail: String(exceptionResponse),
          instance: request.url,
        };
      }
    } else {
      // Unknown error
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      console.error('Unhandled exception:', exception);

      problemDetails = {
        type: 'https://api.kompass.de/errors/internal-server-error',
        title: 'Internal Server Error',
        status,
        detail: 'An unexpected error occurred. Please contact support.',
        instance: request.url,
        errorId: `err-${Date.now()}`,
      };
    }

    response
      .status(status)
      .header('Content-Type', 'application/problem+json')
      .json(problemDetails);
  }

  private getErrorType(status: number): string {
    const types: Record<number, string> = {
      400: 'https://api.kompass.de/errors/validation-error',
      401: 'https://api.kompass.de/errors/unauthorized',
      403: 'https://api.kompass.de/errors/forbidden',
      404: 'https://api.kompass.de/errors/not-found',
      409: 'https://api.kompass.de/errors/conflict',
      500: 'https://api.kompass.de/errors/internal-server-error',
    };
    return types[status] || 'https://api.kompass.de/errors/error';
  }

  private getErrorTitle(status: number): string {
    const titles: Record<number, string> = {
      400: 'Validation Failed',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Resource Not Found',
      409: 'Conflict',
      500: 'Internal Server Error',
    };
    return titles[status] || 'Error';
  }
}
