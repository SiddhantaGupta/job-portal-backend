import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { ServerOptions } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { RequestGuard } from './guards';
import { ExceptionFilter } from '../exceptions';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { TimeoutInterceptor } from './timeoutInterceptor';
import { SentryInterceptor } from './sentryInterceptor';

export class RestServer {
  private module: any;
  private options: ServerOptions;

  /**
   * Create instance of fastify lambda server
   * @returns Promise<INestApplication>
   */

  static async make(module: any, options?: ServerOptions): Promise<void> {
    const app = await NestFactory.create(module);

    if (options?.addValidationContainer) {
      useContainer(app.select(module), { fallbackOnErrors: true });
    }

    app.enableCors({ origin: true });

    app.useGlobalGuards(new RequestGuard());
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new ExceptionFilter(httpAdapter));
    options.globalPrefix && app.setGlobalPrefix(options.globalPrefix);

    const server = app.getHttpServer();

    Sentry.init({
      dsn: process.env.APP_SENTRY_DSN,
      environment: process.env.APP_ENV,
      enabled: process.env.APP_ENV === 'local',
      tracesSampleRate: Number(process.env.APP_SENTRY_SAMPLE_RATE),
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({
          app: server._events.request_router,
        }),
        new Tracing.Integrations.Mysql(),
      ],
    });

    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
    app.useGlobalInterceptors(
      new TimeoutInterceptor(),
      new SentryInterceptor(),
    );

    const config = app.get(ConfigService, { strict: false });
    await app.listen(options.port || config.get<number>('app.port'));
  }
}
