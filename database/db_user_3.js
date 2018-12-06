import Database from '../mysql';

const {
  DB_HOST_3,
  DB_PORT_3,
  DB_USER_3,
  DB_PASSWORD_3,
  DB_DATABASE_3
} = process.env;

const config = {
  host: DB_HOST_3,
  port: DB_PORT_3,
  user: DB_USER_3,
  password: DB_PASSWORD_3,
  database: DB_DATABASE_3
}

const database = new Database(config);

export default async (sql, args) => {

  const response = await database.query(sql, args);

  await database.close();

  return response;

}