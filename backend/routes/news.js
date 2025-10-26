const express = require('express');
const News = require('../models/News');
const { sendSuccess, sendError, sendValidationError, sendNotFound } = require('../utils/response');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Публичный список опубликованных новостей с пагинацией/поиском
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sort = '-publishedAt' } = req.query;

    const query = { status: 'published' };
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [items, total] = await Promise.all([
      News.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      News.countDocuments(query)
    ]);

    sendSuccess(res, {
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }, 'Новости получены');
  } catch (error) {
    console.error('Ошибка получения новостей:', error);
    sendError(res, 'Ошибка получения новостей', 500, error);
  }
});

// Публичная новость по slug с увеличением просмотров
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const news = await News.findOne({ slug, status: 'published' });
    if (!news) return sendNotFound(res, 'Новость не найдена');
    await news.incrementViews();
    sendSuccess(res, news, 'Новость получена');
  } catch (error) {
    console.error('Ошибка получения новости:', error);
    sendError(res, 'Ошибка получения новости', 500, error);
  }
});

// Админ: список всех новостей
router.get('/admin/all/list', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sort = '-createdAt' } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      News.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      News.countDocuments(query)
    ]);

    sendSuccess(res, {
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }, 'Новости (админ) получены');
  } catch (error) {
    console.error('Ошибка получения новостей (админ):', error);
    sendError(res, 'Ошибка получения новостей', 500, error);
  }
});

// Админ: получить новость по ID
router.get('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);
    if (!news) return sendNotFound(res, 'Новость не найдена');
    sendSuccess(res, news, 'Новость получена');
  } catch (error) {
    console.error('Ошибка получения новости:', error);
    sendError(res, 'Ошибка получения новости', 500, error);
  }
});

// Админ: создать новость
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, contentHtml, excerpt, coverImage, gallery, tags, status } = req.body;
    if (!title || !contentHtml) {
      return sendValidationError(res, {
        title: !title ? 'Заголовок обязателен' : null,
        contentHtml: !contentHtml ? 'Контент обязателен' : null
      });
    }

    const news = new News({
      title,
      contentHtml,
      excerpt,
      coverImage: coverImage || undefined,
      gallery: gallery || [],
      tags: tags || [],
      status: status || 'draft',
      author: req.admin?._id
    });
    await news.save();
    sendSuccess(res, news, 'Новость создана', 201);
  } catch (error) {
    console.error('Ошибка создания новости:', error);
    sendError(res, 'Ошибка создания новости', 500, error);
  }
});

// Админ: обновить новость
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const news = await News.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!news) return sendNotFound(res, 'Новость не найдена');
    sendSuccess(res, news, 'Новость обновлена');
  } catch (error) {
    console.error('Ошибка обновления новости:', error);
    sendError(res, 'Ошибка обновления новости', 500, error);
  }
});

// Админ: удалить новость
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByIdAndDelete(id);
    if (!news) return sendNotFound(res, 'Новость не найдена');
    sendSuccess(res, null, 'Новость удалена');
  } catch (error) {
    console.error('Ошибка удаления новости:', error);
    sendError(res, 'Ошибка удаления новости', 500, error);
  }
});

// Админ: смена статуса
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['draft', 'published', 'archived'].includes(status)) {
      return sendValidationError(res, { status: 'Недопустимый статус' });
    }
    const news = await News.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!news) return sendNotFound(res, 'Новость не найдена');
    sendSuccess(res, news, 'Статус обновлен');
  } catch (error) {
    console.error('Ошибка обновления статуса новости:', error);
    sendError(res, 'Ошибка обновления статуса новости', 500, error);
  }
});

module.exports = router;


