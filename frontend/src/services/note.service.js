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

    deleteNote: async (noteId, deleteType = "me") => {
        const response = await api.delete(`/notes/${noteId}`, { params: { type: deleteType } });
        return response.data;
    },

    shareNote: async (noteId, payload) => {
        const response = await api.post(`/notes/${noteId}/share`, typeof payload === 'object' ? payload : { userIds: payload });
        return response.data;
    }
};
