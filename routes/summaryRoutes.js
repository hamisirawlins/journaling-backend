import express from 'express';
import { getSummaries } from '../controllers/summaryController.js';

const router = express.Router();

router.get('/', getSummaries);

export default router;