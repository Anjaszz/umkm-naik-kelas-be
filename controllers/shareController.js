const Product = require('../models/Product');

// @desc    Generate share link for product
// @route   GET /api/share/product/:id
// @access  Public
const generateProductShareLink = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'namaToko fotoProfil');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    // Base URL untuk deep link (sesuaikan dengan setup Anda)
    const appScheme = process.env.APP_SCHEME || 'umkmapp';
    const webDomain = process.env.WEB_DOMAIN || 'https://umkm-marketplace.com';

    // Generate berbagai format link
    const shareData = {
      success: true,
      data: {
        // Deep link untuk app
        deepLink: `${appScheme}://product/${product._id}`,

        // Web link (jika ada landing page)
        webLink: `${webDomain}/product/${product._id}`,

        // Universal link format
        universalLink: `${webDomain}/product/${product._id}`,

        // Data untuk share
        product: {
          id: product._id,
          nama: product.nama,
          deskripsi: product.deskripsi,
          harga: product.harga,
          foto: product.foto[0], // foto pertama untuk preview
          seller: {
            nama: product.sellerId.namaToko,
            foto: product.sellerId.fotoProfil
          }
        },

        // Share text template
        shareText: `Lihat produk ${product.nama} di UMKM Marketplace!
Harga: Rp ${product.harga.toLocaleString('id-ID')}
Dari: ${product.sellerId.namaToko}

Klik link untuk melihat detail: ${webDomain}/product/${product._id}`,

        // Social media specific
        social: {
          whatsapp: `https://wa.me/?text=${encodeURIComponent(
            `Lihat produk ${product.nama} - Rp ${product.harga.toLocaleString('id-ID')} di UMKM Marketplace: ${webDomain}/product/${product._id}`
          )}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${webDomain}/product/${product._id}`)}`,
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `Lihat produk ${product.nama} di UMKM Marketplace`
          )}&url=${encodeURIComponent(`${webDomain}/product/${product._id}`)}`
        }
      }
    };

    res.json(shareData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateProductShareLink
};
