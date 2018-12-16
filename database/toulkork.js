import Database from '../mysql';

const config = {
  host: process.env.DB_HOST_TOULKORK,
  port: process.env.DB_PORT_TOULKORK,
  user: process.env.DB_USER_TOULKORK,
  password: process.env.DB_PASSWORD_TOULKORK,
  database: process.env.DB_DATABASE_TOULKORK
};

export default async (sql, args) => {
  
  const database = new Database(config);
  const response = await database.query(sql, args);
  await database.close();
  return response;

};
