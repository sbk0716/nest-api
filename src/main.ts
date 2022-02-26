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

async function bootstrap() {
  // Create an instance of FastifyAdapter.
  const adapter = new FastifyAdapter({ logger: true });
  // Create an instance of NestApplication with the specified httpAdapter.
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule, // Entry (root) application module class
    adapter, // Adapter to proxy the request/response cycle to the underlying HTTP server
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
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
      'access-key_for_rest-api',
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
