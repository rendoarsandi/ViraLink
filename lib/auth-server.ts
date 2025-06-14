import { createAuth } from "./auth"
import { headers } from "next/headers"

// Server-side auth utilities
export async function getServerSession(d1Database?: any) {
  const auth = createAuth(d1Database)
  const headersList = await headers()
  
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    })
    return session
  } catch (error) {
    console.error("Failed to get server session:", error)
    return null
  }
}

export async function getServerUser(d1Database?: any) {
  const session = await getServerSession(d1Database)
  return session?.user || null
}