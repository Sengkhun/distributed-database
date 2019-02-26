import _ from 'lodash';
import casual from 'casual';
import './customCasual';

import { Users } from '../tables';

// import sensok from '../database/sensok';
// import toulkork from '../database/toulkork';
import meanchey from '../database/meanchey';

const id = 4000000;
const length = 500000;
(async () => {
  for(var i = 0; i < length; i++) {
    const fields = {
      user_id: id + i,
      name: casual.name,
      address: casual.address,
      sex: casual.sex,
      card: casual.card,
      balance: casual.integer(1000001, 100000000)
    };
    const sql = await Users.insert(fields);
    await meanchey(sql);
  }
  console.log('Done');
})();

// _.times(length, async idx => {
//   const fields = {
//     user_id: id + idx,
//     name: casual.name,
//     address: casual.address,
//     sex: casual.sex,
//     card: casual.card,
//     balance: casual.integer(500, 100000)
//   };
//   const sql = await Users.insert(fields);
//   await sensok(sql);
// });