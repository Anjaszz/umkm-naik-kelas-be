const checkRole = (...roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
  
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Akses ditolak. Fitur ini hanya untuk ${roles.join(' atau ')}`
        });
      }
  
      next();
    };
  };
  
  module.exports = checkRole;