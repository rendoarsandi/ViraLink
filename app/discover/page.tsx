"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, DollarSign, Users, BarChart3, Loader2, CalendarDays } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

// TODO: Re-implement with BetterAuth and Cloudflare Workers
export default function DiscoverPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterObjective, setFilterObjective] = useState("all")
  const [filterRewardModel, setFilterRewardModel] = useState("all")

  // Placeholder data
  const availableCampaigns = [
    {
      id: "1",
      creator_id: "Creator A",
      title: "Promote Our New SaaS Platform",
      description: "Join us in promoting our revolutionary new SaaS platform designed for small businesses.",
      objective: "website_traffic",
      reward_model: "ppc",
      reward_rate: 1500,
      budget: 20000000,
      spent_budget: 5000000,
      promoters_count: 120,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      creator_id: "Creator B",
      title: "Sign-ups for Fitness App",
      description: "Get rewards for every new user who signs up for our fitness application.",
      objective: "product_sales", // Representing sign-ups as sales/acquisitions
      reward_model: "ppa",
      reward_rate: 25000,
      budget: 50000000,
      spent_budget: 12500000,
      promoters_count: 85,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const filteredCampaigns = availableCampaigns.filter(campaign => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesObjective =
      filterObjective === "all" || campaign.objective.toLowerCase().includes(filterObjective.toLowerCase())
    const matchesRewardModel = filterRewardModel === "all" || campaign.reward_model === filterRewardModel

    return matchesSearch && matchesObjective && matchesRewardModel
  })

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

  // If not loading and no user, redirect will handle it.
  // If not loading and user is not promoter, redirect will handle it.
  // So, if we reach here, user is a promoter and loading is done.

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Discover Campaigns</h1>

      {/* Filters */}
      <Card className="mb-10 shadow-lg">
        <CardHeader>
          <CardTitle>Find the Perfect Campaign</CardTitle>
          <CardDescription>Filter campaigns based on your interests and expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Objective</label>
              <Select value={filterObjective} onValueChange={setFilterObjective}>
                <SelectTrigger>
                  <SelectValue placeholder="All objectives" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Objectives</SelectItem>
                  <SelectItem value="youtube_subscribers">Increase YouTube Subscribers</SelectItem>
                  <SelectItem value="instagram_followers">Increase Instagram Followers</SelectItem>
                  <SelectItem value="tiktok_views">Increase TikTok Views</SelectItem>
                  <SelectItem value="website_traffic">Increase Website Traffic</SelectItem>
                  <SelectItem value="product_sales">Increase Product Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reward Model</label>
              <Select value={filterRewardModel} onValueChange={setFilterRewardModel}>
                <SelectTrigger>
                  <SelectValue placeholder="All models" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  <SelectItem value="ppc">Pay Per Click</SelectItem>
                  <SelectItem value="ppa">Pay Per Acquisition</SelectItem>
                  <SelectItem value="ppe">Pay Per Engagement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">{campaign.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">by {campaign.creator_id}</CardDescription>{" "}
                  {/* Placeholder for creator name */}
                </div>
                <Badge variant="outline" className="capitalize px-3 py-1 text-xs">
                  {campaign.objective.replace(/_/g, " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">{campaign.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-base font-medium">
                      Rp {campaign.reward_rate.toLocaleString()} {getRewardModelLabel(campaign.reward_model)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{campaign.promoters_count} promoters joined</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Rp {(campaign.budget - campaign.spent_budget).toLocaleString()} budget left</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>Created: {new Date(campaign.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Link href={`/campaigns/${campaign.id}/join`} className="w-full">
                <Button className="w-full py-2 text-base">Join Campaign</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card className="mt-8 shadow-md">
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground text-lg">No campaigns found matching your criteria.</p>
            <p className="text-base text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
