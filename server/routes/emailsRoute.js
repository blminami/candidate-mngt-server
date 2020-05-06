import express from 'express';
import verifyAuth from '../middlewares/verifyAuth';
import {
  addEmail,
  getEmails,
  getEmailByID,
  updateEmail,
  sendEmail,
} from '../controllers/emailsController';

const router = express.Router();

router.get('/', verifyAuth, getEmails);
router.get('/send/email', verifyAuth, sendEmail);
router.get('/:id', verifyAuth, getEmailByID);
router.post('/', verifyAuth, addEmail);
router.put('/', verifyAuth, updateEmail);

export default router;
