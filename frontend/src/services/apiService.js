import axios from "axios";
import { Subject } from "rxjs";
import { JWT_TOKEN, getCookie, removeCookie } from "./cookieService";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const ApiService = (() => {
  let instance = null;

  function createInstance() {
    const loadingSubject = new Subject();

    const client = axios.create({
      baseURL: API_URL,
    });

    client.interceptors.request.use((config) => {
      loadingSubject.next(true);

      const token = getCookie(JWT_TOKEN);
       ("ATTACHING TOKEN:", token);
      if (token && token !== "undefined") {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    client.interceptors.response.use(
      (response) => {
        loadingSubject.next(false);
        return response;
      },
      (error) => {
        loadingSubject.next(false);

        if (error.response?.status === 401) {
          console.warn("401 detected – clearing auth only");
          // removeCookie(JWT_TOKEN);
          // ❌ NO redirect here
        }

        return Promise.reject(error);
      }
    );

    return { client, loading$ : loadingSubject.asObservable() };
  }

  return () => {
    if (!instance) instance = createInstance();
    return instance;
  };
})();

export default ApiService;
