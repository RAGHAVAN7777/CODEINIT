import api from "./api";

export const noteService = {
    createNote: async (noteData) => {
        const isFormData = typeof FormData !== "undefined" && noteData instanceof FormData;
        const response = await api.post("/notes", noteData, isFormData ? {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        } : undefined);
        return response.data;
    },

    getNotes: async () => {
        const response = await api.get("/notes");
        return response.data;
    },

    getNote: async (noteId) => {
        const response = await api.get(`/notes/${noteId}`);
        return response.data;
    },

    updateNote: async (noteId, noteData) => {
        const isFormData = typeof FormData !== "undefined" && noteData instanceof FormData;
        const response = await api.put(`/notes/${noteId}`, noteData, isFormData ? {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        } : undefined);
        return response.data;
    },

    deleteNote: async (noteId) => {
        const response = await api.delete(`/notes/${noteId}`);
        return response.data;
    }
};
