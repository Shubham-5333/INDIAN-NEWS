const News = require('../models/News');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc Get all news (with filtering, search, pagination)
// @route GET /api/news
const getNews = async (req, res) => {
  try {
    const { category, search, featured, status, limit = 20, page = 1, tag } = req.query;

    const query = {};

    // If not admin query requesting all, filter by published status only
    if (status && status !== 'All' && status !== 'undefined') {
      query.status = status;
    } else if (!req.query.adminView) {
      query.status = 'published';
    }

    if (category && category !== 'All' && category !== 'undefined') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const count = await News.countDocuments(query);
    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    res.json({
      news,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single news by slug or ID
// @route GET /api/news/:slug
const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    let article = await News.findOne({ slug });
    if (!article && slug.match(/^[0-9a-fA-F]{24}$/)) {
      article = await News.findById(slug);
    }

    if (!article) {
      return res.status(404).json({ message: 'News article not found' });
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create news article
// @route POST /api/news
const createNews = async (req, res) => {
  try {
    const {
      title,
      summary,
      content,
      featuredImage,
      imageCaption,
      gallery,
      category,
      tags,
      status,
      featured,
      isLive,
      isBreaking,
      author,
      readTime,
      seoTitle,
      seoDescription,
    } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ message: 'Title, summary, and content are required' });
    }

    let slug = req.body.slug ? slugify(req.body.slug) : slugify(title);
    
    // Check if slug exists
    const slugExists = await News.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    const formattedContent = Array.isArray(content)
      ? content
      : typeof content === 'string' && content.includes('\n')
      ? content.split('\n').filter((p) => p.trim())
      : [content];

    let computedFeaturedImage = featuredImage || '';
    if (req.file) {
      computedFeaturedImage = `/images/${req.file.filename}`;
    } else if (req.files && req.files.length > 0) {
      computedFeaturedImage = `/images/${req.files[0].filename}`;
    }

    const news = new News({
      title,
      slug,
      summary,
      content: formattedContent,
      featuredImage: computedFeaturedImage,
      imageCaption: imageCaption || '',
      gallery: gallery || [],
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [],
      status: status || 'published',
      featured: Boolean(featured),
      isLive: Boolean(isLive),
      isBreaking: Boolean(isBreaking),
      author: author || { name: 'Editorial Desk', role: 'Senior Editor' },
      readTime: readTime || '4 min read',
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || summary,
      publishedAt: status === 'published' ? Date.now() : null,
    });

    const createdNews = await news.save();
    res.status(201).json(createdNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update news article
// @route PUT /api/news/:id
const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    if (req.file) {
      news.featuredImage = `/images/${req.file.filename}`;
    } else if (req.files && req.files.length > 0) {
      news.featuredImage = `/images/${req.files[0].filename}`;
    } else if (req.body.featuredImage !== undefined) {
      news.featuredImage = req.body.featuredImage;
    }

    if (req.body.title && req.body.title !== news.title) {
      news.title = req.body.title;
      if (!req.body.slug) {
        news.slug = slugify(req.body.title);
      }
    }

    if (req.body.slug) news.slug = slugify(req.body.slug);
    if (req.body.summary) news.summary = req.body.summary;
    if (req.body.content) {
      news.content = Array.isArray(req.body.content)
        ? req.body.content
        : typeof req.body.content === 'string' && req.body.content.includes('\n')
        ? req.body.content.split('\n').filter((p) => p.trim())
        : [req.body.content];
    }
    if (req.body.featuredImage !== undefined) news.featuredImage = req.body.featuredImage;
    if (req.body.imageCaption !== undefined) news.imageCaption = req.body.imageCaption;
    if (req.body.gallery !== undefined) news.gallery = req.body.gallery;
    if (req.body.category) news.category = req.body.category;
    if (req.body.tags) {
      news.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : typeof req.body.tags === 'string'
        ? req.body.tags.split(',').map((t) => t.trim())
        : [];
    }
    if (req.body.status) news.status = req.body.status;
    if (req.body.featured !== undefined) news.featured = Boolean(req.body.featured);
    if (req.body.isLive !== undefined) news.isLive = Boolean(req.body.isLive);
    if (req.body.isBreaking !== undefined) news.isBreaking = Boolean(req.body.isBreaking);
    if (req.body.author) news.author = { ...news.author, ...req.body.author };
    if (req.body.readTime) news.readTime = req.body.readTime;
    if (req.body.seoTitle) news.seoTitle = req.body.seoTitle;
    if (req.body.seoDescription) news.seoDescription = req.body.seoDescription;

    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete news article
// @route DELETE /api/news/:id
const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    await news.deleteOne();
    res.json({ message: 'News article removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle publish/unpublish status
// @route PATCH /api/news/:id/status
const toggleNewsStatus = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    news.status = news.status === 'published' ? 'draft' : 'published';
    if (news.status === 'published' && !news.publishedAt) {
      news.publishedAt = Date.now();
    }
    await news.save();

    res.json({ message: `Status updated to ${news.status}`, news });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle featured flag
// @route PATCH /api/news/:id/featured
const toggleNewsFeatured = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    news.featured = !news.featured;
    await news.save();

    res.json({ message: `Featured set to ${news.featured}`, news });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  toggleNewsStatus,
  toggleNewsFeatured,
};
