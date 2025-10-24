const express = require('express');
const Admin = require('../models/Admin');
const Article = require('../models/Article');
const { sendSuccess, sendError, sendValidationError, sendNotFound } = require('../utils/response');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Получение статистики дашборда
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Статистика статей
    const articleStats = await Article.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Общее количество просмотров
    const totalViews = await Article.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    // Последние статьи
    const recentArticles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name email')
      .select('title status createdAt views');

    // Статистика по категориям
    const categoryStats = await Article.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Популярные статьи
    const popularArticles = await Article.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(5)
      .select('title views publishedAt');

    sendSuccess(res, {
      articleStats,
      totalViews: totalViews[0]?.totalViews || 0,
      recentArticles,
      categoryStats,
      popularArticles
    }, 'Статистика дашборда получена успешно');

  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    sendError(res, 'Ошибка получения статистики дашборда', 500, error);
  }
});

// Получение списка всех администраторов
router.get('/admins', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    sendSuccess(res, admins, 'Список администраторов получен успешно');
  } catch (error) {
    console.error('Ошибка получения администраторов:', error);
    sendError(res, 'Ошибка получения списка администраторов', 500, error);
  }
});

// Создание нового администратора (только для суперадмина)
router.post('/admins', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { email, password, name } = req.body;

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

    sendSuccess(res, admin.toJSON(), 'Администратор создан успешно', 201);
  } catch (error) {
    console.error('Ошибка создания администратора:', error);
    sendError(res, 'Ошибка создания администратора', 500, error);
  }
});

// Обновление администратора
router.put('/admins/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, isActive } = req.body;

    // Проверка, что не обновляется сам себя
    if (id === req.admin._id.toString()) {
      return sendError(res, 'Нельзя обновлять свой собственный аккаунт', 400);
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) {
      // Проверка уникальности email
      const existingAdmin = await Admin.findOne({ email, _id: { $ne: id } });
      if (existingAdmin) {
        return sendError(res, 'Администратор с таким email уже существует', 400);
      }
      updates.email = email;
    }
    if (typeof isActive === 'boolean') updates.isActive = isActive;

    const admin = await Admin.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return sendNotFound(res, 'Администратор не найден');
    }

    sendSuccess(res, admin, 'Администратор обновлен успешно');
  } catch (error) {
    console.error('Ошибка обновления администратора:', error);
    sendError(res, 'Ошибка обновления администратора', 500, error);
  }
});

// Удаление администратора
router.delete('/admins/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Проверка, что не удаляется сам себя
    if (id === req.admin._id.toString()) {
      return sendError(res, 'Нельзя удалить свой собственный аккаунт', 400);
    }

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return sendNotFound(res, 'Администратор не найден');
    }

    sendSuccess(res, null, 'Администратор удален успешно');
  } catch (error) {
    console.error('Ошибка удаления администратора:', error);
    sendError(res, 'Ошибка удаления администратора', 500, error);
  }
});

// Получение настроек системы
router.get('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = {
      siteName: 'Завод металлоконструкций',
      siteDescription: 'Производство и продажа металлоконструкций',
      contactEmail: 'info@metall-plant.com',
      contactPhone: '+7 (XXX) XXX-XX-XX',
      socialMedia: {
        vk: '',
        telegram: '',
        whatsapp: ''
      },
      seo: {
        defaultTitle: 'Завод металлоконструкций',
        defaultDescription: 'Производство и продажа металлоконструкций',
        keywords: ['металлоконструкции', 'производство', 'завод']
      }
    };

    sendSuccess(res, settings, 'Настройки получены успешно');
  } catch (error) {
    console.error('Ошибка получения настроек:', error);
    sendError(res, 'Ошибка получения настроек', 500, error);
  }
});

// Обновление настроек системы
router.put('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Здесь можно добавить логику сохранения настроек в базе данных
    const settings = req.body;
    
    sendSuccess(res, settings, 'Настройки обновлены успешно');
  } catch (error) {
    console.error('Ошибка обновления настроек:', error);
    sendError(res, 'Ошибка обновления настроек', 500, error);
  }
});

// Получение логов активности (заглушка)
router.get('/logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const logs = [
      {
        id: 1,
        action: 'login',
        description: 'Вход в систему',
        timestamp: new Date(),
        ip: '127.0.0.1'
      },
      {
        id: 2,
        action: 'article_create',
        description: 'Создана новая статья',
        timestamp: new Date(Date.now() - 3600000),
        ip: '127.0.0.1'
      }
    ];

    sendSuccess(res, logs, 'Логи получены успешно');
  } catch (error) {
    console.error('Ошибка получения логов:', error);
    sendError(res, 'Ошибка получения логов', 500, error);
  }
});

module.exports = router;
