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

@ApiTags('CRUD operations on users table')
@ApiSecurity('access-key_for_rest-api')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'create' })
  @ApiResponse({
    status: 200,
    description: 'You have successfully created a user.',
  })
  create(
    @Body() createUserDto: CreateUserDto,
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
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'findAll' })
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
  @ApiResponse({
    status: 200,
    description: "You have successfully retrieved the user's information.",
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
  @ApiResponse({
    status: 200,
    description: "You have successfully updated the user's information.",
  })
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
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
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'remove' })
  @ApiResponse({
    status: 200,
    description: "You have successfully removed the user's information.",
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
