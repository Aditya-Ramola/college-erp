// Dedicated handler for OPTIONS requests to the admin login endpoint

export default function handler(req, res) {
  // Define allowed origins
  const allowedOrigins = [
    'https://college-erp-4dle.vercel.app',
    'https://college-erp-flame.vercel.app',
    'http://localhost:3000'
  ];
  
  // Get origin from request
  const origin = req.headers.origin;
  
  // Set appropriate CORS headers based on origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  // Set other CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Return 204 No Content for OPTIONS requests
  res.status(204).end();
} 