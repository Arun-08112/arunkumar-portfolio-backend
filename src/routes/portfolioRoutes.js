import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { submitContact } from '../controllers/contactController.js';
import { getHealth, getPortfolioSection } from '../controllers/portfolioController.js';

const router = Router();
router.get('/health', getHealth);
router.get('/profile', getPortfolioSection('profile'));
router.get('/skills', getPortfolioSection('skills'));
router.get('/projects', getPortfolioSection('projects'));
router.get('/experiences', getPortfolioSection('experiences'));
router.get('/education', getPortfolioSection('education'));
router.get('/social-links', getPortfolioSection('socialLinks'));
router.post('/contact', rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, message: 'Too many messages. Please try again later.' } }), submitContact);
export default router;
