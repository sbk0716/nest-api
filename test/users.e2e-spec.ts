import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DeleteResult,
  getConnectionOptions,
  InsertResult,
  UpdateResult,
} from 'typeorm';
import { Response } from 'light-my-request';
import { plainToClass } from 'class-transformer';
import { User } from '../src/users/entities/user.entity';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
// import { ReportService } from '../src/report/report.service';
// import { FileFormat } from '../src/report/report.type';

describe('【E2E】UsersController', () => {
  let app: NestFastifyApplication;
  let module: TestingModule;
  const userServiceSpy = {
    create: () =>
      plainToClass(InsertResult, {
        affected: 1,
        identifiers: [{ id: 1 }],
        generatedMaps: [],
        raw: [],
      }),
    findAll: () => [
      plainToClass(User, {
        id: 1,
        firstName: 'firstName',
        lastName: 'lastName',
        firstNameKana: 'firstNameKana',
        lastNameKana: 'lastNameKana',
      }),
    ],
    findOne: () =>
      plainToClass(User, {
        id: 1,
        firstName: 'firstName',
        lastName: 'lastName',
        firstNameKana: 'firstNameKana',
        lastNameKana: 'lastNameKana',
      }),
    update: () =>
      plainToClass(UpdateResult, {
        affected: 1,
        generatedMaps: [],
        raw: [],
      }),
    remove: () =>
      plainToClass(DeleteResult, {
        affected: 1,
        raw: [],
      }),
  };
  // const reportServiceSpy = {
  //   export: () => {
  //     return { Location: 'https://url.com/file.pdf' };
  //   },
  // };

  beforeAll(async () => {
    const connectionOptions = await getConnectionOptions();
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(connectionOptions),
        TypeOrmModule.forFeature([User]),
        UsersModule,
      ],
    })
      .overrideProvider(UsersService)
      .useValue(userServiceSpy)
      .compile();

    app = module.createNestApplication(new FastifyAdapter());
    await app.init();
  });

  afterAll(() => {
    module.close();
  });

  describe('【API】POST /users', () => {
    describe('add data successful', () => {
      let response: Response;

      beforeAll(async () => {
        response = await app.inject({
          path: '/users',
          method: 'POST',
          payload: {
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
          },
        });
      });

      test('response should be success', () => {
        expect(response.statusCode).toBe(201);
        expect(response.statusMessage).toBe('Created');
        const bodyJson = JSON.parse(response.body);
        expect(bodyJson).toStrictEqual({
          affected: 1,
          identifiers: [{ id: 1 }],
          generatedMaps: [],
          raw: [],
        });
      });
    });
  });

  describe('【API】GET /users', () => {
    describe('get exists data', () => {
      let response: Response;
      beforeAll(async () => {
        response = await app.inject({
          path: '/users',
          method: 'GET',
        });
      });

      test('response should be success', () => {
        expect(response.statusCode).toBe(200);
        expect(response.statusMessage).toBe('OK');
        const bodyJson = JSON.parse(response.body);
        expect(bodyJson).toStrictEqual([
          {
            id: 1,
            firstName: 'firstName',
            lastName: 'lastName',
            firstNameKana: 'firstNameKana',
            lastNameKana: 'lastNameKana',
          },
        ]);
      });
    });
  });

  describe('【API】GET /users/:id', () => {
    describe('get exists data', () => {
      let response: Response;
      beforeAll(async () => {
        response = await app.inject({
          path: '/users/1',
          method: 'GET',
        });
      });

      test('response should be success', () => {
        expect(response.statusCode).toBe(200);
        expect(response.statusMessage).toBe('OK');
        const bodyJson = JSON.parse(response.body);
        expect(bodyJson).toStrictEqual({
          id: 1,
          firstName: 'firstName',
          lastName: 'lastName',
          firstNameKana: 'firstNameKana',
          lastNameKana: 'lastNameKana',
        });
      });
    });
  });

  describe('【API】PUT /users/:id', () => {
    describe('update exists data', () => {
      let response: Response;
      beforeAll(async () => {
        response = await app.inject({
          path: '/users/1',
          method: 'PUT',
          payload: {
            firstName: 'newFirstName',
            lastName: 'newLastName',
            firstNameKana: 'newFirstNameKana',
            lastNameKana: 'newLastNameKana',
          },
        });
      });

      test('response should be success', () => {
        expect(response.statusCode).toBe(200);
        expect(response.statusMessage).toBe('OK');
        const bodyJson = JSON.parse(response.body);
        expect(bodyJson).toStrictEqual({
          affected: 1,
          generatedMaps: [],
          raw: [],
        });
      });
    });
  });

  describe('【API】DELETE /users/:id', () => {
    describe('delete exists data', () => {
      let response: Response;
      beforeAll(async () => {
        response = await app.inject({
          path: '/users/1',
          method: 'DELETE',
        });
      });

      test('response should be success', () => {
        expect(response.statusCode).toBe(200);
        expect(response.statusMessage).toBe('OK');
        const bodyJson = JSON.parse(response.body);
        expect(bodyJson).toStrictEqual({
          affected: 1,
          raw: [],
        });
      });
    });
  });

  // describe('【API】POST /users/:id/report', () => {
  //   describe('export report successful', () => {
  //     let response: Response;
  //     beforeAll(async () => {
  //       response = await app.inject({
  //         path: '/users/1/report',
  //         method: 'POST',
  //         payload: {
  //           template: 1,
  //           format: FileFormat.Pdf,
  //         },
  //       });
  //     });

  //     test('response should be success', () => {
  //       expect(response.statusCode).toBe(201);
  //       expect(response.statusMessage).toBe('Created');
  //       expect(response.body).toBe('https://url.com/file.pdf');
  //     });
  //   });
  // });
});
