import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filter/all-exception.filter';
import { AxiosErrorFilter } from './common/filter/axios-error.filter';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENV } from './config/environment';

import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

process.env.NODE_ENV = 'development';
const GLOBAL_PREFIX = `${ENV.URL.URL_GLOBAL_PREFIX}${ENV.URL.URL_API_PREFIX}`;
const SWAGGER_URL = ENV.URL.URL_SWAGGER;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);

  // CORS
  app.enableCors();

  // prefix
  app.setGlobalPrefix(GLOBAL_PREFIX);

  //pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true, strictGroups: true, always: true }));

  // filters
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalFilters(new AxiosErrorFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  swaggerSetup(app);

  await app.listen(3000);
}

function swaggerSetup(app: INestApplication) {
  if (process.env.SWAGGER_USER !== undefined && process.env.SWAGGER_PASSWORD !== undefined) {
    app.use(
      [`${GLOBAL_PREFIX}${SWAGGER_URL}`, `${GLOBAL_PREFIX}${SWAGGER_URL}-json`],
      basicAuth({
        challenge: true,
        users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
      }),
    );
  }

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(ENV.APP_NAME)
    .setVersion('0.1')
    .setExternalDoc('Swagger Json', `${GLOBAL_PREFIX}${SWAGGER_URL}-json`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${GLOBAL_PREFIX}${SWAGGER_URL}`, app, document, {
    swaggerOptions: { docExpansion: 'none' },
  });
}

bootstrap();
