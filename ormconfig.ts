const dbHostName = process.env.POSTGRES_HOST || 'app-db';
const dbPort = process.env.POSTGRES_PORT || 5432;
const dbUserName = process.env.POSTGRES_USER || 'admin';
const dbPassword = process.env.POSTGRES_PASSWORD || 'dummypassword';
let dbName = process.env.DB_NAME || 'coredb';
let entities = 'dist/**/*.entity{.ts,.js,.js.map}';
const migrations = 'dist/src/migrations/*{.ts,.js,.js.map}';
if (process.env.MODE === 'TEST') {
  dbName = 'testdb';
  entities = 'src/**/*.entity.ts';
}

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

// console.info('####################');
// console.info(connectionOptions);
// console.info('####################');
module.exports = connectionOptions;
