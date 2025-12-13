const morgan = require('morgan');
const logger = require('../config/winston');

// Formato personalizado de Morgan
morgan.token('user', (req) => {
  return req.session?.user?.nombreUsuario || 'guest';
});

morgan.token('rol', (req) => {
  return req.session?.user?.rol || 'none';
});

// Formato personalizado: incluye usuario y rol
const morganFormat = ':method :url :status :response-time ms - :user (:rol)';

// Configurar Morgan para usar Winston
const requestLogger = morgan(morganFormat, {
  stream: logger.stream,
  skip: (req) => {
    // No loguear archivos estáticos en producción
    if (process.env.NODE_ENV === 'production') {
      return req.url.startsWith('/css') || 
             req.url.startsWith('/js') || 
             req.url.startsWith('/images');
    }
    return false;
  }
});

module.exports = requestLogger;