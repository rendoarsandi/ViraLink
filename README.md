# ViraLink - Content Creator Platform

A modern content creator platform built with Next.js 15, Prisma, BetterAuth, and deployed on Cloudflare Pages.

[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/wgzsznZiR8i)

## 🚀 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Database**: Prisma ORM with Cloudflare D1 (SQLite)
- **Authentication**: BetterAuth
- **Styling**: Tailwind CSS + Radix UI
- **Deployment**: Cloudflare Pages
- **Analytics**: Statsig

## 🏗️ Architecture

This platform enables content creators to:
- Create and manage marketing campaigns
- Connect with promoters for content distribution
- Track campaign performance and analytics
- Manage earnings and payouts

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd viralink
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Push schema to database (development)
   pnpm db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

## 🗄️ Database Schema

The application uses the following main entities:

- **Profiles**: User profiles (creators and promoters)
- **Campaigns**: Marketing campaigns created by content creators
- **PromoterCampaigns**: Junction table for promoter-campaign relationships
- **User/Session/Account**: BetterAuth authentication tables

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Cloudflare Pages.

### Quick Deploy

1. **Set up D1 databases**
   ```bash
   ./scripts/migrate-to-d1.sh
   ```

2. **Deploy to Cloudflare Pages**
   ```bash
   pnpm build
   wrangler pages deploy .next --project-name=viralink
   ```

## 🛠️ Development Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Prisma Studio

## 🔧 Migration Status

This project is currently migrating from:
- ❌ Vercel → ✅ Cloudflare Pages
- ❌ Supabase → ✅ Cloudflare D1 + Prisma
- ❌ Supabase Auth → ✅ BetterAuth
- ❌ Vercel Analytics → ✅ Statsig + Cloudflare Analytics

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
