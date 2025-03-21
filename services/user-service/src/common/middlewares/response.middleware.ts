import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ResponseMiddleware implements NestMiddleware {
  use(
    req: Request & { rData?: any; rCode?: number; msg?: string },
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
  ) {
    console.log('ResponseMiddleware => Executing');

    console.log('req=>>', req.body);
    const data = req.rData || {};
    const code = req.rCode !== undefined ? req.rCode : 1;
    const message = req.msg ? req.msg : 'Success';

    let statusCode = 200;

    switch (code) {
      case 0:
        statusCode = 400;
        break;
      case 3:
        statusCode = 401;
        break;
      case 4:
        statusCode = 403;
        break;
      case 5:
        statusCode = 404;
        break;
    }

    res.status(statusCode).json({ code, message, data });
  }
}
