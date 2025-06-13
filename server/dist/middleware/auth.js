import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
export const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // If no token is provided, return 401 Unauthorized
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add the user data to the request object
        req.user = decoded;
        next();
        return;
    }
    catch (error) {
        // If token is invalid, return 403 Forbidden
        return res.status(403).json({ message: 'Invalid token.' });
    }
};
