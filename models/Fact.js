const mongoose = require('mongoose');

const factSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Fact title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Fact detail content is required'],
    },
    category: {
      type: String,
      default: 'General',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    source: {
      type: String,
      default: 'Indian News Research Desk',
    },
    slug: {
      type: String,
      default: '',
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Fact', factSchema);
