import api from './api';

export const announcementService = {
    getAnnouncements: async () => {
        const response = await api.get('/announcements');
        return response.data;
    },
    createAnnouncement: async (data) => {
        const response = await api.post('/announcements', data);
        return response.data;
    }
};

export const notificationService = {
    getNotifications: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },
    markAllRead: async () => {
        const response = await api.put('/notifications/read');
        return response.data;
    },
    deleteNotification: async (id) => {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    }
};
