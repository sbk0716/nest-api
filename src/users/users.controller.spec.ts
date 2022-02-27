import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  DeleteResult,
  getConnectionOptions,
  InsertResult,
  UpdateResult,
} from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let userController: UsersController;
  let userService: UsersService;
  let module: TestingModule;
  const headers: { [index: string]: string } = {
    host: 'localhost:9999',
    authorization: 'test-token',
  };

  beforeAll(async () => {
    const connectionOptions = await getConnectionOptions();
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(connectionOptions),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  afterAll(() => {
    module.close();
  });

  test('userController should be defined', () => {
    expect(userController).toBeDefined();
  });

  test('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('【Method】create', () => {
    describe('create successful', () => {
      let createUserSpy: jest.SpyInstance;
      let result: InsertResult;

      beforeAll(async () => {
        createUserSpy = jest.spyOn(userService, 'create').mockResolvedValue(
          plainToClass(InsertResult, {
            affected: 1,
            generatedMaps: [],
            raw: [],
          }),
        );

        result = await userController.create(
          plainToClass(CreateUserDto, {
            email: 'testuser01@gmail.com',
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
          }),
          headers,
        );
      });

      afterAll(() => {
        createUserSpy?.mockRestore();
      });

      test('UserService.create should be called with CreateUserDto', () => {
        expect(createUserSpy).toBeCalledWith(
          plainToClass(CreateUserDto, {
            email: 'testuser01@gmail.com',
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
          }),
        );
      });

      test('result should be InsertResult', () => {
        expect(result).toStrictEqual(
          plainToClass(InsertResult, {
            affected: 1,
            generatedMaps: [],
            raw: [],
          }),
        );
      });
    });
  });

  describe('【Method】findAll', () => {
    describe('get data successful', () => {
      let findAllSpy: jest.SpyInstance;
      let result: User[];

      beforeAll(async () => {
        findAllSpy = jest.spyOn(userService, 'findAll').mockResolvedValue([
          plainToClass(User, {
            id: 1,
            email: 'testuser01@gmail.com',
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        ]);

        result = await userController.findAll(headers);
      });

      afterAll(() => {
        findAllSpy?.mockRestore();
      });

      test('result should be array User', () => {
        expect(result).toStrictEqual([
          plainToClass(User, {
            id: 1,
            email: 'testuser01@gmail.com',
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          }),
        ]);
      });

      test('UserService.findAll should be called', () => {
        expect(findAllSpy).toBeCalledWith();
      });
    });
  });

  describe('【Method】findOne', () => {
    describe('get data successful', () => {
      let findOneSpy: jest.SpyInstance;
      let result: User;

      beforeAll(async () => {
        findOneSpy = jest.spyOn(userService, 'findOne').mockResolvedValue(
          plainToClass(User, {
            id: 1,
            email: 'testuser01@gmail.com',
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        );

        result = await userController.findOne(1, headers);
      });

      afterAll(() => {
        findOneSpy?.mockRestore();
      });

      test('result should be User', () => {
        expect(result).toStrictEqual(
          plainToClass(User, {
            id: 1,
            email: 'testuser01@gmail.com',
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          }),
        );
      });

      test('UserService.findOne should be called with id number', () => {
        expect(findOneSpy).toBeCalledWith(1);
      });
    });
  });

  describe('【Method】update', () => {
    describe('update successful', () => {
      let updateUserSpy: jest.SpyInstance;
      let result: UpdateResult;

      beforeAll(async () => {
        updateUserSpy = jest.spyOn(userService, 'update').mockResolvedValue(
          plainToClass(UpdateResult, {
            affected: 1,
            generatedMaps: [],
            raw: [],
          }),
        );

        result = await userController.update(
          1,
          plainToClass(UpdateUserDto, {
            email: 'testuser01@gmail.com',
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
          }),
          headers,
        );
      });

      afterAll(() => {
        updateUserSpy?.mockRestore();
      });

      test('result should be UpdateResult', () => {
        expect(result).toStrictEqual(
          plainToClass(UpdateResult, {
            affected: 1,
            generatedMaps: [],
            raw: [],
          }),
        );
      });

      test('UserService.update should be called with id number and UpdateUserDto', () => {
        expect(updateUserSpy).toBeCalledWith(
          1,
          plainToClass(UpdateUserDto, {
            email: 'testuser01@gmail.com',
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
          }),
        );
      });
    });
  });

  describe('【Method】remove', () => {
    describe('remove data successful', () => {
      let removeUserSpy: jest.SpyInstance;
      let result: DeleteResult;

      beforeAll(async () => {
        removeUserSpy = jest.spyOn(userService, 'remove').mockResolvedValue(
          plainToClass(DeleteResult, {
            affected: 1,
            raw: [],
          }),
        );

        result = await userController.remove(1, headers);
      });

      afterAll(() => {
        removeUserSpy?.mockRestore();
      });

      test('result should be DeleteResult', () => {
        expect(result).toStrictEqual(
          plainToClass(DeleteResult, {
            affected: 1,
            raw: [],
          }),
        );
      });

      test('UserService.remove should be called with id number', () => {
        expect(removeUserSpy).toBeCalledWith(1);
      });
    });
  });
});
