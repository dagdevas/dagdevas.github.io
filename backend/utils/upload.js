const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Создание папки uploads если её нет
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Создание папки для изображений
const imagesDir = path.join(uploadDir, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
// Создание папки для документов
const filesDir = path.join(uploadDir, 'files');
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    // Генерация уникального имени файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `image-${uniqueSuffix}${extension}`);
  }
});

// Фильтр для проверки типа файла (изображения)
const fileFilter = (req, file, cb) => {
  // Разрешенные типы изображений
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Разрешены только изображения (JPEG, JPG, PNG, GIF, WebP)'));
  }
};

// Настройка multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB максимум
  },
  fileFilter: fileFilter
});

// Middleware для загрузки одного изображения
const uploadSingle = upload.single('image');

// Middleware для загрузки нескольких изображений
const uploadMultiple = upload.array('images', 10);

// Настройка multer для документов (pdf/doc/docx/xls/xlsx)
const storageDocs = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, filesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${extension}`);
  }
});

const docsFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|xls|xlsx/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetypeOk = /application\//.test(file.mimetype) || /officedocument|pdf/.test(file.mimetype);
  if (extname && mimetypeOk) return cb(null, true);
  cb(new Error('Разрешены только документы (PDF, DOCX, XLSX)'));
};

const uploadDocs = multer({
  storage: storageDocs,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: docsFilter
});

// Middleware для загрузки одного документа
const uploadSingleDoc = uploadDocs.single('file');

// Функция для удаления файла
const deleteFile = (filename) => {
  const imagePath = path.join(imagesDir, filename);
  const docPath = path.join(filesDir, filename);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    return true;
  }
  if (fs.existsSync(docPath)) {
    fs.unlinkSync(docPath);
    return true;
  }
  return false;
};

// Функция для получения URL файла
const getFileUrl = (filename) => {
  if (filename.startsWith('image-')) return `/uploads/images/${filename}`;
  return `/uploads/files/${filename}`;
};

// Функция для очистки старых файлов (старше 30 дней)
const cleanupOldFiles = () => {
  const files = fs.readdirSync(imagesDir);
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

  files.forEach(file => {
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.mtime.getTime() < thirtyDaysAgo) {
      fs.unlinkSync(filePath);
      console.log(`Удален старый файл: ${file}`);
    }
  });
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadSingleDoc,
  deleteFile,
  getFileUrl,
  cleanupOldFiles
};
