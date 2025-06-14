"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, LinkIcon, Copy, Edit, Pause, Play, Loader2, Download } from "lucide-react" // Added Download icon
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Campaign {
  id: string
  creatorId: string
  title: string
  description: string
  objective: string
  budget: number
  rewardModel: string
  rewardRate: number
  contentLink: string
  instructions: string
  status: string
  promotersCount: number
  clicksCount: number
  spentBudget: number
  createdAt: string
}

interface PromoterCampaign {
  id: string
  promoterId: string
  campaignId: string
  trackingLink: string
  joinedAt: string
  status: string
  clicks: number
  earnings: number
  promoter: {
    fullName: string
    email: string
    avatarUrl: string
  } | null
}

export default function CreatorCampaignDetailsPage({ params }: { params: { id: string } }) {
  const { id: campaignId } = params
  const router = useRouter()
  const { user, userType, isLoading: authLoading } = useAuth()
  const { toast } = useToast()

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [promoterCampaigns, setPromoterCampaigns] = useState<PromoterCampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

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
    if (!authLoading && userType !== "creator") {
      router.push("/dashboard") // Only creators can view their campaign details
      return
    }
    if (user && userType === "creator") {
      fetchCampaignDetails()
      fetchPromoterPerformance()
    }
  }, [user, userType, authLoading, router, campaignId])

  const fetchCampaignDetails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Campaign Not Found",
            description: "The campaign you are looking for does not exist or you do not have access.",
            variant: "destructive",
          })
          router.push("/campaigns")
          return
        }
        throw new Error('Failed to fetch campaign')
      }

      const campaignData = await response.json()
      setCampaign(campaignData)
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

  const fetchPromoterPerformance = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/promoters`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch promoter performance')
      }

      const data = await response.json()
      setPromoterCampaigns(data)
    } catch (error: any) {
      console.error("Error fetching promoter performance:", error)
      toast({
        title: "Error",
        description: error.message || "Could not load promoter performance.",
        variant: "destructive",
      })
      setPromoterCampaigns([])
    }
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({
      title: "Copied!",
      description: "Link copied to clipboard.",
    })
  }

  const handleToggleCampaignStatus = async () => {
    if (!campaign) return

    setIsUpdatingStatus(true)
    const newStatus = campaign.status === "active" ? "paused" : "active"
    try {
      const response = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update campaign status')
      }

      const updatedCampaign = await response.json()
      setCampaign(updatedCampaign)

      toast({
        title: "Campaign Status Updated",
        description: `Campaign is now ${newStatus}.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update campaign status.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  if (authLoading || isLoading || !campaign) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading campaign details...</span>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{campaign.title}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/campaigns/${campaign.id}/edit`)}
            disabled={isUpdatingStatus}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Campaign
          </Button>
          <Button
            variant={campaign.status === "active" ? "destructive" : "default"}
            onClick={handleToggleCampaignStatus}
            disabled={isUpdatingStatus}
          >
            {isUpdatingStatus ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : campaign.status === "active" ? (
              <Pause className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {campaign.status === "active" ? "Pause Campaign" : "Activate Campaign"}
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{campaign.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Created on {new Date(campaign.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {campaign.objective}
            </Badge>
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
              <p className="text-sm text-muted-foreground mt-1">Total Budget: Rp {campaign.budget.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Spent Budget: Rp {campaign.spent_budget.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                Remaining Budget: Rp {(campaign.budget - campaign.spent_budget).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Campaign Status & Content</h3>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant={campaign.status === "active" ? "default" : "secondary"} className="capitalize">
                  {campaign.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                {isSupabaseStorageUrl(campaign.content_link) ? (
                  <>
                    <Download className="h-4 w-4" />
                    <a
                      href={campaign.content_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline break-all"
                    >
                      Download Content
                    </a>
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={campaign.content_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline break-all"
                    >
                      View Content
                    </a>
                  </>
                )}
                <Button variant="ghost" size="icon" onClick={() => handleCopyLink(campaign.content_link)}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy content link</span>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Instructions for Promoters</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{campaign.instructions}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Promoter Performance</CardTitle>
          <CardDescription>Track the performance of promoters for this campaign.</CardDescription>
        </CardHeader>
        <CardContent>
          {promoterCampaigns.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No promoters have joined this campaign yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Promoter</TableHead>
                  <TableHead>Tracking Link</TableHead>
                  <TableHead>Joined At</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promoterCampaigns.map((pc) => (
                  <TableRow key={pc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={pc.profiles?.avatar_url || "/placeholder.svg?height=24&width=24"}
                          alt={pc.profiles?.full_name || "Promoter"}
                          className="h-6 w-6 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{pc.profiles?.full_name || "N/A"}</p>
                          <p className="text-sm text-muted-foreground">{pc.profiles?.email || "N/A"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm break-all">{pc.tracking_link}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleCopyLink(pc.tracking_link)}>
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy tracking link</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(pc.joined_at).toLocaleDateString()}</TableCell>
                    <TableCell>{pc.clicks.toLocaleString()}</TableCell>
                    <TableCell>Rp {pc.earnings.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="capitalize">
                        {pc.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button variant="outline" onClick={() => router.push("/campaigns")}>
          Back to My Campaigns
        </Button>
      </div>
    </div>
  )
}
