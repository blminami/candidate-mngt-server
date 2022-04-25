import express from 'express';

import verifyAuth from '../middlewares/verifyAuth';
import { getTags, addTag, deleteTag } from '../controllers/tagController';

const router = express.Router();

router.get('/', verifyAuth, getTags);
router.post('/', verifyAuth, addTag);
router.delete('/:id', verifyAuth, deleteTag);

export default router;
