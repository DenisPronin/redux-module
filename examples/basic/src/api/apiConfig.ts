import axios, { AxiosRequestConfig } from 'axios';

export const apiUrl = 'https://api.github.com';

const queryInstance = axios.create({
  baseURL: apiUrl
});

// queryInstance.interceptors.response.use(
//   (response: AxiosResponse) => response.data
// );


export const queryGet = function (url: string, config: AxiosRequestConfig = {}): Promise<any> {
  return queryInstance.get(url, config);
};
