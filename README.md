# 1. Project Overview
This is a project for an app called `nest-orm-api`.

## (1)App Features
This app is able to use below function.

### User Story
- You can add any task.
- You can read the list of tasks.
- You can read the details of any task.
- You can edit any task.
- You can delete any task.
- You can mark the specified task as complete.
- You can mark the specified task as incomplete.


## (2)Project Structure
```sh
admin@gw-mac nest-orm-api-main % tree -d
.
├── assets
├── db
├── src
│   ├── configs
│   ├── dynamo-db
│   │   └── dto
│   ├── migrations
│   ├── order
│   │   └── dto
│   ├── report
│   │   └── dto
│   ├── s3-file
│   ├── sqs
│   │   └── dto
│   ├── status
│   └── users
│       ├── dto
│       └── entities
└── test
    └── modules

20 directories
admin@gw-mac nest-orm-api-main % 
```


# 2. Usage
## (1)yarn install
```sh
admin@gw-mac nest-orm-api-main % docker-compose run --entrypoint "yarn install --production=false" app-api
Creating nest-orm-api-main_app-api_run ... done
yarn install v1.22.17
[1/4] Resolving packages...
success Already up-to-date.
Done in 0.47s.
admin@gw-mac nest-orm-api-main % 
```

## (2)docker-compose up
```sh
admin@gw-mac nest-orm-api-main % docker image ls
REPOSITORY   TAG       IMAGE ID       CREATED      SIZE
postgres     latest    da2cb49d7a8d   9 days ago   374MB
admin@gw-mac nest-orm-api-main % 
admin@gw-mac nest-orm-api-main % docker volume ls
DRIVER    VOLUME NAME
admin@gw-mac nest-orm-api-main % 
admin@gw-mac nest-orm-api-main % docker-compose up -d --build
Creating volume "nest-orm-api-main_postgres_data" with default driver
Building app-api
...
...
admin@gw-mac nest-orm-api-main % 
admin@gw-mac nest-orm-api-main % docker image ls
REPOSITORY                  TAG       IMAGE ID       CREATED              SIZE
nest-orm-api-main_app-api   latest    c9f02abc054b   About a minute ago   821MB
postgres                    latest    da2cb49d7a8d   9 days ago           374MB
admin@gw-mac nest-orm-api-main % docker volume ls
DRIVER    VOLUME NAME
local     nest-orm-api-main_postgres_data
admin@gw-mac nest-orm-api-main % docker ps
CONTAINER ID   IMAGE                       COMMAND                  CREATED              STATUS              PORTS                                       NAMES
56f716a9d147   postgres:latest             "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp   nest-orm-api-main_app-db_1
544d04001494   nest-orm-api-main_app-api   "yarn run start"         About a minute ago   Up About a minute   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp   nest-orm-api-main_app-api_1
admin@gw-mac nest-orm-api-main % 
```

## (3)create schema and testdb
```sh
admin@gw-mac nest-orm-api-main % docker-compose exec app-db /bin/bash
root@56f716a9d147:/# printenv | grep PASS
POSTGRES_PASSWORD=***
root@56f716a9d147:/# psql --username admin --dbname coredb
psql (14.1 (Debian 14.1-1.pgdg110+1))
Type "help" for help.

coredb=# CREATE SCHEMA IF NOT EXISTS "todoist";
CREATE SCHEMA
coredb=# \dn
 List of schemas
  Name   | Owner 
---------+-------
 public  | admin
 todoist | admin
(2 rows)

coredb=# CREATE DATABASE "testdb";
CREATE DATABASE
coredb=# \l
                         List of databases
   Name    | Owner | Encoding | Collate | Ctype | Access privileges 
-----------+-------+----------+---------+-------+-------------------
 coredb    | admin | UTF8     | C       | C     | 
 postgres  | admin | UTF8     | C       | C     | 
 template0 | admin | UTF8     | C       | C     | =c/admin         +
           |       |          |         |       | admin=CTc/admin
 template1 | admin | UTF8     | C       | C     | =c/admin         +
           |       |          |         |       | admin=CTc/admin
 testdb    | admin | UTF8     | C       | C     | 
(5 rows)

coredb=# \c testdb
You are now connected to database "testdb" as user "admin".
testdb=# CREATE SCHEMA IF NOT EXISTS "todoist";
CREATE SCHEMA
testdb=# \dn
 List of schemas
  Name   | Owner 
---------+-------
 public  | admin
 todoist | admin
(2 rows)

testdb=# 
testdb=# \q
root@56f716a9d147:/# exit
exit
admin@gw-mac nest-orm-api-main % 
```

## (4)migratation for app db
```sh
admin@gw-mac nest-orm-api-main % docker-compose exec app-api /bin/bash
root@544d04001494:/usr/src/app# 
root@544d04001494:/usr/src/app# yarn migrate:show
yarn run v1.22.17
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
root@544d04001494:/usr/src/app# 
root@544d04001494:/usr/src/app# yarn migrate:run
yarn run v1.22.17
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
Done in 9.84s.
root@544d04001494:/usr/src/app# 
root@544d04001494:/usr/src/app# yarn migrate:show
yarn run v1.22.17
$ yarn typeorm migration:show
$ ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:show
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = current_schema() AND "table_name" = 'migrations'
query: SELECT * FROM "migrations" "migrations"  ORDER BY "id" DESC
 [X] CreateTableUsers1614142231288
Done in 8.63s.
root@544d04001494:/usr/src/app# 
```


## (5)docker-compose down
```sh
admin@gw-mac nest-orm-api-main % docker-compose down
Removing nest-orm-api-main_app-db_1  ... done
Removing nest-orm-api-main_app-api_1 ... done
Removing network nest-orm-api-main_default
admin@gw-mac nest-orm-api-main % 
admin@gw-mac nest-orm-api-main % docker image ls
REPOSITORY                  TAG       IMAGE ID       CREATED       SIZE
nest-orm-api-main_app-api   latest    c9f02abc054b   3 hours ago   821MB
postgres                    latest    da2cb49d7a8d   9 days ago    374MB
admin@gw-mac nest-orm-api-main % 
admin@gw-mac nest-orm-api-main % docker volume ls
DRIVER    VOLUME NAME
local     nest-orm-api-main_postgres_data
admin@gw-mac nest-orm-api-main % 
admin@gw-mac nest-orm-api-main % docker image rm c9f02abc054b da2cb49d7a8d
admin@gw-mac nest-orm-api-main % 
admin@gw-mac nest-orm-api-main % docker volume rm nest-orm-api-main_postgres_data
nest-orm-api-main_postgres_data
admin@gw-mac nest-orm-api-main % 
```


# 3. Generate migratation file
## (1)generate migratation file
```sh
admin@gw-mac nest-orm-api-main % docker-compose exec app-api /bin/bash
root@d1569df7ec85:/usr/src/app# 
root@d1569df7ec85:/usr/src/app# yarn migrate:generate CreateUserTable
yarn run v1.22.17
$ yarn typeorm migration:generate -n CreateUserTable
$ ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -n CreateUserTable
Migration /usr/src/app/src/migrations/1644047378747-CreateUserTable.ts has been generated successfully.
Done in 8.51s.
root@d1569df7ec85:/usr/src/app# 
```

# 4. operation verification
## (1)POST /api/users/
```sh
admin@gw-mac nest-orm-api-main % curl -X POST 'localhost:3000/api/users' \
-H 'Content-Type: application/json' \
-d '{
    "firstName": "Dat",
    "lastName": "Tran",
    "firstNameKana": "ダット",
    "lastNameKana": "チェアン"
}' | jq -r '.'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   346  100   226  100   120   9825   5217 --:--:-- --:--:-- --:--:-- 24714
{
  "identifiers": [
    {
      "id": 5
    }
  ],
  "generatedMaps": [
    {
      "id": 5,
      "createdAt": "2022-02-05T07:56:11.148Z",
      "updatedAt": "2022-02-05T07:56:11.148Z"
    }
  ],
  "raw": [
    {
      "id": 5,
      "createdAt": "2022-02-05T07:56:11.148Z",
      "updatedAt": "2022-02-05T07:56:11.148Z"
    }
  ]
}
admin@gw-mac nest-orm-api-main % 
```

# 5. Lint and Format
## (1)yarn lint
```sh
admin@gw-mac nest-orm-api-main % docker-compose exec app-api /bin/bash
root@d1569df7ec85:/usr/src/app# 
root@d1569df7ec85:/usr/src/app# yarn lint
yarn run v1.22.17$ eslint "{src,apps,libs,test}/**/*.ts" --fix
Done in 20.75s.
root@d1569df7ec85:/usr/src/app# 
```

## (2)yarn format
```sh
admin@gw-mac nest-orm-api-main % docker-compose exec app-api /bin/bash
root@d1569df7ec85:/usr/src/app# 
root@d1569df7ec85:/usr/src/app# yarn format
yarn run v1.22.17
$ prettier --write "src/**/*.ts" "test/**/*.ts"
src/app.module.ts 182ms
src/configs/aws.config.ts 6ms
src/dynamo-db/dto/create-dynamo-db-item.dto.ts 4ms
src/dynamo-db/dto/get-dynamo-db-item.dto.ts 5ms
src/dynamo-db/dynamo-db.module.ts 4ms
src/dynamo-db/dynamo-db.service.spec.ts 8ms
src/dynamo-db/dynamo-db.service.ts 12ms
src/main.ts 13ms
src/migrations/1644047378747-CreateUserTable.ts 6ms
src/order/dto/create-order.dto.ts 5ms
src/order/order.controller.spec.ts 9ms
src/order/order.controller.ts 7ms
src/order/order.d.ts 3ms
src/order/order.module.ts 3ms
src/order/order.service.spec.ts 5ms
src/order/order.service.ts 13ms
src/report/dto/export-report.dto.ts 3ms
src/report/report.controller.spec.ts 4ms
src/report/report.controller.ts 5ms
src/report/report.module.ts 3ms
src/report/report.service.spec.ts 4ms
src/report/report.service.ts 23ms
src/report/report.type.ts 3ms
src/s3-file/s3-file.interface.ts 4ms
src/s3-file/s3-file.module.ts 2ms
src/s3-file/s3-file.service.spec.ts 5ms
src/s3-file/s3-file.service.ts 8ms
src/sqs/dto/send-message.dto.ts 3ms
src/sqs/sqs.module.ts 2ms
src/sqs/sqs.service.spec.ts 4ms
src/sqs/sqs.service.ts 3ms
src/status/status.controller.spec.ts 4ms
src/status/status.controller.ts 3ms
src/status/status.module.ts 2ms
src/users/dto/create-user.dto.ts 2ms
src/users/dto/export-user-report.dto.ts 2ms
src/users/dto/update-user.dto.ts 2ms
src/users/entities/user.entity.ts 3ms
src/users/users.controller.spec.ts 46ms
src/users/users.controller.ts 8ms
src/users/users.module.ts 3ms
src/users/users.service.spec.ts 46ms
src/users/users.service.ts 7ms
src/users/users.testdata.ts 1ms
test/app.e2e-spec.ts 4ms
test/modules/test-manager.ts 8ms
test/users.e2e-spec.ts 31ms
Done in 1.69s.
root@d1569df7ec85:/usr/src/app# 
```


# 5. Test

## (1)migratation for test db
```sh
root@d1569df7ec85:/usr/src/app# yarn run migrate:run:test
yarn run v1.22.17
$ yarn typeorm:test migration:run
$ MODE=TEST yarn typeorm migration:run
$ ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = current_schema() AND "table_name" = 'migrations'
query: SELECT * FROM "migrations" "migrations"  ORDER BY "id" DESC
1 migrations are already loaded in the database.
1 migrations were found in the source code.
CreateTableUsers1614142231288 is the last executed migration. It was executed on Wed Feb 24 2021 13:50:31 GMT+0900 (Japan Standard Time).
1 migrations are new migrations that needs to be executed.
query: START TRANSACTION
query: CREATE TABLE "public"."user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "firstNameKana" character varying NOT NULL, "lastNameKana" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_03b91d2b8321aa7ba32257dc321" PRIMARY KEY ("id"))
query: INSERT INTO "migrations"("timestamp", "name") VALUES ($1, $2) -- PARAMETERS: [1644047378747,"CreateUserTable1644047378747"]
Migration CreateUserTable1644047378747 has been executed successfully.
query: COMMIT
Done in 8.44s.
root@d1569df7ec85:/usr/src/app# 
root@d1569df7ec85:/usr/src/app# yarn run migrate:show:test
yarn run v1.22.17
$ yarn typeorm:test migration:show
$ MODE=TEST yarn typeorm migration:show
$ ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:show
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = current_schema() AND "table_name" = 'migrations'
query: SELECT * FROM "migrations" "migrations"  ORDER BY "id" DESC
 [X] CreateUserTable1644047378747
Done in 8.12s.
root@d1569df7ec85:/usr/src/app# 
```


## (2)yarn test
```sh
root@d1569df7ec85:/usr/src/app# yarn test
yarn run v1.22.17
$ MODE=TEST jest --detectOpenHandles
 PASS  src/users/users.service.spec.ts (9.242 s)
 PASS  src/users/users.controller.spec.ts (5.676 s)
 PASS  src/status/status.controller.spec.ts

Test Suites: 3 passed, 3 total
Tests:       34 passed, 34 total
Snapshots:   0 total
Time:        16.321 s
Ran all test suites.
Done in 20.39s.
root@d1569df7ec85:/usr/src/app# 
root@d1569df7ec85:/usr/src/app# yarn test:e2e
yarn run v1.22.17
$ yarn test --config ./test/jest-e2e.json
$ MODE=TEST jest --detectOpenHandles --config ./test/jest-e2e.json
 PASS  test/users.e2e-spec.ts (19.476 s)
 PASS  test/app.e2e-spec.ts (6.869 s)

Test Suites: 2 passed, 2 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        26.691 s
Ran all test suites.
Done in 40.04s.
root@d1569df7ec85:/usr/src/app#  
```