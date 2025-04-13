// Middleware for handling CORS in Vercel
export default function middleware(request, response) {
  // Define allowed origins - add your frontend URLs here
  const allowedOrigins = [
    'https://college-erp-4dle.vercel.app',
    'https://college-erp-flame.vercel.app',
    'http://localhost:3000'
  ];
  
  // Get the requesting origin
  const origin = request.headers.get('origin') || '';
  
  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin) || !origin;
  
  // Set the appropriate Access-Control-Allow-Origin header
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
  } else {
    // If not in allowed list, set to a specific origin or '*' as fallback
    response.headers.set('Access-Control-Allow-Origin', '*');
  }
  
  // Set other CORS headers
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: response.headers
    });
  }
  
  // Continue with the response
  return response;
} 