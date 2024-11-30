const Event = require('../models/Events');

exports.rsvpToEvent = async (req, res) => {
    try {
        // Find event by ID
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if event has reached max attendees
        if (event.attendees.length >= event.maxAttendees) {
            return res.status(400).json({ message: 'Event capacity reached' });
        }

        // Check if user has already RSVP'd
        if (event.attendees.includes(req.user.id)) {
            return res.status(400).json({ message: 'You have already RSVP’d to this event' });
        }

        // Add the user to the attendees list
        event.attendees.push(req.user.id);
        await event.save();

        // Respond with a success message and event details
        res.json({ message: 'RSVP successful', event });
    } catch (error) {
        console.error('Error RSVP-ing to event:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getUserRSVPs = async (req, res) => {
    try {
        // Fetch all events where the user is an attendee
        const events = await Event.find({ attendees: req.user.id });
        res.json(events);
    } catch (error) {
        console.error('Error fetching user RSVPs:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error', error });
    }
};
