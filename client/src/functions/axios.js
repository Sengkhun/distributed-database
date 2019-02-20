import axios from 'axios';
import { store } from '../App';

// args = { method, url, data, headers }
export default async function(args) {

  const {
    method,
    url,
    data,
    headers
  } = args;

  const authorization = await store.getState().AuthReducer.userToken;

  const response = await axios({
    method: method || 'get',
    url,
    data,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authorization,
      ...headers
    }
  });

  return response.data;
};