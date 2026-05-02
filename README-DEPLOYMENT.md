# Vercel Deployment Guide

## Overview
This project is configured as a monorepo with separate frontend and backend applications, optimized for Vercel deployment.

## Project Structure
```
sms/
├── backend/          # Node.js/Express API
├── frontend/         # React application
├── vercel.json       # Vercel configuration
├── package.json      # Root package.json for monorepo
└── .env.example      # Environment variables template
```

## Environment Variables
Set these in your Vercel dashboard under Project Settings > Environment Variables:

### Required Backend Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `EMAIL_USER` - Gmail address for sending OTPs
- `EMAIL_PASS` - Gmail app password (not regular password)

### Optional Variables
- `PORT` - Backend port (defaults to 3333)
- `NODE_ENV` - Set to "production" automatically

## Deployment Configuration

### vercel.json Features
- **Monorepo Support**: Builds both frontend and backend
- **API Routing**: Routes `/api/*` to backend server
- **Static Routing**: Routes all other requests to frontend
- **Build Optimization**: Uses custom install and build commands
- **Function Timeout**: 10 seconds for backend functions

### Build Process
1. Installs dependencies for all packages
2. Builds frontend React application
3. Deploys backend as serverless functions
4. Configures routing between frontend and backend

## Local Development

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Setup
```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:backend  # Backend on port 3333
npm run dev:frontend # Frontend on port 3000
```

## Vercel Deployment Steps

1. **Connect Repository**
   - Push code to GitHub/GitLab/Bitbucket
   - Connect repository to Vercel

2. **Configure Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Make sure to include MongoDB URI and email credentials

3. **Deploy**
   - Vercel will automatically detect the monorepo structure
   - Uses the vercel.json configuration for building

4. **Verify Deployment**
   - Check that frontend loads correctly
   - Test API endpoints at `/api/*`
   - Verify authentication flow works

## Important Notes

### MongoDB Setup
- Use MongoDB Atlas for cloud database
- Ensure IP whitelisting includes Vercel's IP ranges (0.0.0.0/0)
- Create database user with read/write permissions

### Email Configuration
- Use Gmail with app-specific password
- Enable 2-factor authentication on Gmail
- Generate app password from Google Account settings

### API Integration
- Frontend automatically uses `/api/*` in production
- Development uses `http://localhost:3333/api`
- No CORS issues due to Vercel routing

## Troubleshooting

### Common Issues
1. **MongoDB Connection**: Verify URI string and IP whitelist
2. **Email Sending**: Check Gmail app password and 2FA
3. **Build Failures**: Ensure all dependencies install correctly
4. **API Errors**: Verify environment variables are set

### Debugging
- Check Vercel function logs
- Verify build logs for dependency issues
- Test API endpoints directly using curl/Postman

## Production Considerations

### Security
- Use strong JWT secrets
- Enable rate limiting (already configured)
- Use HTTPS (automatic on Vercel)
- Validate environment variables

### Performance
- Frontend is optimized and cached
- Backend functions are serverless
- Database connection pooling via MongoDB Atlas
- CDN distribution through Vercel

### Monitoring
- Set up Vercel Analytics
- Monitor function performance
- Track error rates
- Database performance monitoring
