const os = require('os');
const logger = require('../config/winston');

class MetricsCollector {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        success: 0,
        errors: 0,
        byEndpoint: {}
      },
      system: {
        uptime: 0,
        memory: {},
        cpu: {}
      },
      database: {
        connections: 0,
        queries: 0
      }
    };
    
    this.startTime = Date.now();
  }

  // Registrar request
  recordRequest(req, res) {
    this.metrics.requests.total++;
    
    const endpoint = `${req.method} ${req.route?.path || req.path}`;
    
    if (!this.metrics.requests.byEndpoint[endpoint]) {
      this.metrics.requests.byEndpoint[endpoint] = {
        count: 0,
        success: 0,
        errors: 0,
        avgResponseTime: 0
      };
    }
    
    this.metrics.requests.byEndpoint[endpoint].count++;
    
    if (res.statusCode < 400) {
      this.metrics.requests.success++;
      this.metrics.requests.byEndpoint[endpoint].success++;
    } else {
      this.metrics.requests.errors++;
      this.metrics.requests.byEndpoint[endpoint].errors++;
    }
  }

  // Obtener métricas del sistema
  getSystemMetrics() {
    const uptime = process.uptime();
    const memUsage = process.memoryUsage();
    
    this.metrics.system = {
      uptime: uptime,
      uptimeFormatted: this.formatUptime(uptime),
      memory: {
        used: (memUsage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
        total: (memUsage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
        percentage: ((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(2) + '%'
      },
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0]?.model || 'Unknown',
        loadAvg: os.loadavg().map(load => load.toFixed(2))
      },
      platform: {
        type: os.type(),
        release: os.release(),
        arch: os.arch()
      }
    };
    
    return this.metrics.system;
  }

  // Formatear uptime
  formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  }

  // Obtener todas las métricas
  getAllMetrics() {
    return {
      ...this.metrics,
      system: this.getSystemMetrics(),
      timestamp: new Date().toISOString()
    };
  }

  // Registrar query de base de datos
  recordDatabaseQuery() {
    this.metrics.database.queries++;
  }

  // Obtener resumen
  getSummary() {
    const metrics = this.getAllMetrics();
    
    return {
      uptime: metrics.system.uptimeFormatted,
      totalRequests: metrics.requests.total,
      successRate: metrics.requests.total > 0 
        ? ((metrics.requests.success / metrics.requests.total) * 100).toFixed(2) + '%'
        : '0%',
      errorRate: metrics.requests.total > 0
        ? ((metrics.requests.errors / metrics.requests.total) * 100).toFixed(2) + '%'
        : '0%',
      memoryUsage: metrics.system.memory.percentage,
      topEndpoints: this.getTopEndpoints(5)
    };
  }

  // Obtener endpoints más usados
  getTopEndpoints(limit = 5) {
    const endpoints = Object.entries(this.metrics.requests.byEndpoint)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, limit)
      .map(([endpoint, stats]) => ({
        endpoint,
        count: stats.count,
        successRate: stats.count > 0 
          ? ((stats.success / stats.count) * 100).toFixed(2) + '%'
          : '0%'
      }));
    
    return endpoints;
  }

  // Log periódico de métricas
  startPeriodicLogging(intervalMinutes = 5) {
    setInterval(() => {
      const summary = this.getSummary();
      logger.info('Métricas del sistema', { metrics: summary });
    }, intervalMinutes * 60 * 1000);
  }

  // Reset de métricas
  reset() {
    this.metrics.requests = {
      total: 0,
      success: 0,
      errors: 0,
      byEndpoint: {}
    };
    this.metrics.database.queries = 0;
  }
}

// Singleton
const metricsCollector = new MetricsCollector();

module.exports = metricsCollector;