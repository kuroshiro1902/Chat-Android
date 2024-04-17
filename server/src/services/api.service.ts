import axios from 'axios';
import env from '../env';

const apiService = {
  get: async <T>(path: string, params?: { [key: string]: any }) => {
    const _path = path[0] === '/' ? path.substring(1) : path;
    return await axios.get<T>(env.DB_URL + '/' + _path + (params ? '?' + _paramSerializer(params) : ''));
  },

  // post: async <T>(path: string, params?: { [key: string]: any }) => {
  //   const _path = path[0] === '/' ? path.substring(1) : path;
  //   return await axios.post<T>(
  //     env.DB_URL + '/' + _path + (params ? '?' + _paramSerializer(params) : ''),
  //
  //   );
  // },

  post: async <T>(path: string, body?: { [key: string]: any }) => {
    const _path = path[0] === '/' ? path.substring(1) : path;
    return await axios.post<T>(env.DB_URL + '/' + _path, body);
  },

  delete: async <T>(path: string, params?: { [key: string]: any }) => {
    const _path = path[0] === '/' ? path.substring(1) : path;
    return await axios.delete<T>(env.DB_URL + '/' + _path + (params ? '?' + _paramSerializer(params) : ''));
  },
  update: async <T>(path: string, data: T) => {
    const _path = path[0] === '/' ? path.substring(1) : path;
    return await axios.patch<T>(env.DB_URL + '/' + _path, data);
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
      if (Array.isArray(paramObject[key])) {
        // Map mỗi phần tử trong mảng thành một chuỗi key=value và join bằng dấu ","
        return paramObject[key].map((value: any) => `${key}=${value}`).join('&');
      }
      return `${key}=${paramObject[key]}`;
    })
    .join('&');
}

export default apiService;
