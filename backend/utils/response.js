// Универсальные функции для ответов API

const sendSuccess = (res, data = null, message = 'Успешно', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const sendError = (res, message = 'Ошибка сервера', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (error && process.env.NODE_ENV === 'development') {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

const sendValidationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Ошибки валидации',
    errors,
    timestamp: new Date().toISOString()
  });
};

const sendNotFound = (res, message = 'Ресурс не найден') => {
  return res.status(404).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

const sendUnauthorized = (res, message = 'Неавторизованный доступ') => {
  return res.status(401).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

const sendForbidden = (res, message = 'Доступ запрещен') => {
  return res.status(403).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden
};
