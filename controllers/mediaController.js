const path = require('path');
const fs = require('fs');
const Media = require('../models/Media');

// @desc Upload file & save media record
// @route POST /api/media/upload
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    const media = new Media({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: fileUrl,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    const savedMedia = await media.save();
    res.status(201).json(savedMedia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all uploaded media files
// @route GET /api/media
const getMedia = async (req, res) => {
  try {
    const media = await Media.find({}).sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete media file
// @route DELETE /api/media/:id
const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Remove file from disk
    const filePath = path.join(__dirname, '../uploads', media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await media.deleteOne();
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadMedia,
  getMedia,
  deleteMedia,
};
