import Database from '../mysql';

const config = {
  host: process.env.DB_HOST_SENSOK,
  port: process.env.DB_PORT_SENSOK,
  user: process.env.DB_USER_SENSOK,
  password: process.env.DB_PASSWORD_SENSOK,
  database: process.env.DB_DATABASE_SENSOK
};

export default async (sql, args) => {
  
  const database = new Database(config);
  const response = await database.query(sql, args);
  await database.close();
  return response;

};