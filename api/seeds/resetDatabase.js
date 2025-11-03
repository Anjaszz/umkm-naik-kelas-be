require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

const defaultCategories = [
  'Makanan',
  'Minuman',
  'Fashion & Pakaian',
  'Kerajian Tangan',
  'Produk Kecantikan & Perawatan Diri'
];

const resetDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected');
    console.log('⚠️  WARNING: This will delete ALL data from the database!');
    console.log('🔄 Starting database reset...\n');

    // Delete all collections
    console.log('🗑️  Deleting all users...');
    const deletedUsers = await User.deleteMany({});
    console.log(`   ✓ ${deletedUsers.deletedCount} users deleted`);

    console.log('🗑️  Deleting all products...');
    const deletedProducts = await Product.deleteMany({});
    console.log(`   ✓ ${deletedProducts.deletedCount} products deleted`);

    console.log('🗑️  Deleting all categories...');
    const deletedCategories = await Category.deleteMany({});
    console.log(`   ✓ ${deletedCategories.deletedCount} categories deleted`);

    // Seed default categories
    console.log('\n🌱 Seeding default categories...');
    for (const nama of defaultCategories) {
      await Category.create({ nama });
    }
    console.log('   ✓ Categories seeded successfully!');

    // Display seeded categories
    const allCategories = await Category.find();
    console.log('\n📋 Available Categories:');
    allCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.nama} (${cat.slug})`);
    });

    console.log('\n✅ Database reset completed successfully!');
    console.log('\n📊 Current database status:');
    console.log(`   - Users: ${await User.countDocuments()}`);
    console.log(`   - Products: ${await Product.countDocuments()}`);
    console.log(`   - Categories: ${await Category.countDocuments()}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error resetting database:', error);
    process.exit(1);
  }
};

// Run the reset
resetDatabase();
