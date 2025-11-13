# Render Deployment Configuration for PostManagementAPI

## Prerequisites
- GitHub account with repository
- Render account (free tier available)

## Step 1: Prepare Your GitHub Repository

1. Initialize git in your project root:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Push to GitHub:
```bash
git remote add origin https://github.com/yourusername/post-management-app.git
git branch -M main
git push -u origin main
```

## Step 2: Create PostgreSQL Database on Render

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure database:
   - **Name:** `postmanagement-db`
   - **Database:** `postmanagement`
   - **User:** (auto-generated)
   - **Region:** Choose closest to you
   - **PostgreSQL Version:** 16
   - **Plan:** Free
4. Click **"Create Database"**
5. Wait for database to be created
6. Copy the **Internal Database URL** (starts with `postgres://`)
   - Example: `postgres://user:password@hostname/database`

## Step 3: Deploy Backend API on Render

1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name:** `postmanagement-api`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** Leave empty
   - **Environment:** **Docker**
   - **Dockerfile Path:** `PostManagementAPI/Dockerfile`
   - **Docker Build Context Directory:** `PostManagementAPI`
   - **Plan:** Free

4. Add Environment Variables:
   Click **"Advanced"** → **"Add Environment Variable"**
   ```
   Key: DATABASE_URL
   Value: [Paste the Internal Database URL from Step 2]
   ```

5. Click **"Create Web Service"**

6. Wait for deployment (usually 5-10 minutes for first deploy)

7. Once deployed, your API will be available at:
   ```
   https://postmanagement-api.onrender.com
   ```

## Step 4: Test Your API

1. Open your API URL in browser:
   ```
   https://postmanagement-api.onrender.com/api/posts
   ```

2. View Swagger documentation:
   ```
   https://postmanagement-api.onrender.com/swagger
   ```

3. Test with curl:
   ```bash
   curl https://postmanagement-api.onrender.com/api/posts
   ```

## Step 5: Configure Frontend

Update your frontend `.env` file:
```
VITE_API_URL=https://postmanagement-api.onrender.com/api
```

## Important Notes

### Database Connection Format
The Program.cs automatically converts Render's PostgreSQL URL format to the format expected by Npgsql.

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spindown may take 30-60 seconds
- Database: 256 MB storage, 1 GB RAM
- Web Service: 512 MB RAM, shared CPU

### Keeping Your Service Active
To prevent spindown, use a service like:
- [Cron-job.org](https://cron-job.org/)
- [UptimeRobot](https://uptimerobot.com/)
- Ping your service every 10-14 minutes

### Logs and Monitoring
View logs in Render Dashboard:
1. Go to your Web Service
2. Click **"Logs"** tab
3. Monitor for errors or issues

## Troubleshooting

### Build Fails
- Check Dockerfile path is correct
- Ensure all necessary files are committed to Git
- Check logs for specific error messages

### Database Connection Fails
- Verify DATABASE_URL is correct
- Use **Internal Database URL**, not External
- Check database is in the same region

### 502 Bad Gateway
- Service is starting up (wait 30-60 seconds)
- Check logs for application errors
- Verify ASPNETCORE_URLS is set to http://+:8080

### Migrations Not Applied
The application automatically runs migrations on startup. If issues occur:
1. Check logs for migration errors
2. Manually run migrations from Render Shell:
   - Go to Web Service → "Shell" tab
   - Run: `dotnet ef database update`

## Custom Domain (Optional)

1. Go to your Web Service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as instructed

## Updating Your Application

Push changes to GitHub:
```bash
git add .
git commit -m "Your update message"
git push
```

Render will automatically rebuild and redeploy.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string from Render |
| ASPNETCORE_ENVIRONMENT | No | Set to "Production" (default) |
| ASPNETCORE_URLS | No | Set to "http://+:8080" (default in Dockerfile) |

## Cost Optimization

Free tier is sufficient for development/testing. For production:
- Upgrade to paid plan ($7/month for web service)
- Prevents spindown
- More resources (RAM, CPU)
- Better performance

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- Check application logs in Render Dashboard
