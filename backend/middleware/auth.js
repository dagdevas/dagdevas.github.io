const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Middleware для проверки JWT токена
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Токен доступа не предоставлен'
      });
    }

    // Проверка токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Поиск администратора
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Администратор не найден'
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Аккаунт администратора деактивирован'
      });
    }

    // Добавление информации об администраторе в запрос
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Недействительный токен'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Токен истек'
      });
    }

    console.error('Ошибка аутентификации:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при аутентификации'
    });
  }
};

// Middleware для проверки роли администратора
const requireAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Доступ запрещен. Требуются права администратора'
    });
  }
};

// Middleware для обновления времени последнего входа
const updateLastLogin = async (req, res, next) => {
  try {
    if (req.admin) {
      await Admin.findByIdAndUpdate(req.admin._id, { lastLogin: new Date() });
    }
    next();
  } catch (error) {
    console.error('Ошибка обновления времени входа:', error);
    next(); // Продолжаем выполнение даже при ошибке
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  updateLastLogin
};
