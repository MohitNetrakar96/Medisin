import express from 'express';
import { contactUs } from '../controllers/contactController.js';

const router = express.Router();

// Contact route
router.post('/contact', contactUs);

export default router; 