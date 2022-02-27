import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Logger,
  HttpException,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

@ApiTags('CRUD operations on users table')
@ApiSecurity('access-key_for_rest-api')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Execute UsersController.create()',
    description: 'Create a user.',
  })
  @ApiResponse({
    status: 200,
    description: 'You have successfully created a user.',
  })
  create(
    @Body() createParams: CreateUserDto,
    @Headers() headers: { [index: string]: string },
  ) {
    Logger.log('### headers ###');
    Logger.log(headers);
    if (!headers?.hasOwnProperty('authorization')) {
      Logger.error(`[ERROR] - authorization is undefined!]`);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `[ERROR] - authorization is undefined!]`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const createUserDto = plainToClass(CreateUserDto, createParams);
    if (!createUserDto.hasRequiredAttributes) {
      Logger.error(`[ERROR] - The parameter is invalid!`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `[ERROR] - The parameter is invalid!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Execute UsersController.findAll()',
    description: 'Retrieve a list of all users.',
  })
  @ApiResponse({
    status: 200,
    description: 'You have successfully retrieved the list of all users.',
  })
  findAll(@Headers() headers: { [index: string]: string }) {
    Logger.log('### headers ###');
    Logger.log(headers);
    if (!headers?.hasOwnProperty('authorization')) {
      Logger.error(`[ERROR] - authorization is undefined!]`);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `[ERROR] - authorization is undefined!]`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'findOne' })
  @ApiOperation({
    summary: 'Execute UsersController.findOne()',
    description: 'Retrieve the user information.',
  })
  @ApiResponse({
    status: 200,
    description: 'You have successfully retrieved the user information.',
  })
  findOne(
    @Param('id') id: number,
    @Headers() headers: { [index: string]: string },
  ) {
    Logger.log('### headers ###');
    Logger.log(headers);
    if (!headers?.hasOwnProperty('authorization')) {
      Logger.error(`[ERROR] - authorization is undefined!]`);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `[ERROR] - authorization is undefined!]`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'update' })
  @ApiOperation({
    summary: 'Execute UsersController.update()',
    description: 'Update the user information.',
  })
  @ApiResponse({
    status: 200,
    description: 'You have successfully updated the user information.',
  })
  update(
    @Param('id') id: number,
    @Body() updateParams: UpdateUserDto,
    @Headers() headers: { [index: string]: string },
  ) {
    Logger.log('### headers ###');
    Logger.log(headers);
    if (!headers?.hasOwnProperty('authorization')) {
      Logger.error(`[ERROR] - authorization is undefined!]`);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `[ERROR] - authorization is undefined!]`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const updateUserDto = plainToClass(UpdateUserDto, updateParams);
    if (!updateUserDto.hasRequiredAttributes) {
      Logger.error(`[ERROR] - The parameter is invalid!`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `[ERROR] - The parameter is invalid!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'remove' })
  @ApiOperation({
    summary: 'Execute UsersController.remove()',
    description: 'Remove the user information.',
  })
  @ApiResponse({
    status: 200,
    description: 'You have successfully removed the user information.',
  })
  remove(
    @Param('id') id: number,
    @Headers() headers: { [index: string]: string },
  ) {
    Logger.log('### headers ###');
    Logger.log(headers);
    if (!headers?.hasOwnProperty('authorization')) {
      Logger.error(`[ERROR] - authorization is undefined!]`);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `[ERROR] - authorization is undefined!]`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return this.usersService.remove(id);
  }
}
