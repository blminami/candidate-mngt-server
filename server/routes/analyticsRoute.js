import express from 'express';
import verifyAuth from '../middlewares/verifyAuth';
import {
  getCandidatesStatistic,
  getCountOfInterviews,
  getCountOfCanceledInterviews,
  getCountOfHiredCandidates,
  getCandidatesByStatus,
  getJobs,
  getJobsByStatus,
} from '../controllers/analyticsController';

const router = express.Router();

router.get('/candidates', verifyAuth, getCandidatesStatistic);
router.get('/interviews', verifyAuth, getCountOfInterviews);
router.get('/canceled-interviews', verifyAuth, getCountOfCanceledInterviews);
router.get('/hired-candidates', verifyAuth, getCountOfHiredCandidates);
router.get('/candidates-by-status', verifyAuth, getCandidatesByStatus);
router.get('/jobs', verifyAuth, getJobs);
router.get('/jobs-by-status', verifyAuth, getJobsByStatus);

export default router;
