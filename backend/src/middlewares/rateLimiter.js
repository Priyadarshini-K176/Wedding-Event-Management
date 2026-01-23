// Simple in-memory rate limiting middleware
// For production, use Redis-based rate limiter like express-rate-limit with store

const requests = new Map();

const getRateLimiter = (maxRequests, windowMs) => {
  return (req, res, next) => {
    const key = `${req.ip}-${req.path}`;
    const now = Date.now();
    
    if (!requests.has(key)) {
      requests.set(key, []);
    }
    
    const timestamps = requests.get(key);
    
    // Remove old timestamps outside the window
    const recentRequests = timestamps.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
      });
    }
    
    recentRequests.push(now);
    requests.set(key, recentRequests);
    
    // Clean up old entries periodically
    if (requests.size > 10000) {
      for (const [k, v] of requests.entries()) {
        if (v.filter(t => now - t < windowMs).length === 0) {
          requests.delete(k);
        }
      }
    }
    
    next();
  };
};

// Auth-specific limiters
const loginLimiter = getRateLimiter(50, 15 * 60 * 1000); // 50 attempts per 15 minutes (dev-friendly)
const signupLimiter = getRateLimiter(50, 60 * 60 * 1000); // 50 attempts per hour (dev-friendly)
const apiLimiter = getRateLimiter(1000, 60 * 60 * 1000); // 1000 requests per hour (dev-friendly)

module.exports = {
  loginLimiter,
  signupLimiter,
  apiLimiter,
  getRateLimiter
};
