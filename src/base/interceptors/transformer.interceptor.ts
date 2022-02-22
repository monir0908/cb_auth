import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response as EResponse } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformerInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse<EResponse>();

      return next.handle().pipe(
        map((data) => {
          let message = null;
          const statusCode = response.statusCode;
          let meta_info = null;

          if (data?.message) {
            message = data.message;
            delete data.message;
          }
          if (data?.meta_info) {
            meta_info = data.meta_info;
            delete data.meta_info;
            data = data.data;
            delete data.data;
          }
          if (data?.statusCode) {
            delete data.statusCode;
          }
          response.status(statusCode);
          const success = ![4, 5].includes(Math.trunc(statusCode / 100));
          return {
            success: success,
            message: message || response.statusMessage || 'OK',
            meta_info,
            data: data || {},
          };
        }),
      );
    } else return next.handle().pipe(map((data) => data));
  }
}
