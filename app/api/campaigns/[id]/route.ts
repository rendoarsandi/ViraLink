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

    const campaign = await prisma.campaign.findFirst({
      where: {
        id: params.id,
        creatorId: profile.id, // Ensure only creator can access their campaign
      },
      include: {
        promoterCampaigns: {
          include: {
            promoter: true,
          },
        },
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error("Error fetching campaign:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
