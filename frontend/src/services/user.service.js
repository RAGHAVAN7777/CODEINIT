import api from "./api";

export const userService = {
    getAllStudents: async () => {
        const response = await api.get("/users");
        return response.data;
    },

    getMe: async () => {
        const response = await api.get("/users/me");
        return response.data;
    }
};
