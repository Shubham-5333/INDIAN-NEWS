const Fact = require('../models/Fact');

// @desc Get all facts
// @route GET /api/facts
const getFacts = async (req, res) => {
  try {
    const { category, status, featured } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    } else if (!req.query.adminView) {
      query.status = 'published';
    }

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const facts = await Fact.find(query).sort({ createdAt: -1 });
    res.json(facts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create fact
// @route POST /api/facts
const createFact = async (req, res) => {
  try {
    const { title, slug, content, category, featured, status, source, seoTitle, seoDescription } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const fact = new Fact({
      title,
      slug: slug || title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
      content,
      category: category || 'General',
      featured: Boolean(featured),
      status: status || 'published',
      source: source || 'Indian News Research Desk',
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || content.substring(0, 160),
    });

    const createdFact = await fact.save();
    res.status(201).json(createdFact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update fact
// @route PUT /api/facts/:id
const updateFact = async (req, res) => {
  try {
    const fact = await Fact.findById(req.params.id);

    if (!fact) {
      return res.status(404).json({ message: 'Fact not found' });
    }

    if (req.body.title) fact.title = req.body.title;
    if (req.body.slug !== undefined) fact.slug = req.body.slug;
    if (req.body.content) fact.content = req.body.content;
    if (req.body.category) fact.category = req.body.category;
    if (req.body.featured !== undefined) fact.featured = Boolean(req.body.featured);
    if (req.body.status) fact.status = req.body.status;
    if (req.body.source) fact.source = req.body.source;
    if (req.body.seoTitle !== undefined) fact.seoTitle = req.body.seoTitle;
    if (req.body.seoDescription !== undefined) fact.seoDescription = req.body.seoDescription;

    const updatedFact = await fact.save();
    res.json(updatedFact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete fact
// @route DELETE /api/facts/:id
const deleteFact = async (req, res) => {
  try {
    const fact = await Fact.findById(req.params.id);

    if (!fact) {
      return res.status(404).json({ message: 'Fact not found' });
    }

    await fact.deleteOne();
    res.json({ message: 'Fact removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFacts,
  createFact,
  updateFact,
  deleteFact,
};
