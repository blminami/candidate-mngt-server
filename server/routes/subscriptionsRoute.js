import express from 'express';

import verifyAuth from '../middlewares/verifyAuth';
import { addSubscription } from '../controllers/subscriptionsController';

const router = express.Router();

router.post('/', verifyAuth, addSubscription);

export default router;
