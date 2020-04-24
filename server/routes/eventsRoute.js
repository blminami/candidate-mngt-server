import express from 'express';

import verifyAuth from '../middlewares/verifyAuth';
import {
  getAllEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventsController';

const router = express.Router();

// Events
router.get('/', verifyAuth, getAllEvents);
router.post('/', verifyAuth, addEvent);
router.put('/', verifyAuth, updateEvent);
router.delete('/:id', verifyAuth, deleteEvent);

export default router;
