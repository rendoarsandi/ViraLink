# Cloudflare Pages Deployment Guide

This guide covers deploying ViraLink to Cloudflare Pages with D1 database.

## Prerequisites

1. Cloudflare account
2. Wrangler CLI installed: `npm install -g wrangler`
3. Authenticated with Cloudflare: `wrangler auth login`

## Database Setup

### 1. Create D1 Databases

```bash
# Production database
wrangler d1 create viralink-prod

# Preview database  
wrangler d1 create viralink-preview

# Development database (optional)
wrangler d1 create viralink-dev
```

### 2. Update wrangler.toml

Update the database IDs in `wrangler.toml` with the IDs from the previous step.

### 3. Run Database Migrations

```bash
# Generate migration SQL from Prisma schema
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migration.sql

# Apply to production
wrangler d1 execute viralink-prod --file=migration.sql

# Apply to preview
wrangler d1 execute viralink-preview --file=migration.sql
```

## Environment Variables

Set these in Cloudflare Pages dashboard:

### Production
- `DATABASE_URL`: Not needed for D1
- `BETTER_AUTH_SECRET`: Generate a secure random string
- `BETTER_AUTH_URL`: Your production domain (e.g., https://viralink.pages.dev)
- `GOOGLE_CLIENT_ID`: (optional) For OAuth
- `GOOGLE_CLIENT_SECRET`: (optional) For OAuth

### Preview
- Same as production but with preview values

## Deployment

### Option 1: Automatic (Recommended)

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `.next`
4. Deploy automatically on push

### Option 2: Manual

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy .next --project-name=viralink
```

## Local Development

1. Copy `.env.example` to `.env.local`
2. Update environment variables
3. Run database migrations: `npx prisma db push`
4. Start development server: `npm run dev`

## Database Management

### View Data
```bash
# Production
wrangler d1 execute viralink-prod --command="SELECT * FROM profiles LIMIT 10"

# Local development
npx prisma studio
```

### Backup
```bash
# Export production data
wrangler d1 export viralink-prod --output=backup.sql
```

## Troubleshooting

### Common Issues

1. **D1 binding not found**: Ensure database IDs in wrangler.toml are correct
2. **Migration errors**: Check SQL syntax compatibility with SQLite
3. **Build failures**: Verify all dependencies are compatible with edge runtime

### Logs
```bash
# View function logs
wrangler pages deployment tail --project-name=viralink
```