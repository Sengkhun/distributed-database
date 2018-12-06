import Database from '../mysql';

const {
  DB_HOST_2,
  DB_PORT_2,
  DB_USER_2,
  DB_PASSWORD_2,
  DB_DATABASE_2
} = process.env;

const config = {
  host: DB_HOST_2,
  port: DB_PORT_2,
  user: DB_USER_2,
  password: DB_PASSWORD_2,
  database: DB_DATABASE_2
}

const database = new Database(config);

export default async (sql, args) => {

  const response = await database.query(sql, args);

  await database.close();

  return response;

}