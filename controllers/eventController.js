const Event = require('../models/Events');
const mongoose = require('mongoose');
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
        console.log('Delete request received for Event ID:', req.params.id);

        // Validate Event ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.error('Invalid Event ID:', req.params.id);
            return res.status(400).json({ message: 'Invalid Event ID' });
        }

        // Fetch the event
        const event = await Event.findById(req.params.id);
        if (!event) {
            console.error('Event not found for ID:', req.params.id);
            return res.status(404).json({ message: 'Event not found' });
        }

        console.log('Event found:', event);

        // Check if the user is authorized to delete
        if (event.creator.toString() !== req.user.id) {
            console.error('Unauthorized delete attempt by User ID:', req.user.id);
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Delete the event
        await Event.deleteOne({ _id: req.params.id }); // Replace `remove` with `deleteOne`
        console.log('Event deleted successfully for ID:', req.params.id);

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error during deletion:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};