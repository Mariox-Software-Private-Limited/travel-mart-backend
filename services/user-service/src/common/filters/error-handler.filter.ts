import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ErrorHandlerFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorHandlerFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'Something went wrong!';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      // ✅ Ensure message is a string
      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (typeof errorResponse === 'object' && errorResponse !== null) {
        message =
          (errorResponse as any).message || JSON.stringify(errorResponse);
      }
    } else {
      this.logger.error(`Unhandled Exception: ${exception}`);
      exception = new InternalServerErrorException();
    }

    response.status(status).json({
      rCode: 0,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
