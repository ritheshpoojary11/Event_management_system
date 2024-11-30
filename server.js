const PORT = process.env.PORT || 5000;
const express = require('express');
const connectDB = require('./src/config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes')); // User routes
app.use('/api/events', require('./routes/eventRoutes')); // Event routes
app.use('/api/rsvps', require('./routes/rsvpRoutes'));  // RSVP routes

// Test route
app.get('/', (req, res) => {
    res.send('Event Management API is running');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
