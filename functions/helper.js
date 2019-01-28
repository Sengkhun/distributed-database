export const removeLastComma = (value) => {

  const index = value.lastIndexOf(',');
  return value.slice(0, index) + value.slice(index + 1);
  
};