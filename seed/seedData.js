const Admin = require('../models/Admin');
const News = require('../models/News');
const Fact = require('../models/Fact');
const Category = require('../models/Category');
const Setting = require('../models/Setting');

const seedAdmin = async () => {
  try {
    const adminUsername = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await Admin.findOne({ username: adminUsername });

    if (!existingAdmin) {
      console.log(`Seeding default administrator (${adminUsername})...`);
      const admin = new Admin({
        username: adminUsername,
        password: adminPassword, // Pre-save hook will hash it with bcrypt
        name: 'Chief Administrator',
        email: 'admin@indiannews.com',
        role: 'superadmin',
      });
      await admin.save();
      console.log('Default administrator created successfully.');
    } else {
      console.log('Admin account already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};

const seedInitialData = async () => {
  try {
    await seedAdmin();

    // 1. Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('Seeding initial categories...');
      const defaultCategories = [
        { name: 'Economy', slug: 'economy', description: 'Financial markets, macroeconomics, trade and fiscal policies' },
        { name: 'Tech', slug: 'tech', description: 'Technology, startups, AI, and digital innovation' },
        { name: 'India', slug: 'india', description: 'National affairs, infrastructure, policy and governance' },
        { name: 'World', slug: 'world', description: 'Global developments, geopolitics, and international relations' },
        { name: 'Politics', slug: 'politics', description: 'Parliament, electoral politics, law and policy' },
        { name: 'Opinion', slug: 'opinion', description: 'Op-eds, expert commentary and editorial perspectives' },
      ];
      await Category.insertMany(defaultCategories);
    }

    // 2. Seed Settings
    const settingCount = await Setting.countDocuments();
    if (settingCount === 0) {
      console.log('Seeding initial site settings...');
      await Setting.create({
        websiteName: 'INDIAN NEWS',
        footerText: '© 2026 INDIAN NEWS Platform. All rights reserved. Delivering independent, reliable news and facts.',
        contactEmail: 'editor@indiannews.com',
        contactPhone: '+91 11 4567 8900',
        address: 'Media Complex, New Delhi, 110001',
      });
    }

    // 3. Seed News Articles
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      console.log('Seeding initial news articles...');
      const sampleNews = [
        {
          title: 'RBI Retains Benchmark Repo Rate at 6.5%; Forecasts Steady 7.0% GDP Growth for FY25',
          slug: 'rbi-retains-benchmark-repo-rate-at-6-5-percent',
          summary: 'The Monetary Policy Committee of the Reserve Bank of India voted 5-1 to keep rates unchanged, citing resilient domestic economic momentum.',
          content: [
            'In a widely anticipated decision, the Reserve Bank of India’s Monetary Policy Committee (MPC) on Friday decided to keep the benchmark repo rate unchanged at 6.5 per cent for the seventh consecutive meeting.',
            'Announcing the policy stance, RBI Governor highlighted that India’s macroeconomic fundamentals remain remarkably strong despite volatile geopolitical conditions and climate uncertainties impacting global trade.',
            'Real GDP growth for the financial year 2024-25 is projected at 7.0 per cent with Q1 at 7.1 per cent, Q2 at 6.9 per cent, Q3 at 7.0 per cent, and Q4 at 7.0 per cent. Retail inflation (CPI) for FY25 is projected at 4.5 per cent.'
          ],
          featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',
          imageCaption: 'Reserve Bank of India Headquarters during the Monetary Policy announcement.',
          category: 'Economy',
          tags: ['RBI', 'Economy', 'Inflation', 'Banking'],
          status: 'published',
          featured: true,
          isLive: true,
          isBreaking: true,
          views: 14200,
          author: { name: 'Vikram Sengupta', role: 'Senior Economics Editor' },
          readTime: '4 min read'
        },
        {
          title: 'ISRO Prepares for Milestone Solar-Terrestrial Mission Following Satellite Orbiting',
          slug: 'isro-prepares-for-milestone-solar-terrestrial-mission',
          summary: 'The Indian Space Research Organisation achieves high precision payload positioning, paving the way for deep space solar radiation studies.',
          content: [
            'The Indian Space Research Organisation (ISRO) has successfully placed its solar observation payload into the designated halo orbit.',
            'This mission promises unprecedented long-term observation of solar wind dynamics and magnetosphere interactions.'
          ],
          featuredImage: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800',
          category: 'Tech',
          tags: ['ISRO', 'Space', 'Tech'],
          status: 'published',
          featured: false,
          views: 3200,
          author: { name: 'Ananya Sharma', role: 'Science & Tech Bureau' },
          readTime: '3 min read'
        },
        {
          title: 'National Highway Expansion Accelerates: 12,000 KM Expressways Planned by 2026',
          slug: 'national-highway-expansion-accelerates',
          summary: 'Ministry of Road Transport approves new greenfield corridors linking industrial hubs across Western and Southern freight routes.',
          content: [
            'India’s infrastructure expansion has achieved unprecedented acceleration with over 12,000 KM of access-controlled expressways entering final construction phases.',
            'The new corridors aim to cut freight transit times between major ports and inland container depots by over 40 percent.'
          ],
          featuredImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
          category: 'India',
          tags: ['Highways', 'Infrastructure', 'India'],
          status: 'published',
          featured: false,
          views: 1850,
          author: { name: 'Rajesh Kumar', role: 'Infrastructure Correspondent' },
          readTime: '5 min read'
        },
        {
          title: 'Global Climate Summit Reaches Consensus on Clean Energy Financing Framework',
          slug: 'global-climate-summit-reaches-consensus',
          summary: 'Delegates from over 140 nations agree on $100 Billion annually for transition funds targeted towards developing economies.',
          content: [
            'Global representatives have reached a groundbreaking compromise on climate transition funds during late-night plenary sessions.',
            'The agreement establishes clear accountability guidelines and direct funding mechanisms for renewable grid upgrades.'
          ],
          featuredImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
          category: 'World',
          tags: ['Climate', 'Energy', 'UN'],
          status: 'published',
          featured: false,
          views: 940,
          author: { name: 'Elena Rostova', role: 'Global Affairs Editor' },
          readTime: '6 min read'
        }
      ];
      await News.insertMany(sampleNews);
    }

    // 4. Seed Facts
    const factCount = await Fact.countDocuments();
    if (factCount === 0) {
      console.log('Seeding initial facts...');
      const sampleFacts = [
        {
          title: 'World’s Highest Rail Bridge',
          content: 'The Chenab Bridge in Jammu & Kashmir stands at 359 meters (1,178 ft) above the riverbed, making it 35 meters taller than the Eiffel Tower in Paris.',
          category: 'India',
          featured: true,
          status: 'published',
          source: 'Ministry of Railways'
        },
        {
          title: 'First Digital Postal Network',
          content: 'India Post operates over 155,000 post offices, making it the largest physical postal network in the world, with over 100,000 branch post offices serving rural pin codes.',
          category: 'Tech',
          featured: true,
          status: 'published',
          source: 'Department of Posts'
        },
        {
          title: 'World’s Largest Renewable Energy Park',
          content: 'The Khavda Renewable Energy Park in Gujarat spans over 726 square kilometers—nearly the size of Singapore—and aims for 30 GW green power capacity.',
          category: 'Economy',
          featured: false,
          status: 'published',
          source: 'Ministry of New & Renewable Energy'
        }
      ];
      await Fact.insertMany(sampleFacts);
    }
  } catch (error) {
    console.error('Error seeding initial data:', error.message);
  }
};

module.exports = { seedAdmin, seedInitialData };

if (require.main === module) {
  const connectDB = require('../config/db');
  require('dotenv').config();
  connectDB().then(() => {
    seedInitialData().then(() => {
      console.log('Seeding process complete.');
      process.exit(0);
    });
  });
}
