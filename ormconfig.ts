const dbHostName = process.env.DB_HOST_NAME || 'app-db';
const dbPort = process.env.DB_PORT || 5432;
const dbUserName = process.env.DB_USER_NAME || 'admin';
const dbPassword = process.env.DB_PASSWORD || 'dummypassword';
const dbName = process.env.DB_NAME || 'coredb';

const connectionOptions = {
  type: 'postgres',
  host: dbHostName,
  port: dbPort,
  username: dbUserName,
  password: dbPassword,
  database: dbName,
  synchronize: false,
  entities: [
    process.env.MODE === 'TEST'
      ? 'src/**/*.entity.ts'
      : 'dist/**/*.entity{.ts,.js}',
  ],
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

module.exports = connectionOptions;
