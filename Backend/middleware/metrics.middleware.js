
import   client from 'prom-client'


export const register = new client.Registry();
register.setDefaultLabels({ app: 'nodejs-backend-service' });

// Automatically collect CPU, Memory, and Event Loop Lag metrics
client.collectDefaultMetrics({ register });

// 3. Define a custom metric to trace HTTP performance (Latencies)
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 3, 5] // Time thresholds to sort requests into
});
register.registerMetric(httpRequestDuration);

//Express middleware to measure endpoint execution speeds
export const metricsMiddleware = (req, res, next) => {
  const end = httpRequestDuration.startTimer();
  
  // Track metrics when the request finishes
  res.on('finish', () => {
    // Avoid tracking the metrics endpoint itself or static asset paths
    if (req.route && req.path !== '/metrics') {
      end({ 
        method: req.method, 
        route: req.route.path, 
        status_code: res.statusCode 
      });

    }
  });
  
  next();
};
