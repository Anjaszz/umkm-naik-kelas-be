const path = require('path');
const fs = require('fs');

// Upload single file (file sudah tersimpan oleh multer)
const uploadToS3 = async (file, folder = 'uploads') => {
  try {
    if (!file) {
      throw new Error('Tidak ada file untuk diupload');
    }

    // File sudah disimpan oleh multer, kita hanya perlu return URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const publicUrl = `${baseUrl}/uploads/${file.filename}`;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Gagal mengupload file');
  }
};

// Upload multiple files
const uploadMultipleToS3 = async (files, folder = 'uploads') => {
  try {
    if (!files || files.length === 0) {
      throw new Error('Tidak ada file untuk diupload');
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const urls = files.map(file => `${baseUrl}/uploads/${file.filename}`);

    return urls;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw new Error('Gagal mengupload beberapa file');
  }
};

// Delete file from local storage
const deleteFromS3 = async (fileUrl) => {
  try {
    // Extract filename from URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const filename = fileUrl.replace(`${baseUrl}/uploads/`, '');

    const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '../../public_html/uploads');
    const filePath = path.join(uploadDir, filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✅ File deleted:', filename);
      return true;
    } else {
      console.log('⚠️ File not found:', filename);
      return false;
    }
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    return false;
  }
};

module.exports = {
  uploadToS3,
  uploadMultipleToS3,
  deleteFromS3,
};