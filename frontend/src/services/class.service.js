import api from "./api";

export const classService = {
    createClass: async (className) => {
        const response = await api.post("/classes", { class_name: className });
        return response.data;
    },

    getMyClasses: async () => {
        const response = await api.get("/classes");
        return response.data;
    },

    joinClass: async (classCode) => {
        const response = await api.post("/classes/join", { class_code: classCode });
        return response.data;
    },

    getClassDetails: async (classId) => {
        const response = await api.get(`/classes/${classId}`);
        return response.data;
    }
};
