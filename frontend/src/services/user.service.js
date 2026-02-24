import api from "./api";

export const userService = {
    getAllStudents: async () => {
        const response = await api.get("/users");
        return response.data;
    },

    getMe: async () => {
        const response = await api.get("/users/me");
        return response.data;
    },

    getStudentDossier: async (id) => {
        const response = await api.get(`/users/${id}/dossier`);
        return response.data;
    },

    revokeStudent: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};
