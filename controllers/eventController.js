const Event = require('../models/Events');

exports.createEvent = async (req, res) => {
    const { name, description, date, time, location, maxAttendees } = req.body;

    try {
        const event = await Event.create({ 
            name, 
            description, 
            date, 
            time, 
            location, 
            maxAttendees, 
            creator: req.user.id 
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const { location, date } = req.query;
        const filters = {};
        if (location) filters.location = location;
        if (date) filters.date = new Date(date);

        const events = await Event.find(filters);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await event.remove();
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
