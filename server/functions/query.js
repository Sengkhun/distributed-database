import _ from 'lodash';
import check from 'check-types';
import Stopwatch from 'timer-stopwatch';

import data from '../database/data';
import sensok from '../database/sensok';
import toulkork from '../database/toulkork';
import meanchey from '../database/meanchey';

// ----------------------------------------

const QUERY_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'LIMIT'];

// ----------------------------------------

export const queryOptimization = async (fragmentation, sql) => {
  
  // start time
  const timer = new Stopwatch();
  timer.start();

  // find key words
  const splitQuery = await querySplitter(sql);

  // generate query
  const toulkorkQuery = await queryGenerator(fragmentation, 'toulkork', splitQuery);
  const sensokQuery = await queryGenerator(fragmentation, 'sensok', splitQuery);
  const meancheyQuery = await queryGenerator(fragmentation, 'meanchey', splitQuery);

  const rawData = await Promise.all([
    toulkorkQuery && toulkork(toulkorkQuery),
    sensokQuery && sensok(sensokQuery),
    meancheyQuery && meanchey(meancheyQuery)
  ]);

  let results = [];
  if (fragmentation === 'vertical') {
    const tableName = splitQuery.FROM;
    const tableAttributes = data['sensok'][tableName];
    const primaryKey = tableAttributes && tableAttributes[0];
    results = await verticalJoin(rawData, primaryKey);

  } else if (fragmentation === 'horizontal') {
    results = await horizontalJoin(rawData);
  }
  
  const executedTime = timer.ms;

  return { results, executedTime };

};

// ----------------------------------------

export const querySplitter = async sql => {

  let listIndex = [];
  let splitQuery = {};

  _.forEach(QUERY_KEYWORDS, key => {
    const temp = sql.indexOf(key);
    if (temp !== -1) {
      listIndex.push(temp);
    }
  });

  listIndex = _.sortedUniq(listIndex);

  let end = null;
  const length = listIndex.length - 1;

  _.forEach(listIndex, (start, idx) => {
    
    if (idx < length)
      end = listIndex[idx + 1];
    else
      end = sql.length;

    const result = sql.substring(start, end);
    const spaceIndex = result.indexOf(' ');
    const key = result.substring(0, spaceIndex).trim();
    const value = result.substring(spaceIndex).trim();

    switch(key) {
      case 'SELECT':
        splitQuery[key] = value.split(/[ ,]+/);
        break;

      case 'FROM':
      case 'LIMIT':
        splitQuery[key] = value;
        break;

      case 'WHERE':
        splitQuery[key] = value;
        break;

    }

  });

  return splitQuery;

};

// ----------------------------------------

export const queryGenerator = async (fragmentation, databaseName, splitQuery) => {

  let query = '';

  try {

    // check if table exist
    const tableName = splitQuery.FROM;
    const tableAttributes = data[databaseName][tableName];
    if (!tableAttributes) {
      throw "No table name exist";
    }

    _.forEach(splitQuery, (item, key) => {
      switch(key) {
        
        case 'SELECT':
          // start generate query
          query += 'SELECT ';
          if (item.includes('*')) {
            query += '* ';

          } else {
            const attributes = [];

            if (fragmentation === 'vertical') {
              const primaryKey = tableAttributes[0];
              _.forEach(item, columnName => {
                if (tableAttributes.includes(columnName)) {
                  if (primaryKey !== columnName) {
                    attributes.push(columnName);
                  }
                }
              });

            } else if (fragmentation === 'horizontal') {
              // no work yet
              _.forEach(item, columnName => {
                if (tableAttributes.includes(columnName)) {
                  attributes.push(columnName);
                }
              });
            }

            if (check.emptyArray(attributes)) {
              throw 'No attribute matched';
            } else {
              if (fragmentation === 'vertical') {
                // push primary key
                attributes.unshift(tableAttributes[0]);
              }
            }
            query += _.join(attributes, ', ') + ' ';
          }
          break;
  
        case 'FROM':
        case 'LIMIT':
          query += `${key} ${item} `;
          break;

        case 'WHERE':
          const values = item.split(' ');
          if (values[0] === tableAttributes[1]) {
            const operator = values[1];
            const condition = values[2];
            const min = tableAttributes[2];
            const max = tableAttributes[3];
            
            switch(operator) {
              case '<':
                if (min >= condition) {
                  throw 'Condition not match';
                }
                break;

              case '>':
                if (max <= condition) {
                  throw 'Condition not match';
                }
                break;

              case '=':
                if (!(min <= condition && max >= condition)) {
                  throw 'Condition not match';
                }
                break;
            }

          }
          query += `WHERE ${item} `;
          break;

      }
    });
    
    return query;

  } catch (error) {
    console.log('* : queryGenerator -> error', error);
    return '';
  }

};

// ----------------------------------------

export const verticalJoin = async (array, key) => {

  let index = 0;
  const { length } = array;

  while (index < length) {
    const nextArray = array[index + 1];
    if (!nextArray) break;

    _.forEach(array[0], item => {
      const matchedIndex = _.findIndex(nextArray, [key, item[key]]);
      _.extend(item, nextArray[matchedIndex]);
      _.pullAt(nextArray, matchedIndex);
    });
    index++;
  }
  
  return array[0];
};

// ----------------------------------------

export const horizontalJoin = async array => {

  let results = [];
  const { length } = array;

  if (length === 1) {
    results = array[0];

  } else if (length > 1) {
    _.forEach(array, values => {
      results = [ ...results, ...values ];
    });
  }

  return _.sortBy(results, 'user_id');
  
};

// ----------------------------------------

export const query = async (fragmentation, sql) => {

  const timer = new Stopwatch();
  timer.start();

  const rawData = await Promise.all([
    sensok(sql), 
    toulkork(sql),
    meanchey(sql)
  ]);

  let results = [];
  if (fragmentation === 'vertical') {
    results = await verticalJoin(rawData, 'id');
  } else if (fragmentation === 'horizontal') {
    results = await horizontalJoin(rawData);
  }
  
  const executedTime = timer.ms;

  return { results, executedTime };

};