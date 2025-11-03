const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  
  // Buyer specific fields
  nama: {
    type: String,
    required: function() { return this.role === 'buyer'; }
  },
  
  // Seller specific fields
  namaToko: {
    type: String,
    required: function() { return this.role === 'seller'; }
  },
  fotoProfil: {
    type: String,
    default: null
  },
  domisili: {
    type: String,
    required: function() { return this.role === 'seller'; }
  },
  jenisUsaha: {
    type: String,
    required: function() { return this.role === 'seller'; }
  },
  nomorIzinUsaha: {
    type: String,
    required: function() { return this.role === 'seller'; }
  },
  alamatUsaha: {
    type: String,
    required: function() { return this.role === 'seller'; }
  },
  whatsapp: {
    type: String,
    required: function() { return this.role === 'seller'; }
  },
  facebook: {
    type: String,
    default: null
  },
  instagram: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  this.otp = otp;
  this.otpExpiry = new Date(Date.now() + parseInt(process.env.OTP_EXPIRE_MINUTES) * 60 * 1000);
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(inputOTP) {
  if (!this.otp || !this.otpExpiry) {
    return false;
  }
  
  if (new Date() > this.otpExpiry) {
    return false;
  }
  
  return this.otp === inputOTP;
};

module.exports = mongoose.model('User', userSchema);