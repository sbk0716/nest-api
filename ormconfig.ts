const dbHostName = process.env.POSTGRES_HOST || 'app-db';
const dbPort = process.env.POSTGRES_PORT || 5432;
const dbUserName = process.env.POSTGRES_USER || 'admin';
const dbPassword = process.env.POSTGRES_PASSWORD || 'dummypassword';
const tsOrJs = process.env.TS_OR_JS || 'ts';
console.info('####################')
console.info(`tsOrJs=${tsOrJs}`)
console.info('####################')
const entities = (tsOrJs === 'ts') ? 'src/**/*.entity.ts' : 'dist/**/*.entity{.ts,.js,.js.map}';
const migrations = (tsOrJs === 'ts') ? 'src/migrations/*{.ts,.js}' : 'dist/src/migrations/*{.ts,.js,.js.map}';
const migrationsDir = (tsOrJs === 'ts') ? 'src/migrations' : 'dist/src/migrations';

let dbName = process.env.DB_NAME || 'coredb';

if (process.env.MODE === 'TEST') {
  dbName = 'testdb'
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
  cli: {
    migrationsDir: migrationsDir,
  },
};

console.info('####################')
console.info(connectionOptions)
console.info('####################')

module.exports = connectionOptions;
