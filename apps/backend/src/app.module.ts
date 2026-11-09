import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { UsersModule } from './users/users.module.js';

@Module({
  controllers: [],
  providers: [],
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : { target: 'pino-pretty', options: { singleLine: true } },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
    }),
  ],
})
export class AppModule {}
