const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Заголовок статьи обязателен'],
    trim: true,
    maxlength: [200, 'Заголовок не должен превышать 200 символов']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Содержимое статьи обязательно']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Краткое описание не должно превышать 500 символов']
  },
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  category: {
    type: String,
    enum: ['news', 'products', 'services', 'about', 'general'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  publishedAt: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Обновление updatedAt при изменении
articleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Автоматическое создание slug из заголовка
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Установка publishedAt при публикации
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Индексы для оптимизации поиска
articleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
articleSchema.index({ category: 1, status: 1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ isFeatured: 1, status: 1 });

// Виртуальное поле для URL статьи
articleSchema.virtual('url').get(function() {
  return `/articles/${this.slug}`;
});

// Метод для увеличения просмотров
articleSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Статический метод для поиска опубликованных статей
articleSchema.statics.findPublished = function() {
  return this.find({ status: 'published' }).sort({ publishedAt: -1 });
};

// Статический метод для поиска по категории
articleSchema.statics.findByCategory = function(category) {
  return this.find({ category, status: 'published' }).sort({ publishedAt: -1 });
};

module.exports = mongoose.model('Article', articleSchema);
