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
      // HashRouter редирект
      window.location.hash = '#/admin/login';
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

// API для новостей
export const newsAPI = {
  getNews: async (params = {}) => {
    const response = await api.get('/news', { params });
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await api.get(`/news/${slug}`);
    return response.data;
  },
  getAllAdmin: async (params = {}) => {
    const response = await api.get('/news/admin/all/list', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/news', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/news/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.patch(`/news/${id}/status`, { status });
    return response.data;
  }
};

// API для продукции
export const productsAPI = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await api.get(`/products/${slug}`);
    return response.data;
  },
  getAllAdmin: async (params = {}) => {
    const response = await api.get('/products/admin/all/list', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

// API для сертификатов
export const certificationsAPI = {
  getCertifications: async (params = {}) => {
    const response = await api.get('/certifications', { params });
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await api.get(`/certifications/${slug}`);
    return response.data;
  },
  getAllAdmin: async (params = {}) => {
    const response = await api.get('/certifications/admin/all/list', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/certifications', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/certifications/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await api.delete(`/certifications/${id}`);
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

  // Загрузка документа
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
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
  },

  // Получение списка документов
  getDocs: async () => {
    const response = await api.get('/upload/list-docs');
    return response.data;
  }
};

export default api;
