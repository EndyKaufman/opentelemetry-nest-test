import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { asl } from './asl';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        hooks: {
          logMethod: function (
            inputArgs: any[],
            // eslint-disable-next-line @typescript-eslint/ban-types
            method: Function,
          ): unknown {
            if (inputArgs.length >= 2) {
              const record = inputArgs.shift() || {};
              const arg2 = inputArgs.shift();

              if (asl.getStore()) {
                record['userId'] = asl.getStore()['userId'];
              }

              return method.apply(this, [record, arg2, ...inputArgs]);
            }
            return method.apply(this, inputArgs);
          },
        },
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: asl,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  constructor(
    // inject the AsyncLocalStorage in the module constructor,
    private readonly als: AsyncLocalStorage<any>,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    // bind the middleware,
    consumer
      .apply((req, res, next) => {
        // populate the store with some default values
        // based on the request,
        const store = {
          userId: req.headers['x-user-id'],
        };
        // and pass the "next" function as callback
        // to the "als.run" method together with the store.
        this.als.run(store, () => next());
      })
      // and register it for all routes (in case of Fastify use '(.*)')
      .forRoutes('*');
  }
}
