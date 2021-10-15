import server from './server';
import { defaultHeaders } from '../utils/axiosConfig';
import setAuthToken from '../utils/setAuthToken';
import { refreshTokenKey } from '../common/CommonValues';

/**
 * @param {{ access_token: string, expires_in: number, refresh_token: string }} tokenObj
 * @param {function} onExpiry
 * @param {function} type 'local', 'zoom'
 */
export function storeToken(tokenObj, onExpiry, type) {
  const accessToken = tokenObj.access_token;
  setAuthToken(accessToken || null, type);
  if (tokenObj.expires_in) setTimeout(onExpiry, tokenObj.expires_in * 1000);
  localStorage.setItem(refreshTokenKey, tokenObj.refresh_token);
}

export const login = async (email, password) => {
  try {
    const body = {
      email,
      password,
    };
    const res = await server.post('auth/login', body, defaultHeaders);
    const data = res.data;
    // set token in the axios instance
    storeToken(data, refresh, 'local');
    return true;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

export const refresh = async () => {
  const refToken = localStorage.getItem(refreshTokenKey);
  if (!refToken) {
    throw Error('No refresh token');
  }
  try {
    const res = await server.post(`auth/refresh`, null, {
      params: {
        refresh_token: refToken,
        grant_type: 'refresh_token',
      },
    });
    const data = res.data;
    storeToken(data, refresh, 'local');
    return true;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

export const zoomLogin = async (code) => {
  const res = await server.post(`auth/zoom/login`, null, {
    params: { code },
  });
  const data = res.data;
  storeToken(data, zoomRefresh, 'zoom');
  return true;
};

export const zoomRefresh = async () => {
  const refToken = localStorage.getItem(refreshTokenKey);
  if (!refToken) {
    throw Error('No refresh token');
  }
  try {
    const res = await server.post(`auth/zoom/refresh`, null, {
      params: {
        refresh_token: refToken,
      },
    });
    const data = res.data;
    storeToken(data, zoomRefresh, 'zoom');
    return true;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
