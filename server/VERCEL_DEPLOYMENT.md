# Deploying the SGRRU-ERP Backend to Vercel

This guide explains how to deploy the Express.js backend to Vercel as serverless functions.

## Prerequisites

1. A Vercel account
2. MongoDB Atlas account with a database set up
3. Node.js v18+ installed locally

## Step 1: Set Up Environment Variables in Vercel

Before deploying, you need to set up environment variables in Vercel:

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project (or create a new one if not already deployed)
3. Navigate to "Settings" > "Environment Variables"
4. Add the following environment variables:
   - `CONNECTION_URL`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `NODE_ENV`: Set to "production"
   - `FRONTEND_URL`: The URL of your frontend (e.g., https://college-erp-frontend.vercel.app)

## Step 2: Deploy to Vercel

### Option 1: Deploy Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to the server directory:
   ```bash
   cd server
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy to Vercel:
   ```bash
   vercel
   ```

5. Follow the prompts and select your project settings
   - When asked for the output directory, leave it blank
   - When asked to override the settings, choose "yes" if necessary

6. Once deployed, get your production URL

### Option 2: Deploy Using Git Integration

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Vercel
3. Make sure to set the root directory to the `server` folder in your project
4. Configure the build settings:
   - Build Command: `npm run vercel-build`
   - Output Directory: (leave blank)
5. Click "Deploy"

## Step 3: Update Frontend Configuration

After deployment, you need to update your frontend to use the new API URL:

1. Set the `REACT_APP_API_URL` environment variable in your frontend Vercel project:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app
   ```

   Note: If your backend and frontend are on the same domain, you can simply use:
   ```
   REACT_APP_API_URL=/api
   ```

2. Redeploy your frontend

## Testing the Deployment

To test if your backend is working correctly:

1. Visit `https://your-backend-url.vercel.app/api/health`
2. You should receive a JSON response: `{"status":"ok","message":"API is healthy"}`

If you see the source code instead of a response, it means there's an issue with the serverless function setup.

## Troubleshooting

### Deployment Shows Source Code

If you see the source code instead of it executing:
- Check that your vercel.json file is properly set up
- Make sure you're using the correct Node.js version (18+)

### CORS Errors

If you're getting CORS errors when your frontend tries to access the backend:
- Check that the `FRONTEND_URL` environment variable is set correctly
- Verify that the origin in the CORS settings matches your frontend URL

### Database Connection Errors

If you can't connect to the database:
- Check that your `CONNECTION_URL` is correct in Vercel's environment variables
- Make sure your IP address is whitelisted in MongoDB Atlas

### Function Timeout Errors

If you're getting timeout errors:
- Optimize your database queries
- Use database connection pooling to avoid initializing a new connection for each request

## Limitations

Be aware of Vercel's serverless function limitations:
- Function execution time limit is 10 seconds on the free tier
- Maximum function size is 50MB (including node_modules)
- Cold starts can affect performance

For high-traffic applications, consider upgrading to a paid plan or using a different hosting provider like Render, Railway, or Fly.io. 