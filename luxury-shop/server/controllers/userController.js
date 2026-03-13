import bcrypt from 'bcrypt';
import { User } from '../models/Schema.js';

export const registerUser = async (req, res) => {
  const { username, email, usertype, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, usertype, password: hashedPassword });
    const saved = await newUser.save();

    res.status(201).json({
      _id: saved._id,
      username: saved.username,
      email: saved.email,
      usertype: saved.usertype
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      usertype: user.usertype
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const fetchUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
};
