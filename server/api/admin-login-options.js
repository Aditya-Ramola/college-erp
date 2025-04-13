// Dedicated handler for OPTIONS requests to the admin login endpoint

export default function handler(req, res) {
  console.log("Admin login OPTIONS handler invoked", {
    method: req.method,
    url: req.url,
    origin: req.headers.origin
  });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Return 204 No Content for OPTIONS requests
  res.status(204).end();
} 