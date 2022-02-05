import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportModule } from '../report/report.module';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ReportModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
