const express = require('express');
const Article = require('../models/Article');
const { sendSuccess, sendError, sendValidationError, sendNotFound } = require('../utils/response');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Получение всех статей (публичные)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search, 
      featured,
      sort = 'publishedAt'
    } = req.query;

    const query = { status: 'published' };
    
    // Фильтрация по категории
    if (category) {
      query.category = category;
    }
    
    // Фильтрация по featured
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    // Поиск по тексту
    if (search) {
      query.$text = { $search: search };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort]: -1 },
      populate: {
        path: 'author',
        select: 'name email'
      }
    };

    const articles = await Article.paginate(query, options);

    sendSuccess(res, {
      articles: articles.docs,
      pagination: {
        currentPage: articles.page,
        totalPages: articles.totalPages,
        totalArticles: articles.totalDocs,
        hasNext: articles.hasNextPage,
        hasPrev: articles.hasPrevPage
      }
    }, 'Статьи получены успешно');

  } catch (error) {
    console.error('Ошибка получения статей:', error);
    sendError(res, 'Ошибка получения статей', 500, error);
  }
});

// Получение статьи по slug (публичная)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await Article.findOne({ 
      slug, 
      status: 'published' 
    }).populate('author', 'name email');

    if (!article) {
      return sendNotFound(res, 'Статья не найдена');
    }

    // Увеличение счетчика просмотров
    await article.incrementViews();

    sendSuccess(res, article, 'Статья получена успешно');
  } catch (error) {
    console.error('Ошибка получения статьи:', error);
    sendError(res, 'Ошибка получения статьи', 500, error);
  }
});

// Получение всех статей (админ)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category, 
      search,
      sort = 'createdAt'
    } = req.query;

    const query = {};
    
    // Фильтрация по статусу
    if (status) {
      query.status = status;
    }
    
    // Фильтрация по категории
    if (category) {
      query.category = category;
    }
    
    // Поиск по тексту
    if (search) {
      query.$text = { $search: search };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort]: -1 },
      populate: {
        path: 'author',
        select: 'name email'
      }
    };

    const articles = await Article.paginate(query, options);

    sendSuccess(res, {
      articles: articles.docs,
      pagination: {
        currentPage: articles.page,
        totalPages: articles.totalPages,
        totalArticles: articles.totalDocs,
        hasNext: articles.hasNextPage,
        hasPrev: articles.hasPrevPage
      }
    }, 'Статьи получены успешно');

  } catch (error) {
    console.error('Ошибка получения статей:', error);
    sendError(res, 'Ошибка получения статей', 500, error);
  }
});

// Создание новой статьи (админ)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      isFeatured,
      status,
      seo
    } = req.body;

    // Валидация
    if (!title || !content) {
      return sendValidationError(res, {
        title: !title ? 'Заголовок обязателен' : null,
        content: !content ? 'Содержимое обязательно' : null
      });
    }

    const article = new Article({
      title,
      content,
      excerpt,
      category: category || 'general',
      tags: tags || [],
      featuredImage: featuredImage || {},
      isFeatured: isFeatured || false,
      status: status || 'draft',
      seo: seo || {},
      author: req.admin._id
    });

    await article.save();
    await article.populate('author', 'name email');

    sendSuccess(res, article, 'Статья создана успешно', 201);
  } catch (error) {
    console.error('Ошибка создания статьи:', error);
    sendError(res, 'Ошибка создания статьи', 500, error);
  }
});

// Обновление статьи (админ)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const article = await Article.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!article) {
      return sendNotFound(res, 'Статья не найдена');
    }

    sendSuccess(res, article, 'Статья обновлена успешно');
  } catch (error) {
    console.error('Ошибка обновления статьи:', error);
    sendError(res, 'Ошибка обновления статьи', 500, error);
  }
});

// Удаление статьи (админ)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return sendNotFound(res, 'Статья не найдена');
    }

    sendSuccess(res, null, 'Статья удалена успешно');
  } catch (error) {
    console.error('Ошибка удаления статьи:', error);
    sendError(res, 'Ошибка удаления статьи', 500, error);
  }
});

// Получение статьи по ID (админ)
router.get('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id).populate('author', 'name email');

    if (!article) {
      return sendNotFound(res, 'Статья не найдена');
    }

    sendSuccess(res, article, 'Статья получена успешно');
  } catch (error) {
    console.error('Ошибка получения статьи:', error);
    sendError(res, 'Ошибка получения статьи', 500, error);
  }
});

// Публикация/снятие с публикации статьи (админ)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return sendValidationError(res, {
        status: 'Статус должен быть draft, published или archived'
      });
    }

    const article = await Article.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!article) {
      return sendNotFound(res, 'Статья не найдена');
    }

    sendSuccess(res, article, `Статус статьи изменен на ${status}`);
  } catch (error) {
    console.error('Ошибка изменения статуса статьи:', error);
    sendError(res, 'Ошибка изменения статуса статьи', 500, error);
  }
});

// Получение статистики статей (админ)
router.get('/admin/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await Article.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalViews = await Article.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    const categoryStats = await Article.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    sendSuccess(res, {
      statusStats: stats,
      totalViews: totalViews[0]?.totalViews || 0,
      categoryStats
    }, 'Статистика получена успешно');
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    sendError(res, 'Ошибка получения статистики', 500, error);
  }
});

module.exports = router;
