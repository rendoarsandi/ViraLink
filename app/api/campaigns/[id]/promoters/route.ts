import { NextResponse } from "next/server"
import { createDatabaseClient } from "@/lib/db"
import { getServerSession } from "@/lib/auth-server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const prisma = createDatabaseClient()

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Verify campaign belongs to the user
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: params.id,
        creatorId: profile.id,
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const promoterCampaigns = await prisma.promoterCampaign.findMany({
      where: {
        campaignId: params.id,
      },
      include: {
        promoter: true,
      },
      orderBy: {
        joinedAt: 'desc',
      },
    })

    return NextResponse.json(promoterCampaigns)
  } catch (error) {
    console.error("Error fetching promoter campaigns:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
