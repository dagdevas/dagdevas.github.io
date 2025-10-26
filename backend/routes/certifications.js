const express = require('express');
const Certification = require('../models/Certification');
const { sendSuccess, sendError, sendValidationError, sendNotFound } = require('../utils/response');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Публичный список сертификатов
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, search, sort = '-createdAt' } = req.query;
    const query = { status: 'published' };
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Certification.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Certification.countDocuments(query)
    ]);

    sendSuccess(res, {
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }, 'Сертификаты получены');
  } catch (error) {
    console.error('Ошибка получения сертификатов:', error);
    sendError(res, 'Ошибка получения сертификатов', 500, error);
  }
});

// Публично: сертификат по slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const cert = await Certification.findOne({ slug, status: 'published' });
    if (!cert) return sendNotFound(res, 'Сертификат не найден');
    sendSuccess(res, cert, 'Сертификат получен');
  } catch (error) {
    console.error('Ошибка получения сертификата:', error);
    sendError(res, 'Ошибка получения сертификата', 500, error);
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
      Certification.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Certification.countDocuments(query)
    ]);

    sendSuccess(res, {
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }, 'Сертификаты (админ) получены');
  } catch (error) {
    console.error('Ошибка получения сертификатов (админ):', error);
    sendError(res, 'Ошибка получения сертификатов', 500, error);
  }
});

// Админ: получить сертификат по ID
router.get('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await Certification.findById(id);
    if (!cert) return sendNotFound(res, 'Сертификат не найден');
    sendSuccess(res, cert, 'Сертификат получен');
  } catch (error) {
    console.error('Ошибка получения сертификата:', error);
    sendError(res, 'Ошибка получения сертификата', 500, error);
  }
});

// Админ: создать
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, text, description, image, file, status } = req.body;
    if (!title) return sendValidationError(res, { title: 'Заголовок обязателен' });

    const cert = new Certification({
      title,
      text: text || '',
      description: description || '',
      image: image || undefined,
      file: file || undefined,
      status: status || 'published'
    });
    await cert.save();
    sendSuccess(res, cert, 'Сертификат создан', 201);
  } catch (error) {
    console.error('Ошибка создания сертификата:', error);
    sendError(res, 'Ошибка создания сертификата', 500, error);
  }
});

// Админ: обновить
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const cert = await Certification.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!cert) return sendNotFound(res, 'Сертификат не найден');
    sendSuccess(res, cert, 'Сертификат обновлен');
  } catch (error) {
    console.error('Ошибка обновления сертификата:', error);
    sendError(res, 'Ошибка обновления сертификата', 500, error);
  }
});

// Админ: удалить
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await Certification.findByIdAndDelete(id);
    if (!cert) return sendNotFound(res, 'Сертификат не найден');
    sendSuccess(res, null, 'Сертификат удален');
  } catch (error) {
    console.error('Ошибка удаления сертификата:', error);
    sendError(res, 'Ошибка удаления сертификата', 500, error);
  }
});

module.exports = router;


