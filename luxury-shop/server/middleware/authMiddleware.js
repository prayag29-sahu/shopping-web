import { User } from '../models/Schema.js';

// Simple auth: frontend sends userId in header "x-user-id"
export const protect = async (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'Not authorized: no user ID provided' });
  }
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid user ID' });
  }
};
