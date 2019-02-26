import sql from 'sql-query';

const sqlQuery = sql.Query();

export default class Table {

  constructor(db_name) {
    this.db_name = db_name;
  }

  async findOne(conditions) {

    const sql = sqlQuery
      .select()
      .from(this.db_name)
      .where(conditions)
      .build();

    return sql;

  }

  async find(conditions) {

    const sql = sqlQuery
      .select()
      .from(this.db_name)
      .where(conditions)
      .build();

    return sql;

  }

  async insert(fields) {

    const sql = sqlQuery
      .insert()
      .into(this.db_name)
      .set(fields)
      .build();

    return sql;

  }

  async update(fields, conditions) {

    const sql = sqlQuery
      .update()
      .into(this.db_name)
      .set(fields)
      .where(conditions)
      .build();

    return sql;

  }

};