import api from "./api";

export const authService = {
    login: async (email, password, role) => {
        const response = await api.post("/auth/login", { email, password, role });
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post("/auth/register", userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem("user");
    }
};
