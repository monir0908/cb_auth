import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class AppLoggerInterceptor implements NestInterceptor {
  constructor(private readonly confService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      let logString = '';
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();
      const reqId = uuid4().split('-').join('');

      request.headers['X-Request-Id'] = reqId;
      response.set('X-Request-Id', reqId);

      return next.handle().pipe(
        tap((data) => {
          const requestDetails = {
            method: request.method,
            body: request.body,
            query_params: request.query,
            endpoint: request.originalUrl,
            response: data,
            status: response.statusCode,
          };
          if (this.confService.get('env') !== 'prod') {
            logString = JSON.stringify(requestDetails);
          }
          logString =
            logString +
            '\n' +
            [request.method, request.originalUrl, request.statusCode].join(' ');
          Logger.log(logString, 'AppLoggingInterceptor');
        }),
      );
    }
  }
}
