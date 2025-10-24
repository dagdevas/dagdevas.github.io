// Конфигурация приложения
export const config = {
  // URL API сервера
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // Режим разработки
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Настройки для разработки
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

export default config;
