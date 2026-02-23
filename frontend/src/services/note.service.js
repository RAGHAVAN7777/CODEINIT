import api from "./api";

export const noteService = {
    createNote: async (noteData) => {
        const response = await api.post("/notes", noteData);
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
        const response = await api.put(`/notes/${noteId}`, noteData);
        return response.data;
    },

    deleteNote: async (noteId) => {
        const response = await api.delete(`/notes/${noteId}`);
        return response.data;
    }
};
