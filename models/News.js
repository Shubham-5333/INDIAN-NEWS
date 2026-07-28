const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'News title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // Can be array of paragraphs or string HTML
      required: [true, 'Article content is required'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    imageCaption: {
      type: String,
      default: '',
    },
    gallery: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'General',
    },
    tags: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    isBreaking: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    author: {
      name: { type: String, default: 'Editorial Desk' },
      role: { type: String, default: 'Staff Reporter' },
      avatar: { type: String, default: '' },
    },
    readTime: {
      type: String,
      default: '4 min read',
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('News', newsSchema);
