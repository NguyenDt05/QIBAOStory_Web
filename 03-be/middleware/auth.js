const jwt = require('jsonwebtoken');

// Ưu tiên dùng biến môi trường, nếu không có thì dùng key mặc định
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

/**
 * Xác thực JWT trong header Authorization: Bearer <token>
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập để tiếp tục' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Gắn thông tin giải mã (userid, username, role) vào req.user
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Phiên đăng nhập hết hạn hoặc không hợp lệ' });
  }
}

/**
 * Chỉ cho phép role = 'admin' (Viết thường theo chuẩn DB mới)
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Quyền truy cập bị từ chối. Bạn không phải là Admin!' 
    });
  }
  next();
}

/**
 * Xác thực JWT nhưng KHÔNG báo lỗi nếu không có token.
 * Dùng cho các route cho phép cả khách và User (như đọc truyện có khóa chương).
 */
function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return next();

  const token = authHeader.split(' ')[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    // Có token nhưng hết hạn/sai -> Bỏ qua, coi như khách
  }
  next();
}

/**
 * Chỉ cho phép Chủ sở hữu (Owner) hoặc Admin thực hiện hành động
 */
function requireOwnerOrAdmin(req, res, next) {
  const targetId = String(req.params.id || req.params.userid);
  const currentUserId = String(req.user.userid);

  console.log('[DEBUG-AUTH] requireOwnerOrAdmin:', { 
    params: req.params, 
    user: req.user, 
    targetId, 
    currentUserId 
  });

  if (req.user.role === 'admin' || currentUserId === targetId) {
    return next();
  }

  return res.status(403).json({ 
    success: false, 
    message: 'Quyền truy cập bị từ chối. Bạn không có quyền thao tác trên người dùng này!' 
  });
}

module.exports = { authenticate, requireAdmin, optionalAuthenticate, requireOwnerOrAdmin };