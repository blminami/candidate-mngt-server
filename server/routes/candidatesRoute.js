import express from 'express';

import {
  getAll,
  addCandidate,
  getByID,
  getCandidatesLength,
  updateCandidate,
} from '../controllers/candidatesController';

import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

// Candidates
router.get('/', verifyAuth, getAll);
router.get('/id/:id', verifyAuth, getByID);
router.get('/pagination/length/byUser', verifyAuth, getCandidatesLength);
router.post('/', verifyAuth, addCandidate);
router.put('/', verifyAuth, updateCandidate);

export default router;
