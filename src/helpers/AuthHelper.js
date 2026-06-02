const TOKEN_KEY = "token";
const USER_KEY = "user";

export const AuthStorage={
    save(data) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    },
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },
    getUser() {
        try {
            const user = localStorage.getItem(USER_KEY);

            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    },
    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
}