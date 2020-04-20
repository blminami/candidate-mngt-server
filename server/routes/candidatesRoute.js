import express from 'express';

import {
  getAll,
  addCandidate,
  searchCandidates,
  getByID,
  getCandidatesLength,
} from '../controllers/candidatesController';

const router = express.Router();

// Candidates
router.get('/', getAll);
router.get('/id/:id', getByID);
router.get('/pagination/length/byUser', getCandidatesLength);
router.post('/', addCandidate);

export default router;
