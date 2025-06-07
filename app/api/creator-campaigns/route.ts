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
    .eq("creator_id", session.user.id) // Filter by current user's ID
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching creator campaigns:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(campaigns)
}
