import _ from 'lodash';

export const removeLastComma = (value) => {

  const index = value.lastIndexOf(',');
  return value.slice(0, index) + value.slice(index + 1);
  
};

// ----------------------------------------

export const compareArrayElements = (arr1, arr2) => {

  _.forEach(arr2, element => {
    if (arr1[element]) {
      return true;
    }
  });

  return false;

};