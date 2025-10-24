# Backend API для сайта завода металлоконструкций

## Описание

Backend API для управления контентом сайта завода металлоконструкций. Включает систему авторизации для администратора и функционал для управления статьями.

## Технологии

- **Node.js** - серверная платформа
- **Express.js** - веб-фреймворк
- **MongoDB** - база данных
- **Mongoose** - ODM для MongoDB
- **JWT** - аутентификация
- **bcryptjs** - хеширование паролей
- **Multer** - загрузка файлов

## Установка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Скопируйте `config.env` и настройте переменные:

```bash
# Настройки сервера
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/metall-plant

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Админ по умолчанию
ADMIN_EMAIL=admin@metall-plant.com
ADMIN_PASSWORD=admin123

# CORS
FRONTEND_URL=http://localhost:3000
```

### 3. Запуск MongoDB

Убедитесь, что MongoDB запущена на вашем компьютере.

### 4. Инициализация первого администратора

```bash
npm run init-admin
```

### 5. Запуск сервера

```bash
# Режим разработки
npm run dev

# Продакшн режим
npm start
```

## API Endpoints

### Аутентификация

- `POST /api/auth/register` - Регистрация первого администратора
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/me` - Получение информации о текущем администраторе
- `POST /api/auth/logout` - Выход из системы
- `PUT /api/auth/profile` - Обновление профиля
- `PUT /api/auth/change-password` - Смена пароля

### Статьи

- `GET /api/articles` - Получение опубликованных статей
- `GET /api/articles/:slug` - Получение статьи по slug
- `GET /api/articles/admin/all` - Получение всех статей (админ)
- `POST /api/articles` - Создание статьи (админ)
- `PUT /api/articles/:id` - Обновление статьи (админ)
- `DELETE /api/articles/:id` - Удаление статьи (админ)
- `GET /api/articles/admin/:id` - Получение статьи по ID (админ)
- `PATCH /api/articles/:id/status` - Изменение статуса статьи (админ)

### Загрузка файлов

- `POST /api/upload/single` - Загрузка одного изображения
- `POST /api/upload/multiple` - Загрузка нескольких изображений
- `DELETE /api/upload/:filename` - Удаление файла
- `GET /api/upload/list` - Получение списка файлов

### Администрирование

- `GET /api/admin/dashboard` - Статистика дашборда
- `GET /api/admin/admins` - Список администраторов
- `POST /api/admin/admins` - Создание администратора
- `PUT /api/admin/admins/:id` - Обновление администратора
- `DELETE /api/admin/admins/:id` - Удаление администратора
- `GET /api/admin/settings` - Получение настроек
- `PUT /api/admin/settings` - Обновление настроек
- `GET /api/admin/logs` - Получение логов

## Модели данных

### Admin
- `email` - Email администратора
- `password` - Пароль (хешированный)
- `name` - Имя администратора
- `role` - Роль (admin)
- `isActive` - Активность аккаунта
- `lastLogin` - Время последнего входа

### Article
- `title` - Заголовок статьи
- `slug` - URL-слаг
- `content` - Содержимое статьи
- `excerpt` - Краткое описание
- `featuredImage` - Изображение статьи
- `category` - Категория
- `tags` - Теги
- `status` - Статус (draft/published/archived)
- `isFeatured` - Рекомендуемая статья
- `author` - Автор (ссылка на Admin)
- `publishedAt` - Дата публикации
- `views` - Количество просмотров
- `seo` - SEO данные

## Безопасность

- JWT токены для аутентификации
- Хеширование паролей с bcrypt
- Rate limiting для защиты от DDoS
- Helmet для безопасности заголовков
- CORS настройки
- Валидация входных данных

## Структура проекта

```
backend/
├── models/          # Модели данных
├── routes/          # Маршруты API
├── middleware/      # Middleware функции
├── utils/           # Утилиты
├── scripts/         # Скрипты инициализации
├── uploads/         # Загруженные файлы
├── server.js        # Главный файл сервера
└── package.json     # Зависимости
```

## Разработка

Для разработки используется nodemon для автоматической перезагрузки сервера при изменениях.

```bash
npm run dev
```

## Продакшн

Для продакшн развертывания:

1. Установите переменные окружения
2. Настройте MongoDB
3. Запустите `npm run init-admin` для создания первого администратора
4. Запустите `npm start`
