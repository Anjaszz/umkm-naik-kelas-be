const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const s3Client = require('../config/s3');
const path = require('path');

const uploadToS3 = async (file, folder = 'uploads') => {
  try {
    if (!file) {
      throw new Error('Tidak ada file untuk diupload');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = path.extname(file.originalname);
    const filename = `${folder}/${timestamp}-${randomString}${extension}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Upload to S3
    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    await upload.done();

    // Get public URL
    const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Gagal mengupload file ke S3');
  }
};

const uploadMultipleToS3 = async (files, folder = 'uploads') => {
  try {
    if (!files || files.length === 0) {
      throw new Error('Tidak ada file untuk diupload');
    }

    const uploadPromises = files.map(file => uploadToS3(file, folder));
    const urls = await Promise.all(uploadPromises);

    return urls;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw new Error('Gagal mengupload beberapa file');
  }
};

const deleteFromS3 = async (fileUrl) => {
  try {
    // Extract filename from URL
    const baseUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
    const filename = fileUrl.replace(baseUrl, '');

    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    console.log('✅ File deleted from S3:', filename);
    return true;
  } catch (error) {
    console.error('❌ Error deleting from S3:', error);
    return false;
  }
};

module.exports = {
  uploadToS3,
  uploadMultipleToS3,
  deleteFromS3,
};