import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorHandlerMiddleware implements NestMiddleware {
  use(
    req: Request & { rCode?: number; msg?: string },
    res: Response,
    next: NextFunction,
  ) {
    console.log('ErrorHandlerMiddleware => Executing');

    try {
      next();
    } catch (error) {
      console.error('ErrorHandlerMiddleware => Error:', error);
      req.rCode = 0;
      req.msg = `Something went wrong: ${error.message}`;
      next();
    }
  }
}
