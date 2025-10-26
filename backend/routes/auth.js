const express = require('express');
const Admin = require('../models/Admin');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError, sendValidationError, sendUnauthorized } = require('../utils/response');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Регистрация отключена: админ создается скриптом initAdmin и доступен только логин

// Вход администратора
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
      return sendValidationError(res, {
        email: !email ? 'Email обязателен' : null,
        password: !password ? 'Пароль обязателен' : null
      });
    }

    // Поиск администратора
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return sendUnauthorized(res, 'Неверные учетные данные');
    }

    // Проверка активности
    if (!admin.isActive) {
      return sendUnauthorized(res, 'Аккаунт деактивирован');
    }

    // Проверка пароля
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return sendUnauthorized(res, 'Неверные учетные данные');
    }

    // Обновление времени последнего входа
    admin.lastLogin = new Date();
    await admin.save();

    // Генерация токена
    const token = generateToken({ id: admin._id, role: admin.role });

    sendSuccess(res, {
      admin: admin.toJSON(),
      token
    }, 'Успешный вход в систему');

  } catch (error) {
    console.error('Ошибка входа:', error);
    sendError(res, 'Ошибка при входе в систему', 500, error);
  }
});

// Получение информации о текущем администраторе
router.get('/me', authenticateToken, async (req, res) => {
  try {
    sendSuccess(res, req.admin, 'Информация об администраторе получена');
  } catch (error) {
    console.error('Ошибка получения информации:', error);
    sendError(res, 'Ошибка получения информации об администраторе', 500, error);
  }
});

// Выход из системы (на клиенте просто удаляется токен)
router.post('/logout', authenticateToken, (req, res) => {
  sendSuccess(res, null, 'Успешный выход из системы');
});

// Обновление профиля администратора
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) {
      // Проверка уникальности email
      const existingAdmin = await Admin.findOne({ email, _id: { $ne: req.admin._id } });
      if (existingAdmin) {
        return sendError(res, 'Администратор с таким email уже существует', 400);
      }
      updates.email = email;
    }

    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      updates,
      { new: true, runValidators: true }
    );

    sendSuccess(res, admin, 'Профиль успешно обновлен');
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    sendError(res, 'Ошибка обновления профиля', 500, error);
  }
});

// Смена пароля
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendValidationError(res, {
        currentPassword: !currentPassword ? 'Текущий пароль обязателен' : null,
        newPassword: !newPassword ? 'Новый пароль обязателен' : null
      });
    }

    if (newPassword.length < 6) {
      return sendValidationError(res, {
        newPassword: 'Новый пароль должен содержать минимум 6 символов'
      });
    }

    // Получение администратора с паролем
    const admin = await Admin.findById(req.admin._id).select('+password');
    
    // Проверка текущего пароля
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return sendError(res, 'Неверный текущий пароль', 400);
    }

    // Обновление пароля
    admin.password = newPassword;
    await admin.save();

    sendSuccess(res, null, 'Пароль успешно изменен');
  } catch (error) {
    console.error('Ошибка смены пароля:', error);
    sendError(res, 'Ошибка смены пароля', 500, error);
  }
});

module.exports = router;
