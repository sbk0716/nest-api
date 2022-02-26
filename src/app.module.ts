/**
 * app.module.ts
 * The root module of the application.
 */
import { Module } from '@nestjs/common';
import { StatusModule } from './status/status.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { getConnectionOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
          retryAttempts: 10,
          retryDelay: 3000,
          keepConnectionAlive: false,
        }),
    }),
    UsersModule,
    StatusModule,
  ],
})
export class AppModule {}
