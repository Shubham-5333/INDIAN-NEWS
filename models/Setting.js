const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      default: 'INDIAN NEWS',
    },
    logo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    footerText: {
      type: String,
      default: '© 2026 INDIAN NEWS Platform. All rights reserved. Breaking news, unbiased reports and in-depth analysis from across India.',
    },
    contactEmail: {
      type: String,
      default: 'contact@indiannews.com',
    },
    contactPhone: {
      type: String,
      default: '+91 11 2345 6789',
    },
    address: {
      type: String,
      default: 'New Delhi, India',
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);
