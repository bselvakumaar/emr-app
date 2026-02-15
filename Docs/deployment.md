# Netlify Deployment Guide

## Configuration

The app is deployed to Netlify at **[https://emr-sys.netlify.app/](https://emr-sys.netlify.app/)**.

### `netlify.toml`

```toml
[build]
  command   = "npm install --include=dev && npm run build"
  publish   = "client/dist"
  functions = "netlify/functions"

[[redirects]]
  from   = "/api/*"
  to     = "/.netlify/functions/api/api/:splat"
  status = 200
  force  = true

[[redirects]]
  from   = "/*"
  to     = "/index.html"
  status = 200
```

### Environment Variables (Netlify Dashboard)

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `20` |

### How It Works

1. **Frontend**: Vite builds React app → `client/dist/` → served via Netlify CDN
2. **Backend**: Express app wrapped with `serverless-http` → `netlify/functions/api.js`
3. **API Routing**: `/api/*` requests are proxied to the serverless function
4. **SPA Fallback**: All other routes serve `index.html` for client-side routing
5. **Database**: Connects to Neon PostgreSQL via `DATABASE_URL`

### Branch Setup

- **Production branch**: `master`
- All pushes to `master` trigger automatic builds and deployments

### Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on deploy | Ensure Netlify production branch is `master`, not `main` |
| Build fails (vite not found) | Use `npm install --include=dev` in build command |
| API calls fail | Check `VITE_API_URL` is not set in Netlify (frontend uses relative `/api`) |
| DB connection fails | Verify `DATABASE_URL` in Netlify environment variables |
