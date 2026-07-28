const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_indian_news_2026_safe',
    { expiresIn: '7d' }
  );
};

// @desc Auth admin & get token
// @route POST /api/admin/login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide both username and password' });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase() });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get current admin profile
// @route GET /api/admin/profile
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update admin profile
// @route PUT /api/admin/profile
const updateProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;
    if (req.body.username) {
      admin.username = req.body.username.toLowerCase();
    }

    const updatedAdmin = await admin.save();

    res.json({
      _id: updatedAdmin._id,
      username: updatedAdmin.username,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Change admin password
// @route PUT /api/admin/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new password' });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  adminLogin,
  getProfile,
  updateProfile,
  changePassword,
};
