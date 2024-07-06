import supabase from '../supabase.js';

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { data } = await supabase.auth.getUser(token);
        req.user = data.user;
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

export default authMiddleware;