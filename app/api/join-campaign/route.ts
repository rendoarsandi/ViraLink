import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-server"
import { createDatabaseClient } from "@/lib/db"
import { joinCampaignSchema } from "@/lib/validations"
import { generateTrackingLink } from "@/lib/tracking"

export async function POST(request: Request) {
  try {
    // Get D1 database binding from runtime context (for Cloudflare Pages)
    const d1Database = (globalThis as any).DB || undefined
    
    // Get authenticated session
    const session = await getServerSession(d1Database)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const { campaignId } = joinCampaignSchema.parse(body)

    const promoterId = session.user.id

    // Create database client
    const db = createDatabaseClient(d1Database)

    // Check if promoter has already joined this campaign
    const existingJoin = await db.promoterCampaign.findUnique({
      where: {
        unique_promoter_campaign: {
          promoterId,
          campaignId
        }
      }
    })

    if (existingJoin) {
      return NextResponse.json({ 
        message: "You have already joined this campaign.",
        trackingLink: existingJoin.trackingLink
      }, { status: 200 })
    }

    // Verify campaign exists and is active
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true, status: true, title: true }
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    if (campaign.status !== "active") {
      return NextResponse.json({ error: "Campaign is not active" }, { status: 400 })
    }

    // Generate a secure tracking link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const trackingLink = generateTrackingLink(baseUrl)

    // Create promoter campaign record in a transaction
    const result = await db.$transaction(async (tx) => {
      // Insert into promoter_campaigns table
      const promoterCampaign = await tx.promoterCampaign.create({
        data: {
          promoterId,
          campaignId,
          trackingLink,
          status: "joined"
        },
        select: {
          id: true,
          trackingLink: true,
          joinedAt: true
        }
      })

      // Update campaign promoters count
      await tx.campaign.update({
        where: { id: campaignId },
        data: {
          promotersCount: {
            increment: 1
          }
        }
      })

      return promoterCampaign
    })

    return NextResponse.json({ 
      message: "Successfully joined campaign!", 
      trackingLink: result.trackingLink,
      joinedAt: result.joinedAt
    })
  } catch (error) {
    console.error("Error joining campaign:", error)
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ error: "Failed to join campaign" }, { status: 500 })
  }
}
