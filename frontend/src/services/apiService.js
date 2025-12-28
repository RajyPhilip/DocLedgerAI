import axios, { AxiosInstance } from "axios";
import { JWT_TOKEN, getCookie } from "./cookieService";
import { Subject } from "rxjs";

const API_URL = process.env.REACT_APP_API_BASE_URL;

// Created a Singleton Api Service class all apis intercepted here to connect to backend
const ApiService = (() => {
  let instance;

  function createInstance() {
    const loadingSubject = new Subject();
    const customApiService = axios.create({
      baseURL: API_URL,
    });
    customApiService.interceptors.request.use((config) => {
      loadingSubject.next(true);
      config.headers["Authorization"] = `Bearer ${getCookie(JWT_TOKEN)}`;
      return config;
    });
    customApiService.interceptors.response.use(
      (response) => {
        loadingSubject.next(false);
        return response;
      },
      (error) => {
        loadingSubject.next(false);
        return Promise.reject(error);
      },
    );
    return {
      loadingSubject,
      client: customApiService,
    };
  }

  return () => {
    if (!instance) {
      instance = createInstance();
    }
    return instance;
  };
})();

export default ApiService;