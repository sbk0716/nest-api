import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import {
  truncateTestData,
  generateTestData,
} from '../../test/modules/test-manager';
import {
  DeleteResult,
  getConnection,
  getConnectionOptions,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import anything = jasmine.anything;
import { userData } from './users.testdata';
import { CreateUserDto } from './dto/create-user.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('【Service】UsersService', () => {
  let userService: UsersService;
  let userRepository: Repository<User>;
  let module: TestingModule;

  beforeAll(async () => {
    const connectionOptions = await getConnectionOptions();
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(connectionOptions),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = await getConnection().getRepository(User);
  });

  afterAll(async () => {
    await module.close();
  });

  test('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('【Method】create', () => {
    describe('Create user that not exists', () => {
      let createdUser: User;
      let result: InsertResult;

      beforeAll(async () => {
        await truncateTestData(Object.keys(userData));
        result = await userService.create(
          plainToClass(CreateUserDto, {
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
          }),
        );

        createdUser = await userRepository.findOne(result.identifiers[0].id);
      });

      test('result should be InsertResult object', () => {
        expect(result).toStrictEqual(
          plainToClass(InsertResult, {
            identifiers: [{ id: anything() }],
            generatedMaps: anything(),
            raw: anything(),
          }),
        );
      });

      test('createdUser should return same as value as CreateUserDto', () => {
        expect(createdUser).toStrictEqual(
          plainToClass(User, {
            id: anything(),
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
            createdAt: anything(),
            updatedAt: anything(),
          }),
        );
      });
    });

    describe('Create user with undefined informations', () => {
      let action: Promise<InsertResult>;
      beforeAll(() => {
        action = userService.create(plainToClass(CreateUserDto, {}));
      });

      test('action should return InternalServerErrorException error', async () => {
        expect.assertions(1);
        try {
          await action;
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });

    describe('Create user with blank informations', () => {
      let createdUser: User;
      let result: InsertResult;

      beforeAll(async () => {
        await truncateTestData(Object.keys(userData));
        result = await userService.create(
          plainToClass(CreateUserDto, {
            firstName: '',
            lastName: '',
            firstNameKana: '',
            lastNameKana: '',
          }),
        );

        createdUser = await userRepository.findOne(result.identifiers[0].id);
      });

      test('result should be InsertResult object', () => {
        expect(result).toStrictEqual(
          plainToClass(InsertResult, {
            identifiers: [{ id: anything() }],
            generatedMaps: anything(),
            raw: anything(),
          }),
        );
      });

      test('createdUser should be User object', () => {
        expect(createdUser).toStrictEqual(
          plainToClass(User, {
            id: anything(),
            firstName: '',
            lastName: '',
            firstNameKana: '',
            lastNameKana: '',
            createdAt: anything(),
            updatedAt: anything(),
          }),
        );
      });
    });
  });

  describe('【Method】findAll', () => {
    describe('Get empty list data', () => {
      let result: User[];

      beforeAll(async () => {
        await truncateTestData(Object.keys(userData));
        result = await userService.findAll();
      });

      test('result should be empty', () => {
        expect(result).toStrictEqual([]);
      });
    });

    describe('Get list data', () => {
      let result: User[];

      beforeAll(async () => {
        await truncateTestData(Object.keys(userData));
        await generateTestData(userData);

        result = await userService.findAll();
      });

      test('result should be array', () => {
        expect(result).toBeInstanceOf(Array);
      });

      test('result should be 1 User object', () => {
        expect(result.length).toBe(1);
        expect(result).toStrictEqual([
          plainToClass(User, {
            id: 1,
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
            createdAt: anything(),
            updatedAt: anything(),
          }),
        ]);
      });
    });
  });

  describe('【Method】findOne', () => {
    describe('Get existing user', () => {
      let result: User;

      beforeAll(async () => {
        await truncateTestData(Object.keys(userData));
        await generateTestData(userData);

        result = await userService.findOne(1);
      });

      test('result should be User entity object', () => {
        expect(result).toStrictEqual(
          plainToClass(User, {
            id: 1,
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
            createdAt: anything(),
            updatedAt: anything(),
          }),
        );
      });
    });

    describe('Get non-exist user', () => {
      let action: Promise<User>;

      beforeAll(async () => {
        await truncateTestData(Object.keys(userData));

        action = userService.findOne(1);
      });

      test('action should throw NotFoundException error', async () => {
        expect.assertions(2);
        try {
          await action;
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe('User not found');
        }
      });
    });
  });

  describe('【Method】update', () => {
    describe('update exist user with full parameter', () => {
      let updatedUser: User;
      let result: UpdateResult;

      beforeAll(async () => {
        await truncateTestData(Object.keys(userData));
        await generateTestData(userData);

        result = await userService.update(
          1,
          plainToClass(UpdateUserDto, {
            firstName: 'newFirstName',
            lastName: 'newLastName',
            firstNameKana: 'newFirstNameKana',
            lastNameKana: 'newLastNameKana',
          }),
        );

        updatedUser = await userRepository.findOne(1);
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

      test('updatedUser should be User entity object with updated information', () => {
        expect(updatedUser).toStrictEqual(
          plainToClass(User, {
            id: 1,
            firstName: 'newFirstName',
            lastName: 'newLastName',
            firstNameKana: 'newFirstNameKana',
            lastNameKana: 'newLastNameKana',
            createdAt: anything(),
            updatedAt: anything(),
          }),
        );
      });
    });

    describe('update exists user with partial parameter', () => {
      let updatedUser: User;
      let result: UpdateResult;

      beforeAll(async () => {
        await truncateTestData(Object.keys(userData));
        await generateTestData(userData);

        result = await userService.update(
          1,
          plainToClass(UpdateUserDto, {
            firstName: 'newFirstName',
            lastName: 'newLastName',
          }),
        );

        updatedUser = await userRepository.findOne(1);
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

      test('updatedUser should be User entity object with updated information', () => {
        expect(updatedUser).toStrictEqual(
          plainToClass(User, {
            id: 1,
            firstName: 'newFirstName',
            lastName: 'newLastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
            createdAt: anything(),
            updatedAt: anything(),
          }),
        );
      });
    });

    describe('update exists user with blank parameter', () => {
      let updatedUser: User;
      let result: UpdateResult;

      beforeAll(async () => {
        await truncateTestData(Object.keys(userData));
        await generateTestData(userData);

        result = await userService.update(
          1,
          plainToClass(UpdateUserDto, {
            firstName: '',
            lastName: '',
          }),
        );

        updatedUser = await userRepository.findOne(1);
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

      test('updatedUser should be User entity object with updated information', () => {
        expect(updatedUser).toStrictEqual(
          plainToClass(User, {
            id: 1,
            firstName: '',
            lastName: '',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
            createdAt: anything(),
            updatedAt: anything(),
          }),
        );
      });
    });

    describe('update non-exists user with full parameters', () => {
      let result: UpdateResult;

      beforeAll(async () => {
        await truncateTestData(Object.keys(userData));

        result = await userService.update(
          1,
          plainToClass(UpdateUserDto, {
            firstName: 'newFirstName',
            lastName: 'newLastName',
            firstNameKana: 'newFirstNameKana',
            lastNameKana: 'newLastNameKana',
          }),
        );
      });

      test('result should be UpdateResult with affected 0 records', async () => {
        expect(result).toStrictEqual(
          plainToClass(UpdateResult, {
            affected: 0,
            generatedMaps: [],
            raw: [],
          }),
        );
      });
    });
  });

  describe('【Method】remove', () => {
    describe('remove exists user', () => {
      let findDeletedUserAction: Promise<User>;
      let result: DeleteResult;

      beforeAll(async () => {
        await truncateTestData(Object.keys(userData));
        await generateTestData(userData);

        result = await userService.remove(1);

        findDeletedUserAction = userService.findOne(1);
      });

      test('result should be DeleteResult object with affected 1 record', () => {
        expect(result).toStrictEqual(
          plainToClass(DeleteResult, {
            affected: 1,
            raw: [],
          }),
        );
      });

      test('findDeletedUserAction should throw NotFoundException error', async () => {
        expect.assertions(2);
        try {
          await findDeletedUserAction;
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe('User not found');
        }
      });
    });

    describe('remove non-exists user', () => {
      let result: DeleteResult;

      beforeAll(async () => {
        await truncateTestData(Object.keys(userData));

        result = await userService.remove(1);
      });

      test('result should be DeleteResult object with affected 0 record', () => {
        expect(result).toStrictEqual(
          plainToClass(DeleteResult, {
            affected: 0,
            raw: [],
          }),
        );
      });
    });
  });
});
