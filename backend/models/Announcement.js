import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        default: null // null means Global Announcement
    },
    type: {
        type: String,
        enum: ['general', 'exam', 'assignment', 'emergency'],
        default: 'general'
    }
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
