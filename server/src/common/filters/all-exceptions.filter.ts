import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request, Response } from 'express';

interface ErrorResponseBody {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const httpStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage: string | string[];

    if (isHttpException) {
      const httpExceptionResponse = exception.getResponse();
      if (typeof httpExceptionResponse === 'string') {
        errorMessage = httpExceptionResponse;
      } else if (
        typeof httpExceptionResponse === 'object' &&
        httpExceptionResponse !== null &&
        'message' in httpExceptionResponse
      ) {
        errorMessage = (httpExceptionResponse as { message: string | string[] })
          .message;
      } else {
        errorMessage = exception.message;
      }
    } else {
      errorMessage =
        exception instanceof Error
          ? exception.message
          : 'Internal Server Error';
    }

    const responseBody: ErrorResponseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request) as string,
      method: httpAdapter.getRequestMethod(request) as string,
      message: errorMessage,
    };

    if (!isHttpException) {
      const error =
        exception instanceof Error ? exception : new Error(String(exception));
      const logContext: { path: string; method: string } = {
        path: responseBody.path,
        method: responseBody.method,
      };
      this.logger.error(
        `Unhandled Exception: ${error.message}`,
        error.stack,
        logContext,
      );
    }

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
