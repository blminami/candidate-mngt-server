import express from 'express';

import verifyAuth from '../middlewares/verifyAuth';
import { getAllUploads } from '../controllers/uploadsController';

const router = express.Router();

router.get('/', verifyAuth, getAllUploads);

export default router;
