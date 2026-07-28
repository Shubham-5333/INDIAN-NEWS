const News = require('../models/News');
const Fact = require('../models/Fact');
const Category = require('../models/Category');
const Admin = require('../models/Admin');
const Media = require('../models/Media');

// @desc Get dashboard overview statistics
// @route GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalNews = await News.countDocuments();
    const publishedNews = await News.countDocuments({ status: 'published' });
    const draftNews = await News.countDocuments({ status: 'draft' });
    const totalFacts = await Fact.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    const totalMedia = await Media.countDocuments();

    // Get total views across all news
    const viewsAggregate = await News.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);
    const totalViews = viewsAggregate[0]?.totalViews || 0;

    // Get 5 recent activity items (news articles created or updated)
    const recentNews = await News.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title slug status views category updatedAt createdAt');

    const recentActivity = recentNews.map((item) => ({
      id: item._id,
      title: item.title,
      type: 'News Article',
      category: item.category,
      status: item.status,
      views: item.views,
      timestamp: item.updatedAt,
    }));

    res.json({
      stats: {
        totalNews,
        publishedNews,
        draftNews,
        totalFacts,
        totalCategories,
        totalAdmins,
        totalMedia,
        totalViews,
      },
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
