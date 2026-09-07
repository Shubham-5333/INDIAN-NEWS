const cloudinary = require('cloudinary').v2;

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CNAME ||
  process.env.CLOUD_NAME ||
  process.env.CLOUDINARY_NAME;

const apiKey =
  process.env.CLOUDINARY_API_KEY ||
  process.env.CLOUDINARY_KEY ||
  process.env.API_KEY;

const apiSecret =
  process.env.CLOUDINARY_API_SECRET ||
  process.env.CLOUDINARY_SECRETE ||
  process.env.CLOUDINARY_SECRET ||
  process.env.API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

/**
 * Upload an image buffer directly to Cloudinary
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {Object} options - Cloudinary upload options
 * @returns {Promise<Object>}
 */
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!cloudName || !apiKey || !apiSecret) {
      return reject(
        new Error(
          'Cloudinary configuration missing. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env'
        )
      );
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'indian_news',
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete an asset from Cloudinary using publicId
 * @param {string} publicId
 * @returns {Promise<Object|null>}
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary destroy error:', err);
    return null;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};
