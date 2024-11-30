const express = require('express');
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } = require('../controllers/eventController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', auth, createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.patch('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

module.exports = router;
