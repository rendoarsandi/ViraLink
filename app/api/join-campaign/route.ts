import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid" // For generating unique tracking links

export async function POST(request: Request) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { campaignId } = await request.json()

  if (!campaignId) {
    return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 })
  }

  const promoterId = session.user.id

  try {
    // Check if promoter has already joined this campaign
    const { data: existingJoin, error: existingError } = await supabase
      .from("promoter_campaigns")
      .select("id")
      .eq("promoter_id", promoterId)
      .eq("campaign_id", campaignId)
      .single()

    if (existingJoin) {
      return NextResponse.json({ message: "You have already joined this campaign." }, { status: 200 })
    }
    if (existingError && existingError.code !== "PGRST116") {
      // PGRST116 means no rows found
      throw existingError
    }

    // Generate a unique tracking link
    const trackingCode = uuidv4().replace(/-/g, "").substring(0, 10) // Shorten UUID for readability
    const trackingLink = `${process.env.NEXT_PUBLIC_APP_URL}/track/${trackingCode}` // Replace with your actual app URL

    // Insert into promoter_campaigns table
    const { data, error } = await supabase
      .from("promoter_campaigns")
      .insert({
        promoter_id: promoterId,
        campaign_id: campaignId,
        tracking_link: trackingLink,
      })
      .select()
      .single()

    if (error) throw error

    // The trigger `update_promoters_count_on_join` will automatically update campaigns.promoters_count

    return NextResponse.json({ message: "Successfully joined campaign!", trackingLink: data.tracking_link })
  } catch (error: any) {
    console.error("Error joining campaign:", error)
    return NextResponse.json({ error: error.message || "Failed to join campaign." }, { status: 500 })
  }
}
