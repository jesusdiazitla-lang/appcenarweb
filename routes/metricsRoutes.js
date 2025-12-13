const express = require('express');
const router = express.Router();
const metricsCollector = require('../monitoring/metrics');
const checkRole = require('../middleware/roles');

// Solo admins pueden ver métricas
router.use(checkRole('administrador'));

// GET /metrics - Dashboard de métricas
router.get('/', (req, res) => {
  const metrics = metricsCollector.getAllMetrics();
  const summary = metricsCollector.getSummary();
  
  res.render('admin/metrics', {
    layout: 'layouts/admin',
    title: 'Métricas del Sistema',
    metrics,
    summary
  });
});

// GET /metrics/api - API JSON de métricas
router.get('/api', (req, res) => {
  const metrics = metricsCollector.getAllMetrics();
  res.json(metrics);
});

// GET /metrics/summary - Resumen JSON
router.get('/summary', (req, res) => {
  const summary = metricsCollector.getSummary();
  res.json(summary);
});

// POST /metrics/reset - Resetear métricas
router.post('/reset', (req, res) => {
  metricsCollector.reset();
  req.flash('success', 'Métricas reseteadas exitosamente');
  res.redirect('/metrics');
});

// GET /metrics/health - Health check
router.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.json(health);
});

module.exports = router;