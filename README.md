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
## (1)poetry run flake8
```sh
admin@gw-mac pg-todoist % docker-compose exec app-api /bin/bash
root@aef0a7ee5af8:/src# 
root@aef0a7ee5af8:/src# poetry run flake8 api db tests
db/client.py:38:11: F541 f-string is missing placeholders
root@aef0a7ee5af8:/src# 
```

## (2)poetry run black
```sh
admin@gw-mac pg-todoist % docker-compose exec app-api /bin/bash
root@aef0a7ee5af8:/src# 
root@aef0a7ee5af8:/src# poetry run black api db tests
All done! ✨ 🍰 ✨
32 files left unchanged.
root@aef0a7ee5af8:/src# 
```


# 5. Test
## (1)set up postgresql
```sh
admin@gw-mac pg-todoist % docker-compose exec app-api /bin/bash
root@c6ea00e01944:/src# python db/pg_client.py
==================================================
1. SELECT datname, datdba, encoding, datcollate, datctype from pg_database
==================================================
(datname, datdba, encoding, datcollate, datctype)
--------------------------------------------------
('postgres', 10, 6, 'C', 'C')
('coredb', 10, 6, 'C', 'C')
('template1', 10, 6, 'C', 'C')
('template0', 10, 6, 'C', 'C')
('testdb', 10, 6, 'C', 'C')
==================================================
==================================================
2. SELECT usename, usesysid, usecreatedb, usesuper, passwd FROM pg_user
==================================================
(usename, usesysid, usecreatedb, usesuper, passwd)
--------------------------------------------------
('admin', 10, True, True, '********')
('root', 16394, False, True, '********')
==================================================
root@c6ea00e01944:/src# 
```

## (2)migratation for test db
```sh
admin@gw-mac pg-todoist % docker-compose exec app-api /bin/bash
root@c6ea00e01944:/src# export ENV=test
root@c6ea00e01944:/src# printenv | grep ENV
ENV=test
root@c6ea00e01944:/src# poetry run alembic current
POSTGRES_DB: testdb
execute run_migrations_online
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
root@c6ea00e01944:/src# 
root@c6ea00e01944:/src# poetry run alembic upgrade head
POSTGRES_DB: testdb
execute run_migrations_online
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> e5cc805f99e4, 1_create_tasks_and_dones_table
INFO  [alembic.runtime.migration] Running upgrade e5cc805f99e4 -> b430a6422cda, 2_add_status_type_column
root@c6ea00e01944:/src# 
root@c6ea00e01944:/src# poetry run alembic current
POSTGRES_DB: testdb
execute run_migrations_online
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
b430a6422cda (head)
root@c6ea00e01944:/src# 
```

## (3)poetry run pytest
```sh
root@c6ea00e01944:/src# poetry run pytest -v --cov=.
========================================== test session starts ==========================================
platform linux -- Python 3.9.9, pytest-6.2.5, py-1.11.0, pluggy-1.0.0 -- /src/.venv/bin/python
cachedir: .pytest_cache
rootdir: /src, configfile: pyproject.toml, testpaths: tests
plugins: anyio-3.4.0, asyncio-0.16.0, cov-3.0.0
collected 6 items                                                                                       

tests/test_dones.py::TestCrudDones::test_done_flag PASSED                                         [ 16%]
tests/test_health.py::TestHealth::test_health_check PASSED                                        [ 33%]
tests/test_tasks.py::TestCrudTasks::test_create_task_and_read_task PASSED                         [ 50%]
tests/test_tasks.py::TestCrudTasks::test_create_task_and_update_task PASSED                       [ 66%]
tests/test_tasks.py::TestCrudTasks::test_create_task_and_delete_task PASSED                       [ 83%]
tests/test_tasks.py::TestCrudTasks::test_create_all_task_and_read_all_task PASSED                 [100%]

----------- coverage: platform linux, python 3.9.9-final-0 -----------
Name                                         Stmts   Miss  Cover
----------------------------------------------------------------
api/__init__.py                                  0      0   100%
api/core/__init__.py                             0      0   100%
api/core/environ.py                             18      1    94%
api/core/logging.py                              3      0   100%
api/dependencies/__init__.py                     0      0   100%
api/dependencies/db.py                          12      0   100%
api/domain/__init__.py                           0      0   100%
api/domain/models/__init__.py                    0      0   100%
api/domain/models/task.py                       23      0   100%
api/infra/__init__.py                            0      0   100%
api/infra/db/__init__.py                         0      0   100%
api/infra/db/connection.py                      25     12    52%
api/infra/routers/__init__.py                    8      0   100%
api/infra/routers/dones.py                      27      4    85%
api/infra/routers/health.py                      6      0   100%
api/infra/routers/tasks.py                      34      4    88%
api/interfaces/__init__.py                       0      0   100%
api/interfaces/db/__init__.py                    0      0   100%
api/interfaces/db/queries/__init__.py            0      0   100%
api/interfaces/db/queries/dones.py               3      0   100%
api/interfaces/db/queries/tasks.py               6      0   100%
api/interfaces/db/repositories/__init__.py       0      0   100%
api/interfaces/db/repositories/base.py           4      0   100%
api/interfaces/db/repositories/dones.py         49     15    69%
api/interfaces/db/repositories/tasks.py        107     35    67%
api/interfaces/schemas/__init__.py               0      0   100%
api/interfaces/schemas/done.py                  17      0   100%
api/interfaces/schemas/task.py                  33      0   100%
api/main.py                                     15      2    87%
tests/__init__.py                                0      0   100%
tests/conftest.py                               39     10    74%
tests/test_dones.py                             21      0   100%
tests/test_health.py                            11      0   100%
tests/test_tasks.py                             99      0   100%
----------------------------------------------------------------
TOTAL                                          560     83    85%


========================================== 6 passed in 27.76s ===========================================
root@c6ea00e01944:/src# 
```