import { toulkork, sensok } from '../database';

export const query = async (sql) => {

  const tk = await toulkork(sql);
  const ss = await sensok(sql);

  return [ ...tk, ...ss ];

};