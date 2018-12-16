'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {

  db.createTable('users', {
    userId: {
      type: 'int',
      unsigned: true,
      unique: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
      length: 10
    },
    first_name: {
      type: 'string',
      notNull: true,
      length: 100
    },
    last_name: {
      type: 'string',
      notNull: true,
      length: 100
    },
    deleted_at: {
      type: 'datetime'
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    },
    status: {
      type: 'smallint',
      length: 1,
      notNull: true,
      defaultValue: 1
    }
  }, function(err) {
    if (err) {
      console.log("Create users table -> err", err);
      return callback(err);
    }
    return callback();
  });
  
};

exports.down = function(db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};
