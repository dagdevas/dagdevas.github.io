const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: './config.env' });

const app = express();

// CORS - ДО ВСЕГО ОСТАЛЬНОГО
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware безопасности
app.use(helmet());

// Логирование
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP
  message: 'Слишком много запросов с этого IP, попробуйте позже.'
});
app.use('/api/', limiter);

// Парсинг JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Статическая раздача загруженных файлов
app.use('/uploads', express.static('uploads'));

// Статическая раздача HTML файлов
app.use('/admin', express.static('public'));

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/metall-plant', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Подключение к MongoDB успешно'))
.catch(err => console.error('❌ Ошибка подключения к MongoDB:', err));

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const newsRoutes = require('./routes/news');
const productsRoutes = require('./routes/products');
const certificationsRoutes = require('./routes/certifications');

// Маршруты API
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/certifications', certificationsRoutes);

// Базовый маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'API сервера завода металлоконструкций',
    version: '1.0.0',
    status: 'running'
  });
});

// Обработка 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не найден'
  });
});

// Глобальная обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Что-то пошло не так'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📱 Режим: ${process.env.NODE_ENV || 'development'}`);
});
