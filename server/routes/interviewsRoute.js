import express from 'express';
import {
  addInterview,
  getAll,
  updateInterview,
} from '../controllers/interviewsController';

const router = express.Router();

// Interviews
router.get('/', getAll);
router.post('/', addInterview);
router.put('/', updateInterview);

export default router;
