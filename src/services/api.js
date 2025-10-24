import axios from "axios";

// Базовый URL API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создание экземпляра axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// API для аутентификации
export const authAPI = {
  // Вход в систему
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Получение информации о текущем пользователе
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Выход из системы
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Обновление профиля
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  // Смена пароля
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};

// API для статей
export const articlesAPI = {
  // Получение всех статей (публичные)
  getArticles: async (params = {}) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  // Получение статьи по slug
  getArticleBySlug: async (slug) => {
    const response = await api.get(`/articles/${slug}`);
    return response.data;
  },

  // Получение всех статей (админ)
  getAllArticles: async (params = {}) => {
    const response = await api.get('/articles/admin/all', { params });
    return response.data;
  },

  // Создание статьи
  createArticle: async (data) => {
    const response = await api.post('/articles', data);
    return response.data;
  },

  // Обновление статьи
  updateArticle: async (id, data) => {
    const response = await api.put(`/articles/${id}`, data);
    return response.data;
  },

  // Удаление статьи
  deleteArticle: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },

  // Получение статьи по ID (админ)
  getArticleById: async (id) => {
    const response = await api.get(`/articles/admin/${id}`);
    return response.data;
  },

  // Изменение статуса статьи
  updateArticleStatus: async (id, status) => {
    const response = await api.patch(`/articles/${id}/status`, { status });
    return response.data;
  }
};

// API для загрузки файлов
export const uploadAPI = {
  // Загрузка одного файла
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Загрузка нескольких файлов
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Удаление файла
  deleteFile: async (filename) => {
    const response = await api.delete(`/upload/${filename}`);
    return response.data;
  },

  // Получение списка файлов
  getFiles: async () => {
    const response = await api.get('/upload/list');
    return response.data;
  }
};

// API для администрирования
export const adminAPI = {
  // Получение статистики дашборда
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Получение настроек
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  // Обновление настроек
  updateSettings: async (data) => {
    const response = await api.put('/admin/settings', data);
    return response.data;
  }
};

export default api;
