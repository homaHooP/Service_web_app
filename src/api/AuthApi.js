import axios from "axios";

export async function login(data) {
    return await axios.post("/api/auth/login", data);
}