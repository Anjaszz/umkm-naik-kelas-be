const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nama: {
    type: String,
    required: true,
    trim: true
  },
  deskripsi: {
    type: String,
    required: true
  },
  harga: {
    type: Number,
    required: true,
    min: 0
  },
  kategori: {
    type: String,
    required: true
  },
  foto: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length >= 1 && v.length <= 5;
      },
      message: 'Produk harus memiliki 1-5 foto'
    },
    required: true
  }
}, {
  timestamps: true
});

// Index for search and filter
productSchema.index({ nama: 'text', deskripsi: 'text' });
productSchema.index({ kategori: 1 });
productSchema.index({ sellerId: 1 });

module.exports = mongoose.model('Product', productSchema);