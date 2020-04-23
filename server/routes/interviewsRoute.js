import express from 'express';
import {
  addInterview,
  getAll,
  updateInterview,
} from '../controllers/interviewsController';

import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

// Interviews
router.get('/', verifyAuth, getAll);
router.post('/', verifyAuth, addInterview);
router.put('/', verifyAuth, updateInterview);

export default router;
