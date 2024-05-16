import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpRequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: Request, res: Response, next: NextFunction) {
    const start = new Date();
    const logger = this.logger;
    res.on('finish', function () {
      const end = new Date();
      const ip = req.headers['x-real-ip'] || req.ip;
      logger.log(
        `${res.statusCode} ${req.method} ${req.baseUrl}${req.url} from ${ip} - ${end.getTime() - start.getTime()}ms`,
      );
    });

    next();
  }
}
