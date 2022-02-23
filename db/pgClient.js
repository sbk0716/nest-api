const { Client } = require('pg');
const host = process.env.POSTGRES_HOST;
const port = process.env.POSTGRES_PORT;
const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_DB;
const database = process.env.POSTGRES_PASSWORD;

const config = {
  host,
  port,
  user,
  password,
  database,
};
const client = new Client(config);

// CREATE ROLE
const createRole = `CREATE ROLE root LOGIN SUPERUSER PASSWORD '${password}'`;

// ALTER DATABASE
const alterDatabase = `ALTER DATABASE '${database}' SET timezone TO 'Asia/Tokyo';`;

// SHOW DATABASE
const showDatabase =
  'SELECT datname, datdba, encoding, datcollate, datctype from pg_database;';

// SHOW USER
const showUser =
  'SELECT usename, usesysid, usecreatedb, usesuper, passwd FROM pg_user;';

client
  .connect()
  .then(() => console.log('Connected successfuly!!'))
  .then(() => client.query(createRole))
  .then(() => client.query(alterDatabase))
  .then(() => client.query(showDatabase))
  .then(() => client.query('SELECT * FROM pg_user;'))
  .then((results) => {
    console.table(results.rows);
  })
  .then(() => client.query(showUser))
  .then((results) => console.table(results.rows))
  .catch((e) => console.log(e))
  .finally(() => client.end());
