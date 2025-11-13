# Post Management Application - Next.js Frontend Guide

## Overview
The frontend has been rebuilt using **Next.js 16** with TypeScript and Tailwind CSS, providing better performance, SEO capabilities, and developer experience.

## Tech Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety and better DX

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- Responsive design out of the box
- Custom components with proper styling

### Data Fetching
- **Axios** - HTTP client for API calls
- Client-side data fetching
- Error handling and loading states

## Project Structure

```
post-management-ui/
├── app/                        # Next.js App Router
│   ├── page.tsx               # Home page (Post List)
│   ├── layout.tsx             # Root layout with navigation
│   ├── create/
│   │   └── page.tsx           # Create post page
│   └── edit/
│       └── [id]/
│           └── page.tsx       # Dynamic edit post page
├── components/                 # React components
│   ├── PostList.tsx           # Post list with search & sort
│   ├── CreatePostForm.tsx     # Create post form
│   ├── EditPostForm.tsx       # Edit post form
│   └── DeleteModal.tsx        # Delete confirmation modal
├── lib/
│   └── api.ts                 # API service with TypeScript types
├── .env.local                 # Environment variables
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## Features

### 1. Post List Page (/)
- **Client-side component** with React hooks
- Real-time search by post name
- Sort A-Z or Z-A
- Grid layout with responsive design
- Loading and empty states
- Edit and Delete buttons on each card

### 2. Create Post Page (/create)
- Form with validation
- Required fields: Name, Description
- Optional field: Image URL
- Client-side validation
- Navigation after creation

### 3. Edit Post Page (/edit/[id])
- Dynamic route with post ID
- Pre-filled form with existing data
- Update functionality
- Navigation after update

### 4. Layout & Navigation
- Persistent header with navigation
- Links to Home and Create Post
- Responsive design
- Tailwind CSS styling

## Environment Variables

Create `.env.local` in the root of `post-management-ui`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Note:** Next.js requires `NEXT_PUBLIC_` prefix for client-side environment variables.

## Running the Application

### Development
```bash
cd post-management-ui
npm install
npm run dev
```
Opens at: http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## API Integration

The `lib/api.ts` file provides:

```typescript
export interface Post {
  id: number
  name: string
  description: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export const postService = {
  getAllPosts: (search?: string, sortOrder?: 'asc' | 'desc') => Promise<Post[]>
  getPostById: (id: number) => Promise<Post>
  createPost: (data: CreatePostDto) => Promise<Post>
  updatePost: (id: number, data: UpdatePostDto) => Promise<Post>
  deletePost: (id: number) => Promise<void>
}
```

## Key Differences from React/Vite Version

### Advantages of Next.js

1. **Better Performance**
   - Automatic code splitting
   - Optimized bundle size
   - Fast refresh during development

2. **Type Safety**
   - Full TypeScript support
   - Type-safe API calls
   - IntelliSense and autocomplete

3. **Modern Routing**
   - File-based routing with App Router
   - Nested layouts
   - Dynamic routes (`[id]`)

4. **Styling**
   - Tailwind CSS for rapid development
   - No need for separate CSS files
   - Utility-first approach

5. **Production Ready**
   - Built-in optimizations
   - Image optimization
   - SEO friendly
   - Deployment ready for Vercel

## Deployment

### Option 1: Vercel (Recommended)

Vercel is built by the creators of Next.js and provides the best experience:

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `post-management-ui`
   - **Build Command**: `npm run build` (auto-detected)
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your API URL
6. Deploy

**Features on Vercel:**
- Automatic deployments on git push
- Preview deployments for pull requests
- Edge network for global performance
- Analytics and monitoring

### Option 2: Netlify

1. Push code to GitHub
2. Connect to Netlify
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variable
5. Deploy

### Option 3: Docker

Create `Dockerfile` in `post-management-ui`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_PUBLIC_API_URL=http://api:8080/api
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

## Customization

### Styling
Modify `tailwind.config.ts` for custom colors, spacing, etc.

### API Base URL
Update `.env.local` with your production API URL

### Adding Features
- Add new pages in `app/` directory
- Create new components in `components/`
- Extend API service in `lib/api.ts`

## TypeScript Benefits

1. **Type Safety**: Catch errors at compile time
2. **IntelliSense**: Better autocomplete in editors
3. **Documentation**: Types serve as inline documentation
4. **Refactoring**: Safer code refactoring

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Environment Variables Not Working
- Ensure they start with `NEXT_PUBLIC_`
- Restart dev server after changes
- Check `.env.local` exists

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### TypeScript Errors
```bash
# Check types
npm run build
# or
npx tsc --noEmit
```

## Best Practices

1. **Use Client Components** when you need:
   - React hooks (useState, useEffect)
   - Browser APIs
   - Event listeners

2. **Use Server Components** when you can:
   - Static content
   - No interactivity needed
   - Better performance

3. **Environment Variables**:
   - Use `NEXT_PUBLIC_` for client-side
   - Keep secrets server-side only

4. **Styling**:
   - Use Tailwind utility classes
   - Create reusable components
   - Follow responsive-first approach

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

## Summary

The Next.js version provides:
- ✅ Modern React framework
- ✅ TypeScript type safety
- ✅ Tailwind CSS styling
- ✅ Better performance
- ✅ Production ready
- ✅ Easy deployment
- ✅ Developer experience improvements

**Status:** Production ready and deployed at http://localhost:3000 🚀
