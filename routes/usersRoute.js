import express from 'express';
import {
  searchFirstnameOrLastname,
  createUser,
  signinUser,
  forgotPassword,
  resetPassword,
  updateUserInfo,
  uploadProfileImage
} from '../controllers/usersController';

import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

// users Routes
router.post('/signup', createUser);
router.post('/signin', signinUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/', verifyAuth, updateUserInfo);
router.put('/profile-image', verifyAuth, uploadProfileImage);
router.get('/first_name', searchFirstnameOrLastname);

export default router;
