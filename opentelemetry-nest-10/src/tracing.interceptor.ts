import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Observable } from 'rxjs';
import { als } from './als';
import { X_USER_ID } from './constants';

/**
 * Интернал глобальный интерцептор для работы опентелеметрии
 * его поведение будет модифицировано в зависимости от включенного или выключенного состояния глобального трэйсинга
 */
@Injectable()
export class TracingInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    /**
     * Переменный для хранения значений
     */
    let userId: string | undefined;

    /**
     * Переменная для хранения Request/виртуального Request
     */
    let req: any;

    if (_context.getType() === 'http') {
      req = _context.switchToHttp().getRequest();
    }

    console.log(req?.headers);

    if (req?.headers) {
      /**
       * Идентификатор запроса, если не передали то генерируем рандомный
       */
      userId = req.headers[X_USER_ID] || randomUUID();
    }
    console.log([userId]);
    return als.run({ userId }, () => {
      req['__als'] = als.getStore();
      return next.handle();
    });
  }
}
