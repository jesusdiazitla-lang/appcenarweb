const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// GET /health - Health check básico
router.get('/', async (req, res) => {
  const healthcheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: require('../package.json').version,
    checks: {}
  };

  try {
    // Check de MongoDB
    if (mongoose.connection.readyState === 1) {
      healthcheck.checks.database = {
        status: 'connected',
        name: mongoose.connection.name
      };
    } else {
      healthcheck.checks.database = {
        status: 'disconnected'
      };
      healthcheck.status = 'degraded';
    }

    // Check de memoria
    const memUsage = process.memoryUsage();
    const memoryPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    
    healthcheck.checks.memory = {
      status: memoryPercentage < 90 ? 'ok' : 'warning',
      used: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      total: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      percentage: `${memoryPercentage.toFixed(2)}%`
    };

    // Determinar status code
    const statusCode = healthcheck.status === 'ok' ? 200 : 503;
    
    res.status(statusCode).json(healthcheck);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// GET /health/live - Liveness probe (para Kubernetes/Docker)
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

// GET /health/ready - Readiness probe
router.get('/ready', async (req, res) => {
  try {
    // Verificar que MongoDB esté conectado
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: 'not ready',
        reason: 'database not connected'
      });
    }

    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message
    });
  }
});

module.exports = router;