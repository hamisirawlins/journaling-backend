// middleware/authMiddleware.js
import supabase from '../supabase.js';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1]; 

    try {
        const { data, error } = await supabase.auth.getUser(token);
        if (error) {
            return res.status(401).json({ message: error.message });
        }
        req.user = data.user;
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default authMiddleware;
