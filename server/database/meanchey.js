import Database from '../mysql';

const config = {
  host: process.env.DB_HOST_MEANCHEY,
  port: process.env.DB_PORT_MEANCHEY,
  user: process.env.DB_USER_MEANCHEY,
  password: process.env.DB_PASSWORD_MEANCHEY,
  database: process.env.DB_DATABASE_MEANCHEY
};

export default async (sql, args) => {
  
  const database = new Database(config);
  const response = await database.query(sql, args);
  await database.close();
  return response;

};