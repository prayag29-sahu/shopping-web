import { Admin } from '../models/Schema.js';

export const getAllBanners = async (req, res) => {
  try {
    let admin = await Admin.findOne();
    // If no admin doc exists yet, create one with empty values
    if (!admin) {
      admin = new Admin({ banner: '', categories: [] });
      await admin.save();
    }
    res.json(admin.banner || '');
  } catch (err) {
    console.error('getAllBanners error:', err);
    res.status(500).json({ message: 'Failed to fetch banners', error: err.message });
  }
};
