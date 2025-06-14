import { createAuth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

// Get D1 database from Cloudflare binding in production
function getD1Database() {
  // In Cloudflare Pages, the D1 binding is available in the runtime context
  // For now, we'll return undefined for local development
  if (process.env.NODE_ENV === 'production') {
    // This will be handled by the Cloudflare runtime
    return (globalThis as any).DB || undefined
  }
  return undefined
}

const auth = createAuth(getD1Database())

export const { GET, POST } = toNextJsHandler(auth)