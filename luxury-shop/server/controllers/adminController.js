import { Admin } from '../models/Schema.js';

export const fetchBanner = async (req, res) => {
  try {
    const admin = await Admin.findOne();
    res.json(admin ? admin.banner : '');
  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
};

export const updateBanner = async (req, res) => {
  const { banner } = req.body;
  try {
    if (req.user.usertype !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    const data = await Admin.find();
    if (data.length === 0) {
      const newData = new Admin({ banner, categories: [] });
      await newData.save();
    } else {
      const admin = await Admin.findOne();
      admin.banner = banner;
      await admin.save();
    }
    res.json({ message: 'Banner updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
};
