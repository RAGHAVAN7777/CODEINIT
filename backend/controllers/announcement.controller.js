import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';
import Class from '../models/Class.js';
import User from '../models/User.js';

// 🟢 CREATE ANNOUNCEMENT
export const createAnnouncement = async (req, res) => {
    try {
        const { title, content, class_id, type } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Title and content are required" });
        }

        const announcement = await Announcement.create({
            title,
            content,
            author: req.user._id,
            class_id: class_id || null,
            type: type || 'general'
        });

        // Create notifications for all relevant users
        let recipients = [];
        if (class_id) {
            const classData = await Class.findById(class_id);
            if (classData) {
                // Students in class + Faculty who owns the class (if not the author)
                recipients = [...classData.students];
                if (!classData.faculty_id.equals(req.user._id)) {
                    recipients.push(classData.faculty_id);
                }
            }
        } else {
            // Global announcement: all users
            const allUsers = await User.find({ _id: { $ne: req.user._id } }).select('_id');
            recipients = allUsers.map(u => u._id);
        }

        const notifications = recipients.map(userId => ({
            recipient: userId,
            sender: req.user._id,
            title: `Announcement: ${title}`,
            message: content.substring(0, 100) + '...',
            type: 'announcement'
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🟢 GET ANNOUNCEMENTS (Global + Classes user is in)
export const getAnnouncements = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'faculty') {
            const classes = await Class.find({ faculty_id: req.user._id }).select('_id');
            const classIds = classes.map(c => c._id);
            query = {
                $or: [
                    { class_id: null },
                    { class_id: { $in: classIds } }
                ]
            };
        } else {
            query = {
                $or: [
                    { class_id: null },
                    { class_id: { $in: req.user.classes } }
                ]
            };
        }

        const announcements = await Announcement.find(query)
            .populate('author', 'name role')
            .sort({ createdAt: -1 });

        res.json(announcements);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
