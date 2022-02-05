import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { ReportService } from '../report/report.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  DeleteResult,
  getConnectionOptions,
  InsertResult,
  UpdateResult,
} from 'typeorm';
import { ReportModule } from '../report/report.module';
import { CreateUserDto } from './dto/create-user.dto';
import anything = jasmine.anything;
import { UpdateUserDto } from './dto/update-user.dto';
import { ExportUserReportDto } from './dto/export-user-report.dto';
import { FileFormat } from '../report/report.type';
import { ManagedUpload } from 'aws-sdk/clients/s3';

describe('UsersController', () => {
  let userController: UsersController;
  let userService: UsersService;
  let reportService: ReportService;
  let module: TestingModule;

  beforeAll(async () => {
    const connectionOptions = await getConnectionOptions();
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(connectionOptions),
        TypeOrmModule.forFeature([User]),
        ReportModule,
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
    reportService = module.get<ReportService>(ReportService);
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

  test('reportService should be defined', () => {
    expect(reportService).toBeDefined();
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
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
          }),
        );
      });

      afterAll(() => {
        createUserSpy?.mockRestore();
      });

      test('UserService.create should be called with CreateUserDto', () => {
        expect(createUserSpy).toBeCalledWith(
          plainToClass(CreateUserDto, {
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
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        ]);

        result = await userController.findAll();
      });

      afterAll(() => {
        findAllSpy?.mockRestore();
      });

      test('result should be array User', () => {
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
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        );

        result = await userController.findOne(1);
      });

      afterAll(() => {
        findOneSpy?.mockRestore();
      });

      test('result should be User', () => {
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
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
          }),
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

        result = await userController.remove(1);
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

  describe('【Method】exportReport', () => {
    describe('export pdf successful', () => {
      let findOneUserSpy: jest.SpyInstance;
      let exportSpy: jest.SpyInstance;
      let result: string;

      beforeAll(async () => {
        findOneUserSpy = jest.spyOn(userService, 'findOne').mockResolvedValue(
          plainToClass(User, {
            id: 1,
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        );

        exportSpy = jest.spyOn(reportService, 'export').mockResolvedValue({
          Location: 'https://url.com/file.pdf',
          ETag: 'Etag',
          Bucket: 'bucket_name',
          Key: 'Key',
        } as ManagedUpload.SendData);

        result = await userController.exportReport(
          1,
          plainToClass(ExportUserReportDto, {
            template: 1,
            format: FileFormat.Pdf,
          }),
        );
      });

      afterAll(() => {
        findOneUserSpy?.mockRestore();
        exportSpy?.mockRestore();
      });

      test('result should be url string', () => {
        expect(result).toBe('https://url.com/file.pdf');
      });

      test('UserService.findOne should be called with param id', () => {
        expect(findOneUserSpy).toHaveBeenCalledWith(1);
      });

      test('ReportService.export should be called with ExportUserReportDto and User data', () => {
        expect(exportSpy).toHaveBeenCalledWith(
          plainToClass(ExportUserReportDto, {
            template: 1,
            format: FileFormat.Pdf,
            data: {
              id: 1,
              firstName: 'firstName',
              lastName: 'lastName',
              firstNameKana: 'firstNameKana',
              lastNameKana: 'lastNameKana',
              createdAt: anything(),
              updatedAt: anything(),
            },
          }),
        );
      });
    });
  });
});
