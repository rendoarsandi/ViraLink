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
      status: searchParams.get("status") || undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
      offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined,
    }

    // Validate query parameters
    const validatedParams = campaignQuerySchema.parse(queryParams)

    // Create database client
    const db = createDatabaseClient(d1Database)

    // Fetch campaigns created by the current user
    const campaigns = await db.campaign.findMany({
      where: {
        creatorId: session.user.id,
        ...(validatedParams.status && { status: validatedParams.status })
      },
      include: {
        promoterCampaigns: {
          select: {
            id: true,
            promoterId: true,
            status: true,
            clicks: true,
            earnings: true,
            joinedAt: true,
            promoter: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            joinedAt: "desc"
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

    // Calculate additional metrics for each campaign
    const campaignsWithMetrics = campaigns.map(campaign => ({
      ...campaign,
      totalClicks: campaign.promoterCampaigns.reduce((sum, pc) => sum + pc.clicks, 0),
      totalEarnings: campaign.promoterCampaigns.reduce((sum, pc) => sum + pc.earnings, 0),
      activePromoters: campaign.promoterCampaigns.filter(pc => pc.status === "active").length,
    }))

    return NextResponse.json(campaignsWithMetrics)
  } catch (error) {
    console.error("Error fetching creator campaigns:", error)
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}
