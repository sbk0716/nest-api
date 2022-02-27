const SnakeNamingStrategy =
  require('typeorm-naming-strategies').SnakeNamingStrategy; // eslint-disable-line @typescript-eslint/no-var-requires
const nodeEnv = process.env.NODE_ENV || 'development';
console.info('process.env.NODE_ENV= ', nodeEnv);

const dbHostName = process.env.POSTGRES_HOST || 'app-db';
const dbPort = process.env.POSTGRES_PORT || 5432;
const dbUserName = process.env.POSTGRES_USER || 'admin';
const dbPassword = process.env.POSTGRES_PASSWORD || 'dummypassword';
let dbName = process.env.DB_NAME || 'coredb';
/**
 * @todo
 * dist/src/migrations/*{.ts,.js,.js.map}
 * --> dist/migrations/*{.ts,.js,.js.map}
 */
let entities = 'dist/**/*.entity{.ts,.js,.js.map}';
let migrations = 'dist/src/migrations/*{.ts,.js,.js.map}';

if (process.env.MODE === 'TEST') {
  dbName = 'testdb';
  entities = 'src/**/*.entity.ts';
  migrations = 'src/migrations/*.ts';
}

const connectionOptions = {
  type: 'postgres',
  host: dbHostName,
  port: dbPort,
  username: dbUserName,
  password: dbPassword,
  database: dbName,
  logging: true,
  synchronize: false, // Setting `synchronize: true` shouldn't be used in production.
  entities: [entities],
  migrations: [migrations],
  cli: {
    migrationsDir: 'src/migrations', // Directory where the new migration file will be created.
  },
  namingStrategy: new SnakeNamingStrategy(),
};

if (process.env.DB_SECRETS) {
  const raw = process.env.DB_SECRETS;
  const dbSecrets = JSON.parse(raw);
  connectionOptions.host = process.env.DB_ENDPOINT;
  connectionOptions.port = process.env.DB_PORT;
  connectionOptions.username = dbSecrets.dbUserName;
  connectionOptions.password = dbSecrets.dbPassword;
  connectionOptions.database = dbSecrets.dbName;
}

module.exports = connectionOptions;
