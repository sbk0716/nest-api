const nodeEnv = process.env.NODE_ENV || 'development';
console.info('process.env.NODE_ENV= ', nodeEnv);
const dbHostName = process.env.POSTGRES_HOST || 'app-db';
const dbPort = process.env.POSTGRES_PORT || 5432;
const dbUserName = process.env.POSTGRES_USER || 'admin';
const dbPassword = process.env.POSTGRES_PASSWORD || 'dummypassword';
let dbName = process.env.DB_NAME || 'coredb';
let entities = 'dist/**/*.entity{.ts,.js,.js.map}';
let migrations = 'dist/src/migrations/*{.ts,.js,.js.map}';

if (process.env.MODE === 'TEST') {
  dbName = 'testdb';
  entities = 'src/**/*.entity{.ts,.js}';
  migrations = 'src/migrations/*{.ts,.js,.js.map}';
}

// if (nodeEnv === 'development') {
//   entities = 'src/**/*.entity{.ts,.js}';
//   migrations = 'src/migrations/*{.ts,.js,.js.map}';
// }

const connectionOptions = {
  type: 'postgres',
  host: dbHostName,
  port: dbPort,
  username: dbUserName,
  password: dbPassword,
  database: dbName,
  synchronize: false,
  entities: [entities],
  migrations: [migrations],
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

console.info('####################');
console.info(connectionOptions);
console.info('####################');
module.exports = connectionOptions;
