"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, DollarSign, Users, BarChart3, Loader2, CalendarDays } from "lucide-react" // Added CalendarDays
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
interface Campaign {
  id: string
  creatorId: string
  title: string
  description: string | null
  objective: string | null
  rewardModel: string | null
  rewardRate: number | null
  budget: number | null
  spentBudget: number
  promotersCount: number
  clicksCount: number
  status: string
  createdAt: string
  contentLink: string | null
  instructions: string | null
  creator: {
    id: string
    name: string | null
    email: string | null
  }
  _count: {
    promoterCampaigns: number
  }
}

export default function DiscoverPage() {
  const { user, userType, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterObjective, setFilterObjective] = useState("all")
  const [filterRewardModel, setFilterRewardModel] = useState("all")
  const [availableCampaigns, setAvailableCampaigns] = useState<Campaign[]>([])
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true)

  const fetchDiscoverCampaigns = async () => {
    setIsLoadingCampaigns(true)
    try {
      const response = await fetch("/api/discover-campaigns")

      // Always try to parse JSON, even if response is not ok, to get error message
      const data = await response.json()

      if (!response.ok) {
        // If response is not ok, throw an error with the message from the API
        throw new Error(data.error || "Failed to fetch discoverable campaigns")
      }
      setAvailableCampaigns(data)
    } catch (error: any) {
      console.error("Error fetching discover campaigns:", error)
      toast({
        title: "Error",
        description: error.message || "Could not load discoverable campaigns.",
        variant: "destructive",
      })
      setAvailableCampaigns([]) // Clear campaigns on error
    } finally {
      setIsLoadingCampaigns(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (!authLoading && userType !== "promoter") {
      router.push("/dashboard")
    } else if (user && userType === "promoter") {
      fetchDiscoverCampaigns()
    }
  }, [user, userType, authLoading, router])

  const filteredCampaigns = availableCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesObjective =
      filterObjective === "all" || campaign.objective?.toLowerCase().includes(filterObjective.toLowerCase())
    const matchesRewardModel = filterRewardModel === "all" || campaign.rewardModel === filterRewardModel

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

  if (authLoading || isLoadingCampaigns) {
    // Check isLoadingCampaigns here
    return (
      <div className="container py-10 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading campaigns...</span>
      </div>
    )
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
                  <CardDescription className="text-sm text-muted-foreground">
                    by {campaign.creator.name || campaign.creator.email || "Unknown Creator"}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="capitalize px-3 py-1 text-xs">
                  {campaign.objective?.replace(/_/g, " ") || "General"}
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
                      Rp {(campaign.rewardRate || 0).toLocaleString()} {getRewardModelLabel(campaign.rewardModel || "ppc")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{campaign.promotersCount} promoters joined</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Rp {((campaign.budget || 0) - campaign.spentBudget).toLocaleString()} budget left</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
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

      {filteredCampaigns.length === 0 && !isLoadingCampaigns && (
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
