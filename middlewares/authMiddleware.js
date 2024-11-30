const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Check if the Authorization header is provided
    const token = req.header('Authorization')?.split(' ')[1]; // Split to get the token after "Bearer"
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, No token provided' });
    }

    try {
        // Verify the token using JWT secret from environment
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to request object
        next(); // Continue to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
};
