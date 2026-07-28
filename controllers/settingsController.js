const Setting = require('../models/Setting');

// @desc Get website settings
// @route GET /api/settings
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update website settings
// @route PUT /api/settings
const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    if (req.body.websiteName) settings.websiteName = req.body.websiteName;
    if (req.body.logo !== undefined) settings.logo = req.body.logo;
    if (req.body.favicon !== undefined) settings.favicon = req.body.favicon;
    if (req.body.footerText !== undefined) settings.footerText = req.body.footerText;
    if (req.body.contactEmail !== undefined) settings.contactEmail = req.body.contactEmail;
    if (req.body.contactPhone !== undefined) settings.contactPhone = req.body.contactPhone;
    if (req.body.address !== undefined) settings.address = req.body.address;
    if (req.body.socialLinks) {
      settings.socialLinks = { ...settings.socialLinks, ...req.body.socialLinks };
    }

    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
