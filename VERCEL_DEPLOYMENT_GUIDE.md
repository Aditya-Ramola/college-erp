# Deploying SGRRU-ERP to Vercel

This guide provides step-by-step instructions for deploying both the frontend and backend of the SGRRU-ERP application to Vercel.

## Prerequisites

1. A Vercel account (Sign up at [vercel.com](https://vercel.com) if you don't have one)
2. Git repository with your code (GitHub, GitLab, or Bitbucket)
3. MongoDB Atlas account with a database set up
4. Node.js v18+ installed locally

## Part 1: Deploying the Backend

### Step 1: Set Up Environment Variables

First, you need to set up your environment variables for the backend deployment:

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on "Add New" > "Project"
3. Import your Git repository
4. Configure the project:
   - Set the root directory to `server` (if your backend is in a subdirectory called "server")
   - Set the Build command to `npm run vercel-build`
   - Leave the Output Directory blank
5. Click on "Environment Variables" and add:
   - `CONNECTION_URL`: Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster0.xyz.mongodb.net/erp?retryWrites=true&w=majority`)
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `NODE_ENV`: Set to `production`
   - `FRONTEND_URL`: The URL where your frontend will be deployed (you can update this later)

### Step 2: Deploy the Backend

1. Click "Deploy" and wait for the deployment to complete
2. Once deployed, Vercel will give you a URL like `https://your-project-name.vercel.app`
3. Test the backend by visiting `https://your-project-name.vercel.app/api/health`
   - You should see a JSON response: `{"status":"ok","message":"API is healthy"}`
   - If you see the source code instead, check your vercel.json and API configuration

### Step 3: Note Your Backend URL

Make note of your backend URL. You'll need it when configuring the frontend.

## Part 2: Deploying the Frontend

### Step 1: Set Up Environment Variables for Frontend

1. Go back to the Vercel Dashboard and create a new project
2. Import your Git repository again (same as before)
3. Configure the project:
   - Set the root directory to `client` (if your frontend is in a subdirectory called "client")
   - The build command should automatically be detected (usually `npm run build`)
   - The output directory should also be detected (usually `build` or `dist`)
4. Add the following environment variable:
   - `REACT_APP_API_URL`: Your backend URL from the previous step (e.g., `https://your-backend.vercel.app`)

### Step 2: Deploy the Frontend

1. Click "Deploy" and wait for the deployment to complete
2. Once deployed, Vercel will give you another URL for your frontend
3. Visit the frontend URL to verify that everything is working

## Part 3: Setting Up a Custom Domain (Optional)

If you want to use a custom domain for your application:

1. Purchase a domain from a domain registrar (e.g., Namecheap, GoDaddy)
2. In the Vercel Dashboard, select your frontend project
3. Go to "Settings" > "Domains"
4. Click "Add" and enter your domain
5. Follow Vercel's instructions to set up the DNS records
6. Once the domain is verified, your application will be accessible via your custom domain

For detailed instructions on setting up a custom domain, refer to the [CUSTOM_DOMAIN_SETUP.md](CUSTOM_DOMAIN_SETUP.md) file.

## Troubleshooting

### Backend Shows Source Code

If you visit your backend URL and see the source code instead of it running:

1. Verify that your `vercel.json` is in the root of your server directory
2. Check that it has the proper configuration for routing and builds
3. Ensure you're using Node.js v18 or newer
4. Try redeploying with the Vercel CLI for more detailed error messages

### CORS Errors

If your frontend can't communicate with your backend due to CORS errors:

1. Check the CORS configuration in your `server/api/index.js` file
2. Make sure the `origin` in corsOptions includes your frontend URL
3. Update the `FRONTEND_URL` environment variable in your backend Vercel project

### Authentication Issues

If login doesn't work properly:

1. Check that your `JWT_SECRET` is set correctly
2. Verify that API calls from the frontend include the correct URL path
3. Ensure that localStorage is working properly in your browser

### Database Connection Issues

If the application can't connect to the database:

1. Verify your MongoDB Atlas connection string
2. Ensure that your IP address is allowed in MongoDB Atlas Network Access settings
3. For production, set MongoDB Atlas to allow connections from anywhere (0.0.0.0/0)

## Redeploying After Changes

When you make changes to your code:

1. Push your changes to your Git repository
2. Vercel will automatically rebuild and redeploy your projects
3. Verify that both frontend and backend are working correctly

## Performance Optimization

For better performance:

1. Enable Vercel's Edge Functions for faster global performance
2. Configure caching headers for static assets
3. Optimize database queries for serverless architecture
4. Consider upgrading to Vercel Pro if you need additional resources

## Need More Help?

If you encounter any issues not covered in this guide:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Visit the [Vercel community forums](https://github.com/vercel/vercel/discussions)
3. Create an issue in the SGRRU-ERP repository 