import express from 'express';
import { createAnnouncement, getAnnouncements } from '../controllers/announcement.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createAnnouncement);
router.get('/', protect, getAnnouncements);

export default router;
