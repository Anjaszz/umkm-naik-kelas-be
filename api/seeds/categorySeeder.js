require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  'Makanan',
  'Minuman',
  'Manisan',
  'Bumbu',
  'Lainnya'
];

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Old categories deleted');

    // Insert categories one by one to trigger pre-save hook
    for (const nama of categories) {
      await Category.create({ nama });
    }
    console.log('✅ Categories seeded successfully!');

    // Display categories
    const allCategories = await Category.find();
    console.log('\n📋 Available Categories:');
    allCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.nama} (${cat.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();