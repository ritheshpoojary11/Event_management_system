const express = require('express');
const { rsvpToEvent, getUserRSVPs } = require('../controllers/rsvpController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/:id/rsvp', auth, rsvpToEvent);
router.get('/myevents', auth, getUserRSVPs);

module.exports = router;
