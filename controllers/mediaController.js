const path = require('path');
const fs = require('fs');
const Media = require('../models/Media');

// @desc Upload file & save media record
// @route POST /api/media/upload
const uploadMedia = async (req, res) => {
  const uploadedFiles = req.files || (req.file ? [req.file] : []);

  if (!uploadedFiles || uploadedFiles.length === 0) {
    return res.status(400).json({
      message: 'Please upload a picture',
    });
  }

  try {
    const uploadImg = uploadedFiles.map((file) => `/images/${file.filename}`);
    const primaryUrl = uploadImg[0];

    const media = new Media({
      filename: uploadedFiles[0].filename,
      originalName: uploadedFiles[0].originalname,
      url: primaryUrl,
      images: uploadImg,
      mimeType: uploadedFiles[0].mimetype,
      size: uploadedFiles[0].size,
    });

    const savedMedia = await media.save();

    res.status(201).json({
      url: primaryUrl,
      images: uploadImg,
      data: savedMedia,
      productData: savedMedia,
      message: 'uploaded image',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
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
