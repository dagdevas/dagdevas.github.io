const express = require('express');
const { uploadSingle, uploadMultiple, deleteFile, getFileUrl } = require('../utils/upload');
const { sendSuccess, sendError } = require('../utils/response');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Загрузка одного изображения
router.post('/single', authenticateToken, requireAdmin, (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('Ошибка загрузки файла:', err);
      return sendError(res, err.message, 400);
    }

    if (!req.file) {
      return sendError(res, 'Файл не был загружен', 400);
    }

    const fileUrl = getFileUrl(req.file.filename);
    
    sendSuccess(res, {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl,
      path: req.file.path
    }, 'Файл загружен успешно');
  });
});

// Загрузка нескольких изображений
router.post('/multiple', authenticateToken, requireAdmin, (req, res) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      console.error('Ошибка загрузки файлов:', err);
      return sendError(res, err.message, 400);
    }

    if (!req.files || req.files.length === 0) {
      return sendError(res, 'Файлы не были загружены', 400);
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: getFileUrl(file.filename),
      path: file.path
    }));
    
    sendSuccess(res, { files }, 'Файлы загружены успешно');
  });
});

// Удаление файла
router.delete('/:filename', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { filename } = req.params;
    
    const deleted = deleteFile(filename);
    
    if (deleted) {
      sendSuccess(res, null, 'Файл удален успешно');
    } else {
      sendError(res, 'Файл не найден', 404);
    }
  } catch (error) {
    console.error('Ошибка удаления файла:', error);
    sendError(res, 'Ошибка удаления файла', 500);
  }
});

// Получение списка загруженных файлов
router.get('/list', authenticateToken, requireAdmin, (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const imagesDir = path.join(__dirname, '../uploads/images');
    
    const files = fs.readdirSync(imagesDir).map(filename => {
      const filePath = path.join(imagesDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        url: getFileUrl(filename),
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    sendSuccess(res, { files }, 'Список файлов получен успешно');
  } catch (error) {
    console.error('Ошибка получения списка файлов:', error);
    sendError(res, 'Ошибка получения списка файлов', 500);
  }
});

module.exports = router;
