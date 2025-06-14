import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"
import { createDatabaseClient } from "@/lib/db"
import { campaignQuerySchema } from "@/lib/validations"

export async function GET(request: Request) {
  try {
    // Get D1 database binding from runtime context (for Cloudflare Pages)
    const d1Database = (globalThis as any).DB || undefined
    
    // Get authenticated session
    const session = await getServerSession(d1Database)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const queryParams = {
      status: searchParams.get("status") || "active",
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
      offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined,
    }

    // Validate query parameters
    const validatedParams = campaignQuerySchema.parse(queryParams)

    // Create database client
    const db = createDatabaseClient(d1Database)

    // Fetch campaigns for discovery (active campaigns not created by current user)
    const campaigns = await db.campaign.findMany({
      where: {
        status: validatedParams.status || "active",
        creatorId: {
          not: session.user.id
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            promoterCampaigns: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: validatedParams.limit,
      skip: validatedParams.offset,
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("Error fetching discover campaigns:", error)
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}
