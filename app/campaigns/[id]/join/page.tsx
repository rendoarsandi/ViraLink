"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, LinkIcon, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"

interface Campaign {
  id: string
  creator_id: string
  title: string
  description: string
  objective: string
  budget: number
  reward_model: string
  reward_rate: number
  content_link: string
  instructions: string
  status: string
  promoters_count: number
  clicks_count: number
  spent_budget: number
  created_at: string
}

interface JoinedCampaign {
  id: string
  tracking_link: string
  status: string
}

export default function JoinCampaignPage({ params }: { params: { id: string } }) {
  const { id: campaignId } = params
  const router = useRouter()
  const { user, userType, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const supabase = createClient()

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [joinedCampaign, setJoinedCampaign] = useState<JoinedCampaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)

  const getRewardModelLabel = (model: string) => {
    switch (model) {
      case "ppc":
        return "Per Click"
      case "ppa":
        return "Per Acquisition"
      case "ppe":
        return "Per Engagement"
      default:
        return model
    }
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }
    if (!authLoading && userType !== "promoter") {
      router.push("/dashboard") // Only promoters can join campaigns
      return
    }
    if (user && userType === "promoter") {
      fetchCampaignDetails()
    }
  }, [user, userType, authLoading, router, campaignId])

  const fetchCampaignDetails = async () => {
    setIsLoading(true)
    try {
      // Fetch campaign details (accessible by RLS for active campaigns)
      const { data: campaignData, error: campaignError } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", campaignId)
        .single()

      if (campaignError) throw campaignError
      setCampaign(campaignData)

      // Check if the promoter has already joined this campaign
      const { data: joinedData, error: joinedError } = await supabase
        .from("promoter_campaigns")
        .select("id, tracking_link, status")
        .eq("promoter_id", user?.id)
        .eq("campaign_id", campaignId)
        .single()

      if (joinedData) {
        setJoinedCampaign(joinedData)
      } else if (joinedError && joinedError.code !== "PGRST116") {
        // PGRST116 means no rows found
        throw joinedError
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not load campaign details.",
        variant: "destructive",
      })
      setCampaign(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinCampaign = async () => {
    setIsJoining(true)
    try {
      const response = await fetch("/api/join-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaignId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to join campaign.")
      }

      toast({
        title: "Success",
        description: result.message || "You have successfully joined the campaign!",
      })
      setJoinedCampaign({ id: result.id, tracking_link: result.trackingLink, status: "joined" }) // Update state to show joined status
      // Optionally, re-fetch campaign details to update promoter count immediately
      fetchCampaignDetails()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was a problem joining the campaign.",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  const handleCopyLink = () => {
    if (joinedCampaign?.tracking_link) {
      navigator.clipboard.writeText(joinedCampaign.tracking_link)
      toast({
        title: "Copied!",
        description: "Tracking link copied to clipboard.",
      })
    }
  }

  if (authLoading || isLoading || !campaign) {
    return <div className="container py-10">Loading campaign details...</div>
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Campaign Details</h1>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{campaign.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">by {campaign.creator_id}</CardDescription>{" "}
              {/* In a real app, fetch creator name */}
            </div>
            <Badge variant="outline">{campaign.objective}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{campaign.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Reward Details</h3>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span>
                  Rp {campaign.reward_rate.toLocaleString()} {getRewardModelLabel(campaign.reward_model)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total Budget: Rp {campaign.budget.toLocaleString()} (Remaining: Rp{" "}
                {(campaign.budget - campaign.spent_budget).toLocaleString()})
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Promoter Info</h3>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>{campaign.promoters_count} promoters currently active</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Content Link:{" "}
                <a
                  href={campaign.content_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  View Content
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Instructions for Promoters</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{campaign.instructions}</p>
          </div>

          {joinedCampaign ? (
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold text-green-700 dark:text-green-300">You have joined this campaign!</p>
                    <p className="text-sm text-green-600 dark:text-green-400 break-all">
                      {joinedCampaign.tracking_link}
                    </p>
                  </div>
                </div>
                <Button onClick={handleCopyLink} size="sm" variant="outline" className="shrink-0">
                  <Copy className="h-4 w-4 mr-2" /> Copy Link
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Button onClick={handleJoinCampaign} disabled={isJoining} className="w-full">
              {isJoining ? "Joining..." : "Join Campaign"}
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Discover
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
