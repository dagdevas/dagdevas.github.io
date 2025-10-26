const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: '' }
}, { _id: false });

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  originalName: { type: String, default: '' },
  size: { type: Number, default: 0 }
}, { _id: false });

const certificationSchema = new mongoose.Schema({
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
  text: { type: String, default: '' },
  description: { type: String, default: '' },
  image: imageSchema,
  file: fileSchema,
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

certificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();

  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-а-яё]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  next();
});

certificationSchema.index({ title: 'text', description: 'text', text: 'text' });
certificationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Certification', certificationSchema);


