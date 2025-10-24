import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const req = request as unknown as {
          method?: string;
          url?: string;
        };
        const elapsed = Date.now() - start;
        // Lightweight request log to aid debugging across services
        console.log(`${req.method ?? 'UNKNOWN'} ${req.url ?? '-'} - ${elapsed}ms`);
      })
    );
  }
}
