import { Logger, MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { HttpRequestLoggerMiddleware } from './common/middleware/http-request-logger/http-request-logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule, HttpService } from '@nestjs/axios';

import { JwtUserStrategy } from './authorize/strategy/jwt-user.strategy';
import { JwtUserAuthGuard } from './authorize/guard/jwt-user-auth.guard';
import { JwtTokenAuthGuard } from './authorize/guard/jwt-token-auth.guard';

import { PrismaService } from './common/provider/prisma/prisma.service';
import { TokenService } from './common/provider/token/token.service';
import { UserService } from './common/provider/user/user.service';
import { TokenController } from './controller/token/token.controller';
import { TemplateNestjsServerService } from './common/provider/template-nestjs-server/template-nestjs-server.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ENV } from './config/environment';
import { ScheduleModule } from '@nestjs/schedule';
import { ImageService } from './common/provider/image/image.service';
import { ImageTaskService } from './task/image/image-task.service';
import { TemplateGateway } from './gateway/template/template.gateway';
import { WsEventEmitService } from './common/provider/ws-event-emit/ws-event-emit.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      renderPath: '/',
      serveRoot: `${ENV.URL.URL_GLOBAL_PREFIX}${ENV.URL.URL_STATIC}`,
    }),
    HttpModule.register({
      timeout: 30 * 1000,
      maxRedirects: 5,
      paramsSerializer: { indexes: null },
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [TokenController],
  providers: [
    TemplateGateway,
    WsEventEmitService,

    JwtUserStrategy,
    JwtUserAuthGuard,
    JwtTokenAuthGuard,

    PrismaService,
    TokenService,
    UserService,
    TemplateNestjsServerService,
    ImageService,

    ImageTaskService,
  ],
})
export class AppModule implements NestModule, OnModuleInit {
  private httpServiceLogger = new Logger(HttpService.name);
  constructor(private httpService: HttpService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpRequestLoggerMiddleware).forRoutes('*');
  }

  onModuleInit() {
    // this code runs when the module is fully initialized
    this.httpService.axiosRef.interceptors.request.use((config) => {
      console.log(config);
      this.httpServiceLogger.verbose(`[${config.method}] ${this.httpService.axiosRef.getUri(config)}`);
      return config;
    });
  }
}
