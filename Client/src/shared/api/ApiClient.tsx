import axios, { Axios, AxiosError, type AxiosResponse } from "axios";
import { toast } from "react-toastify";

export const apiUrl = "http://localhost:5211/";

axios.defaults.baseURL = apiUrl;
axios.defaults.withCredentials = true;
axios.interceptors.request.use((request) => {
  //token i alip buraya eklicez
  return request;
});

axios.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data.isSuccessful) {
      toast.success(data.data);
    }
    return response;
  },
  (error: AxiosError) => {
    const { data } = error.response as AxiosResponse<ApiResponse>;
    if (!data.isSuccessful) {
      if (Array.isArray(data.errorMessages) && data.errorMessages.length > 0) {
        data.errorMessages.forEach((message: string) => {
          toast.error(message);
        });
      } else {
        toast.error("Bilinmeyen hata");
      }
    }
    return Promise.reject(error.response);
  }
);

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

export interface ApiResponse {
  data?: string;
  errorMessages?: string[];
  isSuccessful: boolean;
  statusCode: number;
}
