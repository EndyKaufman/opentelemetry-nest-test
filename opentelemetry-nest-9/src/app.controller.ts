import { Controller, Get } from '@nestjs/common';
import { ApiHeaders } from '@nestjs/swagger';
import { AsyncLocalStorage } from 'async_hooks';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @InjectPinoLogger(AppController.name)
    private readonly logger: PinoLogger,
    private readonly als: AsyncLocalStorage<any>,
    private readonly appService: AppService,
  ) {}

  @ApiHeaders([{ name: 'x-user-id' }, { name: 'X-B3-TraceId' }])
  @Get()
  getHello(): string {
    this.logger.info('getHello' + this.als.getStore()['userId']);
    return this.appService.getHello();
  }

  @ApiHeaders([{ name: 'x-user-id' }, { name: 'X-B3-TraceId' }])
  @Get('error')
  getError(): string {
    this.logger.info('getError' + this.als.getStore()['userId']);
    throw new Error();
  }
}
