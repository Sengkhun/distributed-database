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
    user_id: {
      type: 'int',
      unsigned: true,
      unique: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true,
      length: 10
    },
    name: {
      type: 'string',
      notNull: true,
      length: 100
    },
    address: {
      type: 'string',
      notNull: true,
      length: 100
    },
    sex: {
      type: 'string',
      notNull: true,
      length: 100
    },
    card: {
      type: 'string',
      notNull: true,
      length: 100
    },
    balance: {
      type: 'string',
      notNull: true,
      length: 100
    }
  }, function(err) {
    if (err) {
      console.log("Create user table -> err", err);
      return callback(err);
    }
    return callback();
  });

};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
