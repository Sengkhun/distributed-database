import sensok from '../database/sensok';
import toulkork from '../database/toulkork';

export const query = async (sql) => {

  const tk = await toulkork(sql);
  const ss = await sensok(sql);

  return [ ...tk, ...ss ];

};