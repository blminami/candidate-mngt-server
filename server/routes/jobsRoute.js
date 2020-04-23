import express from 'express';
import {
  addJob,
  getAll,
  getByID,
  updateJob,
  getAllByStatus,
} from '../controllers/jobsController';

import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

// Interviews
router.get('/', verifyAuth, getAll);
router.get('/:id', verifyAuth, getByID);
router.get('/filter/byStatus', verifyAuth, getAllByStatus);
router.post('/', verifyAuth, addJob);
router.put('/', verifyAuth, updateJob);

export default router;
