import express from 'express';
import { createEntry, getEntries, getEntry, updateEntry, deleteEntry, getSummaries } from '../controllers/journalController.js';

const router = express.Router();

router.post('/', createEntry);
router.get('/', getEntries);
router.get('/:id', getEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

router.get('/summaries', getSummaries);


export default router;