/**
 * main.ts
 * The entry file of the application which uses NestFactory.
 * NestFactory creates an application instance(NestFastifyApplication).
 */
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { commonConfig } from './configs/common';
import Fastify from 'fastify';

/**
 * Create an instance of FastifyInstance with logger-related settings.
 * {@link https://getpino.io/#/docs/api?id=loggerlevel-string-gettersetter}
 */
const fastifyInstance = Fastify({
  logger: {
    level: 'info',
  },
});

/**
 * onRoute: Triggered when a new route is registered.
 * {@link https://www.fastify.io/docs/latest/Reference/Hooks/#onroute}
 */
fastifyInstance.addHook('onRoute', (routeOptions) => {
  if (routeOptions.path === '/api/status') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    routeOptions.logLevel = 'silent';
  }
});

async function bootstrap() {
  /**
   * Execute constructor of FastifyAdapter with FastifyInstance as an argument,
   * and create an instance of FastifyAdapter with logger-related settings.
   */
  const adapter = new FastifyAdapter(fastifyInstance);
  // Create an instance of NestApplication with the specified httpAdapter.
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule, // Entry (root) application module class.
    adapter, // Adapter to proxy the request/response cycle to the underlying HTTP server.
  );
  // Register a prefix for every HTTP route path.
  app.setGlobalPrefix('api');

  // Define swagger document
  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('Documentation for Nest API')
    .setVersion('1.0.0')
    .addApiKey(
      {
        type: 'apiKey', // 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'
        name: 'Authorization',
        in: 'header',
      },
      'access-key_for_rest-api', // api key name
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  /**
   * By default, Fastify listens only on the localhost 127.0.0.1 interface.
   * If you want to accept connections on other hosts,
   * you should specify '0.0.0.0' in the listen() call.
   * {@link https://www.fastify.io/docs/latest/Reference/Server/#listen}
   */
  console.info('commonConfig.API_PORT=', commonConfig.API_PORT);
  await app.listen(Number(commonConfig.API_PORT), '0.0.0.0');
}

// Execute `bootstrap()` to start NestFastifyApplication.
bootstrap();
