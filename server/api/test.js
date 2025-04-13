export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS in test endpoint");
    return res.status(200).end();
  }
  
  // Return success
  return res.status(200).json({
    message: 'Test endpoint working!',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    headers: req.headers,
    query: req.query,
    body: req.body || {}
  });
} 