const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' }
}, { _id: false });

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Заголовок обязателен'],
    trim: true,
    maxlength: [200, 'Заголовок не должен превышать 200 символов']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  contentHtml: {
    type: String,
    required: [true, 'Содержимое обязательно']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Краткое описание не должно превышать 500 символов']
  },
  coverImage: imageSchema,
  gallery: [imageSchema],
  tags: [{ type: String, trim: true }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  publishedAt: { type: Date, default: null },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

newsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();

  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-а-яё]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

newsSchema.index({ title: 'text', contentHtml: 'text', excerpt: 'text' });
newsSchema.index({ status: 1, publishedAt: -1 });

newsSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('News', newsSchema);


