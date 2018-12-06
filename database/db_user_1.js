import Database from '../mysql';

const {
  DB_HOST_1,
  DB_PORT_1,
  DB_USER_1,
  DB_PASSWORD_1,
  DB_DATABASE_1
} = process.env;

const config = {
  host: DB_HOST_1,
  port: DB_PORT_1,
  user: DB_USER_1,
  password: DB_PASSWORD_1,
  database: DB_DATABASE_1
}

const database = new Database(config);

export default async (sql, args) => {

  const response = await database.query(sql, args);

  await database.close();

  return response;

}