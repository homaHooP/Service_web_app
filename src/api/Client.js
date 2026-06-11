import axios from "axios";
import { AuthStorage } from "../helpers/AuthHelper.js";

export const api = axios.create({
    baseURL: "/api"
});

api.interceptors.request.use((config) => {

    const token = AuthStorage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.request.use((config) => {

    console.log(
        "[REQUEST]",
        config.method?.toUpperCase(),
        config.baseURL + config.url
    );

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {

        console.error(
            "[RESPONSE ERROR]",
            error.response?.status,
            error.config?.method?.toUpperCase(),
            error.config?.url
        );

        return Promise.reject(error);
    }
);