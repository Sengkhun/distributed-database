import axios from 'axios';

// args = { method, url, data, headers }
export default async function(args) {

  const {
    method,
    url,
    data,
    headers
  } = args;

  const response = await axios({
    method: method || 'get',
    url,
    data,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    }
  });

  return response.data;
};