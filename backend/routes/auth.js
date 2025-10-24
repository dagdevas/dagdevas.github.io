const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError, sendValidationError, sendUnauthorized } = require('../utils/response');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Регистрация администратора (только для первого админа)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Проверка, есть ли уже администраторы
    const existingAdmins = await Admin.countDocuments();
    if (existingAdmins > 0) {
      return sendError(res, 'Регистрация новых администраторов запрещена', 403);
    }

    // Валидация
    if (!email || !password || !name) {
      return sendValidationError(res, {
        email: !email ? 'Email обязателен' : null,
        password: !password ? 'Пароль обязателен' : null,
        name: !name ? 'Имя обязательно' : null
      });
    }

    if (password.length < 6) {
      return sendValidationError(res, {
        password: 'Пароль должен содержать минимум 6 символов'
      });
    }

    // Проверка существования администратора
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return sendError(res, 'Администратор с таким email уже существует', 400);
    }

    // Создание администратора
    const admin = new Admin({
      email,
      password,
      name
    });

    await admin.save();

    // Генерация токена
    const token = generateToken({ id: admin._id, role: admin.role });

    sendSuccess(res, {
      admin: admin.toJSON(),
      token
    }, 'Администратор успешно зарегистрирован', 201);

  } catch (error) {
    console.error('Ошибка регистрации:', error);
    sendError(res, 'Ошибка при регистрации администратора', 500, error);
  }
});

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
