# Frontend Deployment - Vercel Environment Variable Setup

## ✅ Backend Deployed at:
`https://test-prn.onrender.com`

## 🔧 Update Vercel Environment Variable

1. Go to: https://vercel.com/dashboard
2. Select your project: `test-prn`
3. Go to **Settings** → **Environment Variables**
4. Add or update:

```
NEXT_PUBLIC_API_URL=https://test-prn.onrender.com/api
```

5. Apply to: **Production**, **Preview**, and **Development**
6. Click **Save**
7. Go to **Deployments** tab
8. Click the three dots (•••) on the latest deployment
9. Click **Redeploy**

## 📝 Files Created

- `.env.production` - Contains production API URL (for Vercel)
- `.env.local` - Contains local API URL (for development)

## 🧪 Test Your Deployment

After redeploying, visit:
- Frontend: https://test-prn.vercel.app
- Backend API: https://test-prn.onrender.com/api/posts

Your frontend will now connect to the backend on Render! 🚀
