require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  { nama: 'Makanan & Minuman', icon: '🍔' },
  { nama: 'Fashion & Pakaian', icon: '👕' },
  { nama: 'Kerajinan Tangan', icon: '🎨' },
  { nama: 'Kecantikan & Kesehatan', icon: '💄' },
  { nama: 'Elektronik & Aksesoris', icon: '📱' },
  { nama: 'Perlengkapan Rumah Tangga', icon: '🏠' },
  { nama: 'Tanaman & Pertanian', icon: '🌱' },
  { nama: 'Jasa & Layanan', icon: '🛠️' },
  { nama: 'Mainan & Hobi', icon: '🎮' },
  { nama: 'Lainnya', icon: '📦' }
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

    // Insert new categories
    await Category.insertMany(categories);
    console.log('✅ Categories seeded successfully!');

    // Display categories
    const allCategories = await Category.find();
    console.log('\n📋 Available Categories:');
    allCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.icon} ${cat.nama} (${cat.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();