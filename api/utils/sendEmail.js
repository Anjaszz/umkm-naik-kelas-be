const transporter = require('../config/email');

const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', options.email);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Gagal mengirim email');
  }
};

const sendOTPEmail = async (email, otp, nama, type = 'register') => {
  let headerTitle, contentText, subject;

  if (type === 'reset') {
    headerTitle = 'Reset Password UMKM Marketplace';
    contentText = 'Anda telah meminta untuk mereset password akun Anda. Silakan masukkan kode OTP berikut untuk melanjutkan proses reset password:';
    subject = 'Kode OTP Reset Password - UMKM Marketplace';
  } else {
    headerTitle = 'Selamat Datang di UMKM Marketplace';
    contentText = 'Terima kasih telah mendaftar di UMKM Marketplace! Akun Anda telah berhasil dibuat dan sudah aktif.';
    subject = 'Registrasi Berhasil - UMKM Marketplace';
  }

  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .otp-box { background-color: #fff; border: 2px dashed #4CAF50; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${headerTitle}</h1>
        </div>
        <div class="content">
          <p>Halo <strong>${nama}</strong>,</p>
          <p>${contentText}</p>
          ${type === 'reset' ? `
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>

          <p><strong>Kode OTP ini berlaku selama ${process.env.OTP_EXPIRE_MINUTES} menit.</strong></p>
          <p>Jika Anda tidak merasa meminta reset password, abaikan email ini atau segera ubah password Anda.</p>
          ` : `
          <p>Anda dapat langsung login menggunakan email dan password yang telah Anda daftarkan.</p>
          <p>Selamat berbelanja dan berbisnis di UMKM Marketplace!</p>
          `}
        </div>
        <div class="footer">
          <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
          <p>&copy; 2025 UMKM Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email,
    subject,
    message
  });
};

module.exports = { sendEmail, sendOTPEmail };