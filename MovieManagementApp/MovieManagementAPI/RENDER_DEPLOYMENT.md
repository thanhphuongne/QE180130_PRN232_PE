# Backend Deployment Guide for Render

## Environment Variables to Set on Render

### Required Variables:

**Option 1: Using DATABASE_URL (Recommended for Render)**
```
DATABASE_URL=postgresql://postgres:Supabase@2004@db.vwbnavdyulppiryfzqpd.supabase.co:5432/postgres
```

**Option 2: Using ConnectionStrings__DefaultConnection**
```
ConnectionStrings__DefaultConnection=Host=db.vwbnavdyulppiryfzqpd.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=Supabase@2004;SSL Mode=Require;Trust Server Certificate=true
```

### Optional Variables:

```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
```

## Render Service Settings

1. **Repository:** `https://github.com/thanhphuongne/Test_PRN`
2. **Root Directory:** `PostManagementAPI`
3. **Dockerfile Path:** `./PostManagementAPI/Dockerfile`
4. **Build Command:** (Automatic - uses Dockerfile)
5. **Start Command:** (Automatic - uses Dockerfile ENTRYPOINT)

## Deployment Steps

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure the settings above
4. Add the environment variable `DATABASE_URL` with your Supabase connection string
5. Deploy!

## Important Notes

- The application will **automatically run database migrations** on startup
- The `Posts` table will be created automatically if it doesn't exist
- CORS is configured to allow all origins (safe for development, consider restricting in production)
- The API will be available at: `https://your-service-name.onrender.com/api`

## API Endpoints

Once deployed, your API will have these endpoints:

- `GET /api/posts` - Get all posts (with optional search and sort)
- `GET /api/posts/{id}` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/{id}` - Update a post
- `DELETE /api/posts/{id}` - Delete a post

## Testing the Deployment

After deployment, test with:
```bash
curl https://your-service-name.onrender.com/api/posts
```

## Connecting Frontend

Update your Vercel environment variable:
```
NEXT_PUBLIC_API_URL=https://your-service-name.onrender.com/api
```

Then redeploy your frontend on Vercel.
