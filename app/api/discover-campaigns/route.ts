import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("status", "active") // Only show active campaigns for discovery
    .neq("creator_id", session.user.id) // Don't show campaigns created by the current user
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching discover campaigns:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(campaigns)
}
