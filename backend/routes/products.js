const express = require('express');
const Product = require('../models/Product');
const { sendSuccess, sendError, sendValidationError, sendNotFound } = require('../utils/response');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Публичный список опубликованных продуктов
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, search, sort = '-createdAt' } = req.query;
    const query = { status: 'published' };
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);

    sendSuccess(res, {
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }, 'Продукция получена');
  } catch (error) {
    console.error('Ошибка получения продукции:', error);
    sendError(res, 'Ошибка получения продукции', 500, error);
  }
});

// Публично: продукт по slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, status: 'published' });
    if (!product) return sendNotFound(res, 'Продукт не найден');
    sendSuccess(res, product, 'Продукт получен');
  } catch (error) {
    console.error('Ошибка получения продукта:', error);
    sendError(res, 'Ошибка получения продукта', 500, error);
  }
});

// Админ: список всех
router.get('/admin/all/list', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 12, status, search, sort = '-createdAt' } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);

    sendSuccess(res, {
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }, 'Продукция (админ) получена');
  } catch (error) {
    console.error('Ошибка получения продукции (админ):', error);
    sendError(res, 'Ошибка получения продукции', 500, error);
  }
});

// Админ: получить продукт по ID
router.get('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return sendNotFound(res, 'Продукт не найден');
    sendSuccess(res, product, 'Продукт получен');
  } catch (error) {
    console.error('Ошибка получения продукта:', error);
    sendError(res, 'Ошибка получения продукта', 500, error);
  }
});

// Админ: создать
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, image, gallery, extra, status } = req.body;
    if (!title) return sendValidationError(res, { title: 'Заголовок обязателен' });

    const product = new Product({
      title,
      description: description || '',
      image: image || undefined,
      gallery: gallery || [],
      extra: extra || {},
      status: status || 'published'
    });
    await product.save();
    sendSuccess(res, product, 'Продукт создан', 201);
  } catch (error) {
    console.error('Ошибка создания продукта:', error);
    sendError(res, 'Ошибка создания продукта', 500, error);
  }
});

// Админ: обновить
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const product = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!product) return sendNotFound(res, 'Продукт не найден');
    sendSuccess(res, product, 'Продукт обновлен');
  } catch (error) {
    console.error('Ошибка обновления продукта:', error);
    sendError(res, 'Ошибка обновления продукта', 500, error);
  }
});

// Админ: удалить
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return sendNotFound(res, 'Продукт не найден');
    sendSuccess(res, null, 'Продукт удален');
  } catch (error) {
    console.error('Ошибка удаления продукта:', error);
    sendError(res, 'Ошибка удаления продукта', 500, error);
  }
});

module.exports = router;


