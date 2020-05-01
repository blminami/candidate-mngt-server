import express from 'express';

import verifyAuth from '../middlewares/verifyAuth';
import {
  getAllUploads,
  downloadUpload,
  uploadFile,
} from '../controllers/uploadsController';

const router = express.Router();

router.get('/', verifyAuth, getAllUploads);
router.get('/:filename', verifyAuth, downloadUpload);
router.post('/', verifyAuth, uploadFile);

export default router;
