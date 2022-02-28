import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  /**
   * TypeOrmModule.forFeature(EntityClassOrSchema[])
   * You can inject the target repository into the target service
   * using the `@InjectRepository()` decorator.
   * @see https://docs.nestjs.com/techniques/database#typeorm-integration
   */
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
