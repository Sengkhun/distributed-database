import sql from 'sql-query';

const sqlQuery = sql.Query();
const sqlSelect = sqlQuery.select();
const sqlInsert = sqlQuery.insert();
const sqlUpdate = sqlQuery.update();

export {
  sqlQuery,
  sqlSelect,
  sqlInsert,
  sqlUpdate
}