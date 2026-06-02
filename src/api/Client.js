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