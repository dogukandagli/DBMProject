import axios, { AxiosError, type AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { store } from "../../app/store/store";
import { refreshToken } from "../../features/auth/store/AuthSlice";

export const apiUrl = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = apiUrl;

axios.defaults.withCredentials = true;
axios.interceptors.request.use((request) => {
  const token = store.getState().auth?.token;
  if (token) request.headers.Authorization = `Bearer ${token}`;

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
  async (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse<ApiResponse>;
    if (!data.isSuccessful) {
      if (Array.isArray(data.errorMessages) && data.errorMessages.length > 0) {
        data.errorMessages.forEach((message: string) => {
          toast.error(message);
        });
      }
    }
    const originalRequest = error.config;

    if (status === 401 && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;

      const result = await store.dispatch(refreshToken());

      if (result.meta.requestStatus == "fulfilled") {
        const token = store.getState().auth.token;
        originalRequest!.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest!);
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
