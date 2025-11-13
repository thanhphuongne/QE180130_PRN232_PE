# Post Management Application

A full-stack web application for managing posts with CRUD operations, built with .NET 9, React, and PostgreSQL.

## Features

### Main Page (Post List)
- Display all posts with name, description, and optional image
- Search posts by name
- Sort posts by name (A-Z / Z-A)
- Responsive grid layout

### Create Post
- Add new posts with name (required), description (required), and image URL (optional)
- Form validation
- Redirects to post list after creation

### Edit Post
- Click on any post to navigate to edit page
- Modify name, description, and image
- Save changes and redirect back to post list

### Delete Post
- Delete button on each post card
- Confirmation modal before deletion
- Removes post from the list

## Tech Stack

### Backend
- **.NET 9.0** - Web API
- **Entity Framework Core 9.0** - ORM
- **PostgreSQL** - Database
- **Npgsql** - PostgreSQL provider for EF Core
- **Swagger** - API documentation

### Frontend
- **Next.js 16** - React framework with SSR/SSG
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Deployment
- **Docker & Docker Compose** - Containerization
- **Render** - Cloud hosting platform

## Project Structure

```
PostManagementApp/
├── PostManagementAPI/          # .NET Backend
│   ├── Controllers/
│   │   └── PostsController.cs
│   ├── Data/
│   │   └── ApplicationDbContext.cs
│   ├── DTOs/
│   │   └── PostDto.cs
│   ├── Models/
│   │   └── Post.cs
│   ├── Migrations/
│   ├── Dockerfile
│   └── Program.cs
├── post-management-ui/         # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx           # Home page
│   │   ├── create/
│   │   │   └── page.tsx       # Create post page
│   │   ├── edit/[id]/
│   │   │   └── page.tsx       # Edit post page
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── PostList.tsx
│   │   ├── CreatePostForm.tsx
│   │   ├── EditPostForm.tsx
│   │   └── DeleteModal.tsx
│   ├── lib/
│   │   └── api.ts             # API service
│   ├── package.json
│   └── next.config.ts
└── docker-compose.yml
```

## Local Development Setup

### Prerequisites
- .NET 9 SDK
- Node.js 18+ and npm
- PostgreSQL 16 (or Docker)
- Git

### Backend Setup

1. Navigate to the API directory:
```bash
cd PostManagementAPI
```

2. Restore packages:
```bash
dotnet restore
```

3. Update database connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=postmanagement;Username=postgres;Password=postgres"
  }
}
```

4. Run migrations:
```bash
dotnet ef database update
```

5. Run the API:
```bash
dotnet run
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the UI directory:
```bash
cd post-management-ui
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Run the development server:
```bash
npm run dev
```

The UI will be available at `http://localhost:3000`

## Docker Deployment

### Local Docker Setup

1. Make sure Docker and Docker Compose are installed

2. From the project root directory, run:
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- .NET API on port 5000

3. Access the API at `http://localhost:5000/api/posts`

4. View Swagger documentation at `http://localhost:5000/swagger`

### Stop containers:
```bash
docker-compose down
```

### Stop and remove volumes:
```bash
docker-compose down -v
```

## Deploying to Render

### Backend (API + Database)

1. **Create PostgreSQL Database on Render:**
   - Go to Render Dashboard → New → PostgreSQL
   - Choose a name (e.g., `postmanagement-db`)
   - Copy the **Internal Database URL**

2. **Deploy Backend API:**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Configure:
     - **Name:** `postmanagement-api`
     - **Environment:** Docker
     - **Dockerfile Path:** `./PostManagementAPI/Dockerfile`
     - **Docker Build Context:** `./PostManagementAPI`
   - Add Environment Variable:
     - `DATABASE_URL` = [Paste Internal Database URL from step 1]
   - Click "Create Web Service"

3. **Get API URL:**
   - Once deployed, copy the service URL (e.g., `https://postmanagement-api.onrender.com`)

### Frontend (React App)

**Option 1: Deploy to Vercel (Recommended for Next.js)**
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `post-management-ui`
   - Build Command: `npm run build`
   - Output Directory: (leave default)
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = [Your Render API URL]/api
6. Deploy

**Option 2: Deploy to Netlify**
1. Push code to GitHub
2. Connect repository to Netlify
3. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `.next`
   - Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

## API Endpoints

### Get All Posts
```
GET /api/posts?search=keyword&sortBy=name&sortOrder=asc
```

### Get Post by ID
```
GET /api/posts/{id}
```

### Create Post
```
POST /api/posts
Content-Type: application/json

{
  "name": "Post Title",
  "description": "Post description",
  "imageUrl": "https://example.com/image.jpg"
}
```

### Update Post
```
PUT /api/posts/{id}
Content-Type: application/json

{
  "name": "Updated Title",
  "description": "Updated description",
  "imageUrl": "https://example.com/image.jpg"
}
```

### Delete Post
```
DELETE /api/posts/{id}
```

## Environment Variables

### Backend (.NET)
- `DATABASE_URL` or `ConnectionStrings__DefaultConnection` - PostgreSQL connection string
- `ASPNETCORE_ENVIRONMENT` - Development/Production

### Frontend (Next.js)
- `NEXT_PUBLIC_API_URL` - Backend API base URL

## Testing the Application

1. **Create a Post:**
   - Click "Create Post" in the navigation
   - Fill in name and description (required)
   - Optionally add an image URL
   - Click "Create Post"

2. **View Posts:**
   - See all posts on the home page
   - Use search box to filter by name
   - Change sort order with dropdown (A-Z or Z-A)

3. **Edit a Post:**
   - Click "Edit" button on any post card
   - Modify the fields
   - Click "Save Changes"

4. **Delete a Post:**
   - Click "Delete" button on any post card
   - Confirm deletion in the modal

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check connection string format
- For Render: Use the Internal Database URL, not External

### CORS Errors
- Backend is configured with `AllowAll` CORS policy
- For production, update CORS policy to allow only specific origins

### Port Conflicts
- Change ports in `appsettings.json`, `docker-compose.yml`, or `.env` files

## License

MIT License

## Author

Developed for PRN Test Assignment
