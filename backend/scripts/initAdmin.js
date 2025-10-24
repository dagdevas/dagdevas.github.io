const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config({ path: './config.env' });

const initAdmin = async () => {
  try {
    // Подключение к MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/metall-plant', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Подключение к MongoDB успешно');

    // Проверка существования администраторов
    const existingAdmins = await Admin.countDocuments();
    
    if (existingAdmins > 0) {
      console.log('ℹ️  Администраторы уже существуют в базе данных');
      process.exit(0);
    }

    // Создание первого администратора
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL || 'admin@metall-plant.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'Главный администратор',
      role: 'admin'
    });

    await admin.save();

    console.log('✅ Первый администратор создан успешно');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Пароль: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('⚠️  Рекомендуется сменить пароль после первого входа');

    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка инициализации администратора:', error);
    process.exit(1);
  }
};

initAdmin();
