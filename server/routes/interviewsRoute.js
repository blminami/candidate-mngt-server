import express from 'express';
import {
  addInterview,
  getAll,
  updateInterview,
  getInterviewsByCandidate,
} from '../controllers/interviewsController';

import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

// Interviews
router.get('/', verifyAuth, getAll);
router.get('/byCandidate', verifyAuth, getInterviewsByCandidate);
router.post('/', verifyAuth, addInterview);
router.put('/', verifyAuth, updateInterview);

export default router;
