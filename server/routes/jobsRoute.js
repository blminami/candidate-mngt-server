import express from 'express';
import {
  addJob,
  getAll,
  getByID,
  updateJob,
} from '../controllers/jobsController';

const router = express.Router();

// Interviews
router.get('/', getAll);
router.get('/:id', getByID);
router.post('/', addJob);
router.put('/', updateJob);

export default router;
