import axios, { type AxiosResponse } from "axios";

export const queries = {
  get: (url: string) =>
    axios.get(url).then((response: AxiosResponse) => response.data),
  post: (url: string, body: {}) =>
    axios.post(url, body).then((response: AxiosResponse) => response.data),
  put: (url: string, body: {}) =>
    axios.put(url, body).then((response: AxiosResponse) => response.data),
  delete: (url: string) =>
    axios.delete(url).then((response: AxiosResponse) => response.data),
};
