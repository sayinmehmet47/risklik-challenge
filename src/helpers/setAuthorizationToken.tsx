import axios from 'axios';

export const setAuthorizationToken = (token = 'ZWxhc3RpYzpjb3ZpZDE5') => {
  console.log(token);
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Basic ${token}`;
  } else delete axios.defaults.headers.common['Authorization'];
};
