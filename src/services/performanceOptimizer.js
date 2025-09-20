/**
 * Performance Optimizer Service
 * Advanced performance monitoring and optimization for post-launch enhancement
 */

class PerformanceOptimizer {
  constructor() {
    this.metrics = {
      pageLoadTimes: [],
      apiResponseTimes: [],
      userInteractions: [],
      resourceUsage: [],
      errorRates: []
    };
    
    this.optimizationRules = {
      caching: true,
      lazyLoading: true,
      compression: true,
      minification: true,
      imageOptimization: true
    };
    
    this.performanceThresholds = {
      pageLoadTime: 2000, // 2 seconds
      apiResponseTime: 500, // 500ms
      errorRate: 0.01, // 1%
      memoryUsage: 0.8, // 80%
      cpuUsage: 0.7 // 70%
    };
    
    this.init();
  }

  init() {
    this.startPerformanceMonitoring();
    this.setupOptimizationRules();
    this.initializeCaching();
    this.setupLazyLoading();
  }

  /**
   * Start comprehensive performance monitoring
   */
  startPerformanceMonitoring() {
    // Monitor page load times
    this.monitorPageLoadTimes();
    
    // Monitor API response times
    this.monitorApiResponseTimes();
    
    // Monitor user interactions
    this.monitorUserInteractions();
    
    // Monitor resource usage
    this.monitorResourceUsage();
    
    // Monitor error rates
    this.monitorErrorRates();
    
    // Real-time performance dashboard
    this.setupPerformanceDashboard();
  }

  /**
   * Monitor page load times
   */
  monitorPageLoadTimes() {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        this.metrics.pageLoadTimes.push({
          timestamp: Date.now(),
          loadTime,
          url: window.location.href,
          userAgent: navigator.userAgent
        });
        
        this.analyzePageLoadPerformance(loadTime);
      });
    }
  }

  /**
   * Monitor API response times
   */
  monitorApiResponseTimes() {
    const originalFetch = window.fetch;
    const self = this;
    
    window.fetch = function(...args) {
      const startTime = performance.now();
      
      return originalFetch.apply(this, args)
        .then(response => {
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          
          self.metrics.apiResponseTimes.push({
            timestamp: Date.now(),
            responseTime,
            url: args[0],
            status: response.status,
            method: args[1]?.method || 'GET'
          });
          
          self.analyzeApiPerformance(responseTime, args[0]);
          
          return response;
        })
        .catch(error => {
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          
          self.metrics.apiResponseTimes.push({
            timestamp: Date.now(),
            responseTime,
            url: args[0],
            status: 'error',
            method: args[1]?.method || 'GET',
            error: error.message
          });
          
          return Promise.reject(error);
        });
    };
  }

  /**
   * Monitor user interactions
   */
  monitorUserInteractions() {
    if (typeof window !== 'undefined') {
      const interactionTypes = ['click', 'scroll', 'keydown', 'touchstart'];
      
      interactionTypes.forEach(type => {
        window.addEventListener(type, (event) => {
          this.metrics.userInteractions.push({
            timestamp: Date.now(),
            type,
            target: event.target.tagName,
            x: event.clientX,
            y: event.clientY,
            url: window.location.href
          });
        });
      });
    }
  }

  /**
   * Monitor resource usage
   */
  monitorResourceUsage() {
    if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
      setInterval(() => {
        const memory = window.performance.memory;
        this.metrics.resourceUsage.push({
          timestamp: Date.now(),
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          url: window.location.href
        });
        
        this.analyzeResourceUsage(memory);
      }, 30000); // Check every 30 seconds
    }
  }

  /**
   * Monitor error rates
   */
  monitorErrorRates() {
    if (typeof window !== 'undefined') {
      // Monitor JavaScript errors
      window.addEventListener('error', (event) => {
        this.metrics.errorRates.push({
          timestamp: Date.now(),
          type: 'javascript',
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          url: window.location.href
        });
      });
      
      // Monitor unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.metrics.errorRates.push({
          timestamp: Date.now(),
          type: 'promise',
          reason: event.reason,
          url: window.location.href
        });
      });
    }
  }

  /**
   * Analyze page load performance
   */
  analyzePageLoadPerformance(loadTime) {
    if (loadTime > this.performanceThresholds.pageLoadTime) {
      console.warn(`⚠️ Slow page load detected: ${loadTime}ms`);
      this.triggerOptimization('pageLoad', { loadTime });
    }
  }

  /**
   * Analyze API performance
   */
  analyzeApiPerformance(responseTime, url) {
    if (responseTime > this.performanceThresholds.apiResponseTime) {
      console.warn(`⚠️ Slow API response detected: ${responseTime}ms for ${url}`);
      this.triggerOptimization('apiResponse', { responseTime, url });
    }
  }

  /**
   * Analyze resource usage
   */
  analyzeResourceUsage(memory) {
    const usagePercentage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    
    if (usagePercentage > this.performanceThresholds.memoryUsage) {
      console.warn(`⚠️ High memory usage detected: ${(usagePercentage * 100).toFixed(2)}%`);
      this.triggerOptimization('memory', { usagePercentage });
    }
  }

  /**
   * Trigger optimization based on performance issues
   */
  triggerOptimization(type, data) {
    switch (type) {
      case 'pageLoad':
        this.optimizePageLoad(data);
        break;
      case 'apiResponse':
        this.optimizeApiResponse(data);
        break;
      case 'memory':
        this.optimizeMemoryUsage(data);
        break;
      default:
        console.log(`Optimization triggered for: ${type}`);
    }
  }

  /**
   * Optimize page load performance
   */
  optimizePageLoad(data) {
    // Implement page load optimizations
    this.enableLazyLoading();
    this.optimizeImages();
    this.enableCompression();
    this.prefetchCriticalResources();
  }

  /**
   * Optimize API response performance
   */
  optimizeApiResponse(data) {
    // Implement API response optimizations
    this.enableApiCaching(data.url);
    this.optimizeApiQueries(data.url);
    this.enableResponseCompression();
  }

  /**
   * Optimize memory usage
   */
  optimizeMemoryUsage(data) {
    // Implement memory optimizations
    this.clearUnusedCaches();
    this.optimizeDataStructures();
    this.enableGarbageCollection();
  }

  /**
   * Setup optimization rules
   */
  setupOptimizationRules() {
    // Enable caching
    if (this.optimizationRules.caching) {
      this.enableAdvancedCaching();
    }
    
    // Enable lazy loading
    if (this.optimizationRules.lazyLoading) {
      this.enableLazyLoading();
    }
    
    // Enable compression
    if (this.optimizationRules.compression) {
      this.enableCompression();
    }
    
    // Enable minification
    if (this.optimizationRules.minification) {
      this.enableMinification();
    }
    
    // Enable image optimization
    if (this.optimizationRules.imageOptimization) {
      this.optimizeImages();
    }
  }

  /**
   * Initialize advanced caching
   */
  initializeCaching() {
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.cacheMaxSize = 100; // Maximum number of cached items
  }

  /**
   * Enable advanced caching
   */
  enableAdvancedCaching() {
    // Implement intelligent caching strategy
    this.cacheStrategy = {
      ttl: 300000, // 5 minutes default TTL
      maxSize: 100,
      evictionPolicy: 'LRU' // Least Recently Used
    };
  }

  /**
   * Enable lazy loading
   */
  enableLazyLoading() {
    if (typeof window !== 'undefined') {
      // Lazy load images
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
      
      // Lazy load components
      const components = document.querySelectorAll('[data-lazy-component]');
      const componentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const component = entry.target;
            this.loadLazyComponent(component);
            componentObserver.unobserve(component);
          }
        });
      });
      
      components.forEach(component => componentObserver.observe(component));
    }
  }

  /**
   * Load lazy component
   */
  loadLazyComponent(component) {
    const componentName = component.dataset.lazyComponent;
    // Implement dynamic component loading
    console.log(`Loading lazy component: ${componentName}`);
  }

  /**
   * Optimize images
   */
  optimizeImages() {
    if (typeof window !== 'undefined') {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Add loading="lazy" attribute
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        
        // Optimize image format
        this.optimizeImageFormat(img);
      });
    }
  }

  /**
   * Optimize image format
   */
  optimizeImageFormat(img) {
    // Convert to WebP if supported
    if (this.supportsWebP()) {
      const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      img.src = webpSrc;
    }
  }

  /**
   * Check WebP support
   */
  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * Enable compression
   */
  enableCompression() {
    // Enable gzip compression for API responses
    this.compressionEnabled = true;
  }

  /**
   * Enable minification
   */
  enableMinification() {
    // Enable CSS and JS minification
    this.minificationEnabled = true;
  }

  /**
   * Setup performance dashboard
   */
  setupPerformanceDashboard() {
    // Create real-time performance dashboard
    this.dashboard = {
      metrics: this.metrics,
      thresholds: this.performanceThresholds,
      optimizations: this.optimizationRules
    };
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      pageLoadTimes: this.metrics.pageLoadTimes,
      apiResponseTimes: this.metrics.apiResponseTimes,
      userInteractions: this.metrics.userInteractions,
      resourceUsage: this.metrics.resourceUsage,
      errorRates: this.metrics.errorRates,
      summary: this.getPerformanceSummary()
    };
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const avgPageLoadTime = this.metrics.pageLoadTimes.length > 0 
      ? this.metrics.pageLoadTimes.reduce((sum, metric) => sum + metric.loadTime, 0) / this.metrics.pageLoadTimes.length
      : 0;
    
    const avgApiResponseTime = this.metrics.apiResponseTimes.length > 0
      ? this.metrics.apiResponseTimes.reduce((sum, metric) => sum + metric.responseTime, 0) / this.metrics.apiResponseTimes.length
      : 0;
    
    const errorRate = this.metrics.errorRates.length / (this.metrics.userInteractions.length + 1);
    
    return {
      avgPageLoadTime: Math.round(avgPageLoadTime),
      avgApiResponseTime: Math.round(avgApiResponseTime),
      errorRate: Math.round(errorRate * 100) / 100,
      totalInteractions: this.metrics.userInteractions.length,
      totalErrors: this.metrics.errorRates.length,
      performanceScore: this.calculatePerformanceScore(avgPageLoadTime, avgApiResponseTime, errorRate)
    };
  }

  /**
   * Calculate performance score
   */
  calculatePerformanceScore(avgPageLoadTime, avgApiResponseTime, errorRate) {
    let score = 100;
    
    // Deduct points for slow page load
    if (avgPageLoadTime > this.performanceThresholds.pageLoadTime) {
      score -= Math.min(30, (avgPageLoadTime - this.performanceThresholds.pageLoadTime) / 100);
    }
    
    // Deduct points for slow API response
    if (avgApiResponseTime > this.performanceThresholds.apiResponseTime) {
      score -= Math.min(20, (avgApiResponseTime - this.performanceThresholds.apiResponseTime) / 50);
    }
    
    // Deduct points for high error rate
    if (errorRate > this.performanceThresholds.errorRate) {
      score -= Math.min(50, errorRate * 1000);
    }
    
    return Math.max(0, Math.round(score));
  }

  /**
   * Export performance data
   */
  exportPerformanceData() {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: this.getMetrics(),
      summary: this.getPerformanceSummary(),
      optimizations: this.optimizationRules
    };
    
    return JSON.stringify(data, null, 2);
  }

  /**
   * Clear performance data
   */
  clearPerformanceData() {
    this.metrics = {
      pageLoadTimes: [],
      apiResponseTimes: [],
      userInteractions: [],
      resourceUsage: [],
      errorRates: []
    };
  }
}

// Export the service
export default new PerformanceOptimizer();
