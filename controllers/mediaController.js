const path = require('path');
const fs = require('fs');
const Media = require('../models/Media');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// @desc Upload file & save media record to Cloudinary
// @route POST /api/media/upload
const uploadMedia = async (req, res) => {
  const uploadedFiles = req.files || (req.file ? [req.file] : []);

  if (!uploadedFiles || uploadedFiles.length === 0) {
    return res.status(400).json({
      message: 'Please upload a picture',
    });
  }

  try {
    const uploadPromises = uploadedFiles.map((file) =>
      uploadToCloudinary(file.buffer, {
        original_filename: file.originalname,
      })
    );

    const cloudinaryResults = await Promise.all(uploadPromises);
    const primaryResult = cloudinaryResults[0];
    const uploadUrls = cloudinaryResults.map((r) => r.secure_url);

    const media = new Media({
      filename: primaryResult.public_id,
      originalName: uploadedFiles[0].originalname,
      url: primaryResult.secure_url,
      publicId: primaryResult.public_id,
      mimeType: uploadedFiles[0].mimetype,
      size: uploadedFiles[0].size || primaryResult.bytes,
    });

    const savedMedia = await media.save();

    res.status(201).json({
      url: primaryResult.secure_url,
      images: uploadUrls,
      publicId: primaryResult.public_id,
      data: savedMedia,
      productData: savedMedia,
      message: 'uploaded image to cloudinary',
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      message: error.message || 'Image upload failed',
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

    // Delete from Cloudinary
    if (media.publicId) {
      await deleteFromCloudinary(media.publicId);
    } else if (media.filename && !media.filename.includes('.')) {
      await deleteFromCloudinary(media.filename);
    }

    // Also clean up any legacy local disk files if they exist
    if (media.filename) {
      const uploadPath = path.join(__dirname, '../uploads', media.filename);
      const assetsPath = path.join(__dirname, '../Assets/images', media.filename);
      if (fs.existsSync(uploadPath)) fs.unlinkSync(uploadPath);
      if (fs.existsSync(assetsPath)) fs.unlinkSync(assetsPath);
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
