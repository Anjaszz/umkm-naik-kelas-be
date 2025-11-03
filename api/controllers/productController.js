const Product = require('../models/Product');
const Category = require('../models/Category');
const { uploadMultipleToS3, deleteFromS3 } = require('../utils/uploadToS3');

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Seller only)
const createProduct = async (req, res, next) => {
  try {
    const { nama, deskripsi, harga, kategori } = req.body;

    // Validate files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Minimal 1 foto produk wajib diupload'
      });
    }

    if (req.files.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Maksimal 5 foto produk'
      });
    }

    // Check if category exists
    const categoryExists = await Category.findOne({ nama: kategori });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Kategori tidak valid'
      });
    }

    // Upload photos to s3
    const fotoUrls = await uploadMultipleToS3(req.files, 'produk');

    // Create product
    const product = await Product.create({
      sellerId: req.user.id,
      nama,
      deskripsi,
      harga,
      kategori,
      foto: fotoUrls
    });

    // Populate seller info
    await product.populate('sellerId', 'namaToko fotoProfil domisili');

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Seller only, own product)
const updateProduct = async (req, res, next) => {
  try {
    const { nama, deskripsi, harga, kategori } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    // Check ownership
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengupdate produk ini'
      });
    }

    // Check category if provided
    if (kategori) {
      const categoryExists = await Category.findOne({ nama: kategori });
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Kategori tidak valid'
        });
      }
    }

    // Handle photo updates if provided
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({
          success: false,
          message: 'Maksimal 5 foto produk'
        });
      }

      // Delete old photos
      for (const url of product.foto) {
        await deleteFromS3(url);
      }

      // Upload new photos
      const newFotoUrls = await uploadMultipleToS3(req.files, 'produk');
      product.foto = newFotoUrls;
    }

    // Update fields
    if (nama) product.nama = nama;
    if (deskripsi) product.deskripsi = deskripsi;
    if (harga) product.harga = harga;
    if (kategori) product.kategori = kategori;

    await product.save();
    await product.populate('sellerId', 'namaToko fotoProfil domisili');

    res.json({
      success: true,
      message: 'Produk berhasil diupdate',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Seller only, own product)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    // Check ownership
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk menghapus produk ini'
      });
    }

    // Delete photos from S3
    for (const url of product.foto) {
      await deleteFromS3(url);
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Produk berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products with search and filter (for buyers)
// @route   GET /api/products
// @access  Private (Buyer only)
const getAllProducts = async (req, res, next) => {
  try {
    const { search, kategori, sortBy = 'terbaru', page = 1, limit = 10 } = req.query;

    let query = {};

    // Search by nama or deskripsi
    if (search) {
      query.$or = [
        { nama: { $regex: search, $options: 'i' } },
        { deskripsi: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (kategori) {
      query.kategori = kategori;
    }

    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'termurah':
        sortOptions = { harga: 1 };
        break;
      case 'termahal':
        sortOptions = { harga: -1 };
        break;
      case 'terbaru':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('sellerId', 'namaToko fotoProfil domisili whatsapp')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product detail (for buyers)
// @route   GET /api/products/:id
// @access  Private (Buyer only)
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'namaToko fotoProfil domisili whatsapp facebook instagram alamatUsaha');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById
};