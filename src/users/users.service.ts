import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
// import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    /**
     * You can inject the target repository into the target service
     * by setting Imports on the target module.
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<InsertResult> {
    try {
      const insertResult = await this.usersRepository.insert(createUserDto);
      console.info(insertResult);
      return insertResult;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const result = await this.usersRepository.find();
      console.info(result);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<User> {
    // const findOneQuery = `
    //   SELECT
    //     "User"."id",
    //     "User"."email",
    //     "User"."first_name",
    //     "User"."last_name",
    //     "User"."first_name_kana",
    //     "User"."last_name_kana",
    //     "User"."created_at",
    //     "User"."updated_at"
    //   FROM
    //     "private"."user_table" "User"
    //   WHERE "User"."id" IN ($1)
    // `;
    // const userEntity = await this.usersRepository.query(findOneQuery, [id]);
    try {
      const userEntity = await this.usersRepository.findOne(id);
      console.info(userEntity);
      if (!userEntity) {
        throw new NotFoundException('User not found');
      }
      return userEntity;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    try {
      const updateResult = await this.usersRepository.update(id, updateUserDto);
      console.info(updateResult);
      return updateResult;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      const deleteResult = await this.usersRepository.delete(id);
      console.info(deleteResult);
      return deleteResult;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
