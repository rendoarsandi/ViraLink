#!/bin/bash

# Migration script for Cloudflare D1
# This script helps migrate from the current setup to Cloudflare D1

set -e

echo "🚀 Starting migration to Cloudflare D1..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI is not installed. Please install it first:"
    echo "npm install -g wrangler"
    exit 1
fi

# Check if user is authenticated
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not authenticated with Cloudflare. Please run:"
    echo "wrangler auth login"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Generate migration SQL from Prisma schema
echo "📝 Generating migration SQL..."
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migration.sql

if [ ! -f migration.sql ]; then
    echo "❌ Failed to generate migration.sql"
    exit 1
fi

echo "✅ Migration SQL generated"

# Ask user which databases to migrate
echo "🗄️  Which databases would you like to migrate?"
echo "1) Production only"
echo "2) Preview only" 
echo "3) Both production and preview"
echo "4) Development only"
echo "5) All databases"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🔄 Migrating production database..."
        wrangler d1 execute viralink-prod --file=migration.sql
        echo "✅ Production database migrated"
        ;;
    2)
        echo "🔄 Migrating preview database..."
        wrangler d1 execute viralink-preview --file=migration.sql
        echo "✅ Preview database migrated"
        ;;
    3)
        echo "🔄 Migrating production database..."
        wrangler d1 execute viralink-prod --file=migration.sql
        echo "✅ Production database migrated"
        
        echo "🔄 Migrating preview database..."
        wrangler d1 execute viralink-preview --file=migration.sql
        echo "✅ Preview database migrated"
        ;;
    4)
        echo "🔄 Migrating development database..."
        wrangler d1 execute viralink-dev --file=migration.sql
        echo "✅ Development database migrated"
        ;;
    5)
        echo "🔄 Migrating all databases..."
        wrangler d1 execute viralink-prod --file=migration.sql
        echo "✅ Production database migrated"
        
        wrangler d1 execute viralink-preview --file=migration.sql
        echo "✅ Preview database migrated"
        
        wrangler d1 execute viralink-dev --file=migration.sql
        echo "✅ Development database migrated"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

# Clean up
rm migration.sql

echo "🎉 Migration completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update your environment variables in Cloudflare Pages dashboard"
echo "2. Deploy your application"
echo "3. Test the authentication flow"