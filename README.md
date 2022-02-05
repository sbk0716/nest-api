# nest-orm-api

Using these technique

- NestJS framework
- Stimulsoft report js
- Typescript
- Swagger
- TypeORM + Postgresql
- Docker

## Description

```
Flow of the report output function(backend)
1. Send data (Record ID/Template ID) from the frontend (ReactJS) to the REST API (NodeJS) built on AWS.
2. Search the database using the unique key included in the data received by REST API.
3. Create PDF files with REST API (NodeJS) using data retrieved by searching the database and templates of forms.
4. Upload the created PDF file to the cloud storage (S3) using REST API.
5. Return the information of the PDF file uploaded to the cloud storage to the frontend using the REST API.
6. View the PDF file on the front end and download it.
```

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# unit tests with watch
$ yarn test:watch

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

### Test to specific files (example: controller, service, etc..)

```bash
yarn test:watch users/users.controller
yarn test:watch users/users.service
```

## Build

```bash
$ yarn build
```

```
yarn run v1.19.1
$ rimraf dist
$ nest build
✨  Done in 14.53s.
```

# Configuration Logs

## S3 Setup

Create new S3 bucket (if not exists)
[Block public access (bucket settings)] -> Uncheck all -> Save
[Bucket policy] -> Using Policy generator or write these policy below

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

Memo: Please change "your-bucket-name" to your created bucket's name

## Environment variables

- REGION : default is 'ap-northeast-1'
- S3_BUCKET_NAME : default is 'stimulsoft-report-storage' (Company's bucket name)

## Database migration

Before ran database migration, or add/edit migration file, you have to run this command
Todo: This should be fixes in typeorm config for avoid run build command.

```bash
yarn build
```

## Set up Database

```
$ brew install postgresql
$ brew services start postgresql
$ brew services
Name              Status  User  Plist
postgresql        started admin /Users/admin/Library/LaunchAgents/homebrew.mxcl.postgresql.plist
$ psql -d postgres
psql (12.4)
Type "help" for help.

postgres=# CREATE DATABASE nest_stimulsoft_report_js;
CREATE DATABASE
postgres=# CREATE DATABASE test_nest_stimulsoft_report_js;
CREATE DATABASE
postgres=# \l
                                       List of databases
           Name                 | Owner | Encoding | Collate | Ctype | Access privileges
--------------------------------+-------+----------+---------+-------+-------------------
 nest_stimulsoft_report_js      | admin | UTF8     | C       | C     |
 test_nest_stimulsoft_report_js | admin | UTF8     | C       | C     |
 nkc                            | admin | UTF8     | C       | C     |
 postgres                       | admin | UTF8     | C       | C     |
 template0                      | admin | UTF8     | C       | C     | =c/admin         +
                                |       |          |         |       | admin=CTc/admin
 template1                      | admin | UTF8     | C       | C     | =c/admin         +
                                |       |          |         |       | admin=CTc/admin
 test_nkc                       | admin | UTF8     | C       | C     |
(6 rows)

postgres=#
```

### View history migration

Run command

```bash
$ yarn migrate:show
yarn run v1.22.4
$ yarn typeorm migration:show
$ ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:show
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = current_schema() AND "table_name" = 'migrations'
query: CREATE TABLE "migrations" ("id" SERIAL NOT NULL, "timestamp" bigint NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id"))
query: SELECT * FROM "migrations" "migrations"  ORDER BY "id" DESC
 [ ] CreateTableUsers1614142231288
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
$
```

### Run migration code

Run command

```bash
$ yarn migrate:run
yarn run v1.22.4
$ yarn typeorm migration:run
$ ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = current_schema() AND "table_name" = 'migrations'
query: SELECT * FROM "migrations" "migrations"  ORDER BY "id" DESC
0 migrations are already loaded in the database.
1 migrations were found in the source code.
1 migrations are new migrations that needs to be executed.
query: START TRANSACTION
query:
          CREATE TABLE "user" (
            "id" SERIAL NOT NULL,
            "firstName" character varying NOT NULL,
            "lastName" character varying NOT NULL,
            "firstNameKana" character varying NOT NULL,
            "lastNameKana" character varying NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
          )
query: INSERT INTO "migrations"("timestamp", "name") VALUES ($1, $2) -- PARAMETERS: [1614142231288,"CreateTableUsers1614142231288"]
Migration CreateTableUsers1614142231288 has been executed successfully.
query: COMMIT
✨  Done in 2.29s.
$
```

### Revert migration code (1 migration file per execute time)

Run command

```bash
yarn migrate:revert
```

# Development Logs

## Module

### Module Status

- Generate module command/logs

```bash
$ nest generate module status
```

```
CREATE src/status/status.module.ts (83 bytes)
UPDATE src/app.module.ts (316 bytes)
```

- Generate controller command/logs

```bash
$ nest generate controller status
```

```
CREATE src/status/status.controller.spec.ts (492 bytes)
CREATE src/status/status.controller.ts (101 bytes)
UPDATE src/status/status.module.ts (174 bytes)
```

### Module Report

- Generate resource command/logs

```bash
$ nest generate res report
```

```
? What transport layer do you use? REST API
? Would you like to generate CRUD entry points? No
CREATE src/report/report.controller.spec.ts (576 bytes)
CREATE src/report/report.controller.ts (216 bytes)
CREATE src/report/report.module.ts (254 bytes)
CREATE src/report/report.service.spec.ts (460 bytes)
CREATE src/report/report.service.ts (90 bytes)
UPDATE src/app.module.ts (232 bytes)
```

## Service

### Service S3File

- Generate service command/logs

```bash
$ nest generate service s3File
```

```
CREATE src/s3-file/s3-file.service.spec.ts (461 bytes)
CREATE src/s3-file/s3-file.service.ts (90 bytes)
UPDATE src/app.module.ts (321 bytes)
```

## Other

### Change from expressjs to fastify

- Remove these Library

  - @nestjs/express
  - @types/express

- Intsall these library
  - @nestjs/fastify
  - fastify-static (because using ServeStaticModule)

Change code in main.ts to

```
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter({ logger: true }),
);
```

After enable log, when call api, log will be written following

```
{"level":30,"time":1614911002472,"pid":71152,"hostname":"ats-MacBook-Pro-2.local","msg":"Server listening at http://127.0.0.1:3000"}
{"level":30,"time":1614911019409,"pid":71152,"hostname":"ats-MacBook-Pro-2.local","reqId":1,"req":{"method":"POST","url":"/api/users/1/report","hostname":"localhost:3000","remoteAddress":"127.0.0.1","remotePort":58630},"msg":"incoming request"}
{"level":30,"time":1614911022152,"pid":71152,"hostname":"ats-MacBook-Pro-2.local","reqId":1,"res":{"statusCode":201},"responseTime":2741.571911931038,"msg":"request completed"}
```

### Add swagger

Install these library

- @nestjs/swagger
- fastify-swagger

# Testing Flow

For test quickly, i wrote curl command.

## Create user information by call api POST /api/users

```bash
curl --location --request POST 'localhost:3000/api/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "Dat",
    "lastName": "Tran",
    "firstNameKana": "ダット",
    "lastNameKana": "チェアン"
}'
```

```response log
{"identifiers":[{"id":1}],"generatedMaps":[{"id":1,"createdAt":"2021-03-02T09:19:26.070Z","updatedAt":"2021-03-02T09:19:26.070Z"}],"raw":[{"id":1,"createdAt":"2021-03-02T09:19:26.070Z","updatedAt":"2021-03-02T09:19:26.070Z"}]}
```

## Export document (pdf, excel2007, word2007) by api POST /api/users/{:id}/report

```bash
curl --location --request POST 'localhost:3000/api/users/1/report' \
--header 'Content-Type: application/json' \
--data-raw '{
    "template": "MemberInfo",
    "format": 1
}'
```

```response log
https://stimulsoft-report-storage.s3.ap-northeast-1.amazonaws.com/report/MemberInfoV1-1614676836333.pdf
```

You can change "template" to these values:

- MemberInfoV1
- MemberInfoV2
- MemberInfoV3
- MemberInfoCustomFont
- ReportFile5MB
- ReportMeiryoFont
- SaleContract
- SaleContractMeiryo

You can change "format" to export to specific document:

- 1 (pdf)
- 2 (word2007)
- 3 (excel2007)
