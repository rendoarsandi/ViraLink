import { NextResponse } from "next/server"
import { z } from "zod"
import { createDatabaseClient } from "@/lib/db"
import { getServerSession } from "@/lib/auth-server"

const createCampaignSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  objective: z.string().min(1, "Objective is required"),
  budget: z.number().positive("Budget must be positive"),
  rewardModel: z.enum(["ppc", "ppa", "ppe"]),
  rewardRate: z.number().positive("Reward rate must be positive"),
  contentLink: z.string().url("Content link must be a valid URL"),
  instructions: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createCampaignSchema.parse(body)

    const prisma = createDatabaseClient()

    // Check if user profile exists and is a creator
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile || profile.role !== "creator") {
      return NextResponse.json({ error: "Only creators can create campaigns" }, { status: 403 })
    }

    const campaign = await prisma.campaign.create({
      data: {
        creatorId: profile.id,
        title: validatedData.title,
        description: validatedData.description,
        objective: validatedData.objective,
        budget: validatedData.budget,
        rewardModel: validatedData.rewardModel,
        rewardRate: validatedData.rewardRate,
        contentLink: validatedData.contentLink,
        instructions: validatedData.instructions || "",
        status: "active",
      },
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error("Error creating campaign:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
