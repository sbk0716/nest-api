import { Module } from '@nestjs/common';
import { StatusModule } from './status/status.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    StatusModule,
    TypeOrmModule.forRoot(),
    UsersModule,
  ],
})
export class AppModule {}
