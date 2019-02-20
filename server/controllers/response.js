import check from 'check-types';

export default async function(res, resData) {

  const { status, message, data } = resData || {};
  const type = check.array(data) ? 1 : 0;

  await res.json({
    status: status || 200, 
    message: message || "Success", 
    data: data || null, 
    type
  });

};
