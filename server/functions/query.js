import _ from 'lodash';
import moment from 'moment';
import Stopwatch from 'timer-stopwatch';

import data from '../database/data';
import sensok from '../database/sensok';
import toulkork from '../database/toulkork';

import { removeLastComma } from './helper';

const QUERY_KEYWORDS = ['SELECT', 'FROM', 'LIMIT', 'WHERE'];

export const queryOptimization = async sql => {
  
  let sensokQuery = '';
  const result = await querySplitter(sql);

  // handle sensok db
  _.forEach(result, (item, key) => {
    switch(key) {
      
      case 'SELECT':
        const tableName = result.FROM;
        sensokQuery += 'SELECT ';
        _.forEach(item, value => {
          const isExist = data.sensok[`${tableName}`].includes(value);
          if (isExist || value === '*') {
            sensokQuery += `${value}, `;
          }
        });
        sensokQuery = removeLastComma(sensokQuery);
        break;

      case 'FROM':
        sensokQuery += `FROM ${result.FROM} `;
        break;

      case 'LIMIT':
        sensokQuery += `LIMIT ${result.LIMIT} `;
        break;
    }
  });

  let toulkorkQuery = '';
  _.forEach(result, (item, key) => {
    switch(key) {
      
      case 'SELECT':
        const tableName = result.FROM;
        toulkorkQuery += 'SELECT ';
        _.forEach(item, value => {
          const isExist = data.toulkork[`${tableName}`].includes(value);
          if (isExist || value === '*') {
            toulkorkQuery += `${value}, `;
          }
        });
        toulkorkQuery = removeLastComma(toulkorkQuery);
        break;

      case 'FROM':
        toulkorkQuery += `FROM ${result.FROM} `;
        break;

      case 'LIMIT':
        toulkorkQuery += `LIMIT ${result.LIMIT} `;
        break;
    }
  });

  const timer = new Stopwatch();
  timer.start();

  // const ss = await sensok(sensokQuery);
  // const tk = await toulkork(toulkorkQuery);

  const rawData = await Promise.all([
    sensok(sensokQuery), 
    toulkork(toulkorkQuery)
  ]);
  // const ss = results[0];
  // const tk = results[1];

  // timer.stop();
  // const queryTime = moment(timer.ms).format('s.S');
  // timer.reset();
  
  // timer.start();
  // let merged = _.map(ss, data => {
  //   const index = _.findIndex(tk, ['id', data.id]);
  //   const result = { ...data, ...tk[index] };
  //   _.pullAt(tk, index);
  //   return result;
  // });

  const results = await join(rawData, 'id');

  // timer.stop();
  // const joinTime = moment(timer.ms).format('s.S');
	// console.log('* : joinTime', joinTime);
  // timer.reset();

  const executedTime = timer.ms;

  return { results, executedTime };

};

export const querySplitter = async sql => {

  let listIndex = [];
  let data = {};

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
        data['SELECT'] = value.split(/[ ,]+/);
        break;

      case 'FROM':
        data['FROM'] = value;
        break;

      case 'LIMIT':
        data['LIMIT'] = value;
        break;
    }

  });

  return data;

};

export const join = async (data, key) => {

  let index = 0;
  const { length } = data;

  while (index < length) {
    const nextData = data[index + 1];
    if (!nextData) break;

    _.forEach(data[0], item => {
      const matchedIndex = _.findIndex(nextData, [key, item[key]]);
      _.extend(item, nextData[matchedIndex]);
      _.pullAt(nextData, matchedIndex);
    });
    index++;
  }
  
  return data[0];
};

export const query = async (sql) => {

  const timer = new Stopwatch();
  timer.start();

  const rawData = await Promise.all([
    sensok(sql), 
    toulkork(sql)
  ]);
  // const tk = await toulkork(sql);
  // const ss = await sensok(sql);

  const results = await join(rawData, 'id');

  const executedTime = timer.ms;

  return { results, executedTime };

  // // merge result
  // const merged = [];

  // _.forEach(ss, (item, idx) => {
  //   const index = _.findIndex(tk, { 'id': item.id });
  //   if (index !== -1) {
  //     merged.push({ ...item, ...tk[index] });
  //     delete tk[index];
  //   }
  // });

  // // if there are still element left in tk
  // _.forEach(tk, item => {
  //   if (item) {
  //     merged.push(item);
  //   }
  // });

  // return _.sortBy(merged, ['id']);

  // return [ ...tk, ...ss ];

};