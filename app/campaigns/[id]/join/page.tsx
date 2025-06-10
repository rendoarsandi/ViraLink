"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, LinkIcon, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// TODO: Re-implement with BetterAuth and Cloudflare Workers
export default function JoinCampaignPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()

  // Placeholder data
  const campaign = {
    title: "Sample Campaign Title",
    creator_id: "Creator Name",
    objective: "Brand Awareness",
    description: "This is a sample campaign description. The goal is to promote our new product.",
    reward_rate: 1000,
    reward_model: "ppc",
    budget: 5000000,
    spent_budget: 1500000,
    promoters_count: 42,
    content_link: "#",
    instructions: "1. Share the link on your social media.\n2. Use the hashtag #NewProduct.\n3. Get creative!",
  }

  const joinedCampaign = {
    tracking_link: "https://trk.example.com/xyz123",
  }

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

  const handleJoinCampaign = async () => {
    toast({
      title: "Feature not available",
      description: "This feature is being migrated. Please try again later.",
      variant: "destructive",
    })
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

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Campaign Details</h1>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{campaign.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">by {campaign.creator_id}</CardDescription>
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
                <a href={campaign.content_link} target="_blank" rel="noopener noreferrer" className="text-primary underline">
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
            <Button onClick={handleJoinCampaign} className="w-full">
              Join Campaign
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
