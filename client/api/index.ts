import axios from 'axios';
import { server } from '../environments';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '../models/user.model';

const token_key = 'android_app_token';
const user_key = 'android_app_user';
export const getToken = async () => await AsyncStorage.getItem(token_key);
export const setToken = async (token: string) => await AsyncStorage.setItem(token_key, token);
export const getUser = async () =>{
  const _user = await AsyncStorage.getItem(user_key);
  if(_user){
    return JSON.parse(_user) as IUser;
  }
  return undefined;
}
export const setUser = async (user: IUser) => await AsyncStorage.setItem(user_key, JSON.stringify(user));

export const removeToken = async () => await AsyncStorage.removeItem(token_key);
export const removeUser = async () => await AsyncStorage.removeItem(user_key);

const headers = async () => ({
  Authorization: `Bearer ${await getToken()}`,
  Accept: '*/*',
});

export default {
  get: async <T>(path: string, params?: { [key: string]: any }) => {
    const _path = path[0] === '/' ? path.substring(1) : path;
    return await axios.get<T>(
      server.url + '/' + _path + (params ? '?' + _paramSerializer(params) : ''),
      { headers: await headers() }
    );
  },

  // post: async <T>(path: string, params?: { [key: string]: any }) => {
  //   const _path = path[0] === '/' ? path.substring(1) : path;
  //   return await axios.post<T>(
  //     server.url + '/' + _path + (params ? '?' + _paramSerializer(params) : ''),
  //     { headers: headers() }
  //   );
  // },

  post: async <T>(path: string, body?: { [key: string]: any }) => {
    const _path = path[0] === '/' ? path.substring(1) : path;
    return await axios.post<T>(server.url + '/' + _path, body, {
      headers: await headers(),
    });
  },

  delete: async <T>(path: string, params?: { [key: string]: any }) => {
    const _path = path[0] === '/' ? path.substring(1) : path;
    return await axios.delete<T>(
      server.url + '/' + _path + (params ? '?' + _paramSerializer(params) : ''),
      { headers: await headers() }
    );
  },
};

function _paramSerializer(paramObject?: { [key: string]: any }) {
  if (!paramObject) {
    return '';
  }
  const keys = Object.keys(paramObject);
  if (keys.length === 0) {
    return '';
  }
  return keys
    .map((key) => {
      return `${key}=${paramObject[key]}`;
    })
    .join('&');
}
