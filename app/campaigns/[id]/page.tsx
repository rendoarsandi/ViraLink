"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, LinkIcon, Copy, Edit, Pause, Play, Loader2, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// TODO: Re-implement with BetterAuth and Cloudflare Workers
export default function CreatorCampaignDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()

  // Placeholder data
  const campaign = {
    id: params.id,
    title: "Awesome New Product Launch",
    created_at: new Date().toISOString(),
    objective: "Sales",
    description: "Promote our latest product to drive sales.",
    reward_rate: 1500,
    reward_model: "ppa",
    budget: 10000000,
    spent_budget: 2500000,
    status: "active",
    content_link: "https://example.com/product-page",
    instructions: "Focus on the key features and use the official hashtag.",
  }

  const promoterCampaigns = [
    {
      id: "promo1",
      profiles: { full_name: "John Doe", email: "john@example.com", avatar_url: "/placeholder-user.jpg" },
      tracking_link: "https://trk.example.com/promo1",
      joined_at: new Date().toISOString(),
      clicks: 1520,
      earnings: 22800,
      status: "active",
    },
    {
      id: "promo2",
      profiles: { full_name: "Jane Smith", email: "jane@example.com", avatar_url: "/placeholder-user.jpg" },
      tracking_link: "https://trk.example.com/promo2",
      joined_at: new Date().toISOString(),
      clicks: 890,
      earnings: 13350,
      status: "active",
    },
  ]

  const getRewardModelLabel = (model: string) => {
    return model === "ppa" ? "Per Acquisition" : "Per Click"
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({ title: "Copied!", description: "Link copied to clipboard." })
  }

  const handleToggleCampaignStatus = () => {
    toast({
      title: "Feature not available",
      description: "This feature is being migrated. Please try again later.",
      variant: "destructive",
    })
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{campaign.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/campaigns/${campaign.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Campaign
          </Button>
          <Button variant={campaign.status === "active" ? "destructive" : "default"} onClick={handleToggleCampaignStatus}>
            {campaign.status === "active" ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
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
                <LinkIcon className="h-4 w-4" />
                <a
                  href={campaign.content_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline break-all"
                >
                  View Content
                </a>
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
