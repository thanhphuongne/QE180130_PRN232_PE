# Post Management Application - Quick Start Guide

## Project Overview
A full-stack CRUD application for managing posts with .NET backend, React frontend, and PostgreSQL database.

## What's Included

✅ **Backend (.NET 9 Web API)**
- CRUD operations for posts
- Search by name
- Sort by name (A-Z/Z-A)
- PostgreSQL database with Entity Framework Core
- Swagger API documentation
- Docker support
- CORS enabled

✅ **Frontend (React 18 + Vite)**
- Post list with search and sort
- Create new posts
- Edit existing posts
- Delete posts with confirmation
- Responsive design
- Image support (optional)

✅ **Database (PostgreSQL)**
- Post entity with name, description, image URL
- Migrations included
- Docker support

✅ **Deployment Ready**
- Docker Compose configuration
- Render deployment guide
- Environment variable support

## Quick Start Commands

### Option 1: Run with Docker (Recommended)
```bash
# From project root
docker-compose up -d

# API available at: http://localhost:5000
# Swagger UI: http://localhost:5000/swagger
```

### Option 2: Run Locally

**Terminal 1 - Backend:**
```bash
cd PostManagementAPI
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd post-management-ui
npm install
npm run dev
```

## Testing the Application

1. **Create Posts:**
   - Navigate to http://localhost:3000
   - Click "Create Post"
   - Fill in Name, Description, and optionally Image URL
   - Submit

2. **View & Search:**
   - See all posts on home page
   - Use search box to filter by name
   - Sort A-Z or Z-A

3. **Edit:**
   - Click "Edit" on any post
   - Modify fields
   - Save changes

4. **Delete:**
   - Click "Delete" on any post
   - Confirm deletion

## API Endpoints

- `GET /api/posts` - Get all posts (with search & sort)
- `GET /api/posts/{id}` - Get post by ID
- `POST /api/posts` - Create new post
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post

## Deployment to Render

See `DEPLOYMENT.md` for detailed instructions.

**Quick Steps:**
1. Push code to GitHub
2. Create PostgreSQL database on Render
3. Deploy backend as Docker web service
4. Set DATABASE_URL environment variable
5. Deploy frontend to Vercel/Netlify or Render static site

## Project Structure

```
PostManagementApp/
├── PostManagementAPI/        # .NET Backend
├── post-management-ui/       # React Frontend  
├── docker-compose.yml        # Docker configuration
├── README.md                 # Full documentation
├── DEPLOYMENT.md            # Deployment guide
└── QUICKSTART.md            # This file
```

## Key Features Implemented

✅ Display posts with name, description, image
✅ Search posts by name
✅ Sort posts A-Z/Z-A
✅ Create new posts with validation
✅ Edit posts with pre-filled form
✅ Delete posts with confirmation modal
✅ Responsive UI design
✅ Image support (optional)
✅ Docker deployment ready
✅ Render deployment guide
✅ CORS configured
✅ Error handling
✅ Loading states

## Technologies Used

**Backend:**
- .NET 9.0
- Entity Framework Core 9.0
- PostgreSQL (Npgsql)
- Swagger/OpenAPI

**Frontend:**
- React 18
- React Router 7
- Axios
- Vite

**DevOps:**
- Docker & Docker Compose
- Render (deployment platform)

## Environment Variables

**Backend:**
- `DATABASE_URL` or `ConnectionStrings__DefaultConnection`

**Frontend:**
- `VITE_API_URL` (defaults to http://localhost:5000/api)

## Database Schema

```sql
Posts
- Id (Primary Key)
- Name (Required, max 200 chars)
- Description (Required, max 2000 chars)
- ImageUrl (Optional, max 500 chars)
- CreatedAt (DateTime)
- UpdatedAt (DateTime)
```

## Support & Documentation

- Full setup instructions: `README.md`
- Deployment guide: `DEPLOYMENT.md`
- API documentation: http://localhost:5000/swagger (when running)

## Next Steps

1. ✅ Test locally with `docker-compose up`
2. ✅ Verify all CRUD operations work
3. ✅ Push to GitHub
4. ✅ Deploy to Render
5. ✅ Share GitHub repository link

## Notes

- Free tier on Render spins down after 15 min inactivity
- First request after spindown takes 30-60 seconds
- All migrations run automatically on startup
- CORS is configured for all origins (update for production)

---

**Application is ready for testing and deployment!** 🚀
