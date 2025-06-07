"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, DollarSign, Users, MousePointerClick } from "lucide-react" // Added MousePointerClick
import Link from "next/link"
import { Progress } from "@/components/ui/progress" // Import Progress component

export default function DashboardPage() {
  const { user, userType, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <div className="container py-10 text-center">Loading dashboard...</div>
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user.name}!</h1>

      {userType === "creator" ? <CreatorDashboard /> : <PromoterDashboard />}
    </div>
  )
}

function CreatorDashboard() {
  // Mock data for creator dashboard
  const stats = {
    activeCampaigns: 3,
    totalPromoters: 24,
    totalClicks: 1872,
    totalBudget: 5000000,
    spentBudget: 1250000,
  }

  const budgetProgress = Math.round((stats.spentBudget / stats.totalBudget) * 100)

  return (
    <div className="space-y-12">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently running</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Promoters</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPromoters}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all campaigns</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Overall campaign clicks</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Rp {stats.spentBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">of Rp {stats.totalBudget.toLocaleString()}</p>
            <Progress value={budgetProgress} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">{budgetProgress}% of total budget</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Your most recent active campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div>
                  <p className="font-medium">Summer Product Launch</p>
                  <p className="text-sm text-muted-foreground">12 promoters active</p>
                </div>
                <Link href="/campaigns/1">
                  <Button variant="ghost" size="sm">
                    View <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div>
                  <p className="font-medium">New YouTube Channel Promotion</p>
                  <p className="text-sm text-muted-foreground">8 promoters active</p>
                </div>
                <Link href="/campaigns/2">
                  <Button variant="ghost" size="sm">
                    View <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">TikTok Challenge Campaign</p>
                  <p className="text-sm text-muted-foreground">4 promoters active</p>
                </div>
                <Link href="/campaigns/3">
                  <Button variant="ghost" size="sm">
                    View <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader>
            <CardTitle>Top Performing Promoters</CardTitle>
            <CardDescription>Promoters with the highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    JD
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">542 clicks</p>
                  </div>
                </div>
                <Link href="/promoters/1">
                  <Button variant="ghost" size="sm">
                    Profile
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    AS
                  </div>
                  <div>
                    <p className="font-medium">Alice Smith</p>
                    <p className="text-sm text-muted-foreground">423 clicks</p>
                  </div>
                </div>
                <Link href="/promoters/2">
                  <Button variant="ghost" size="sm">
                    Profile
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    RJ
                  </div>
                  <div>
                    <p className="font-medium">Robert Johnson</p>
                    <p className="text-sm text-muted-foreground">387 clicks</p>
                  </div>
                </div>
                <Link href="/promoters/3">
                  <Button variant="ghost" size="sm">
                    Profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-12">
        <Link href="/campaigns/create">
          <Button size="lg" className="gap-2 px-8 py-3 text-lg">
            Create New Campaign <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

function PromoterDashboard() {
  // Mock data for promoter dashboard
  const stats = {
    activeCampaigns: 2,
    totalClicks: 342,
    totalEarnings: 1250000,
    pendingPayment: 450000,
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently promoting</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all campaigns</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Rp {stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Rp {stats.pendingPayment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting payout</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader>
            <CardTitle>Your Active Campaigns</CardTitle>
            <CardDescription>Campaigns you're currently promoting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div>
                  <p className="font-medium">Summer Product Launch</p>
                  <p className="text-sm text-muted-foreground">Rp 3,500 per click • 124 clicks</p>
                </div>
                <Link href="/campaigns/1/promote">
                  <Button variant="ghost" size="sm">
                    View <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">TikTok Challenge Campaign</p>
                  <p className="text-sm text-muted-foreground">Rp 5,000 per click • 218 clicks</p>
                </div>
                <Link href="/campaigns/3/promote">
                  <Button variant="ghost" size="sm">
                    View <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader>
            <CardTitle>Recommended Campaigns</CardTitle>
            <CardDescription>Campaigns that match your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div>
                  <p className="font-medium">New YouTube Channel Promotion</p>
                  <p className="text-sm text-muted-foreground">Rp 4,000 per click</p>
                </div>
                <Link href="/campaigns/2">
                  <Button variant="ghost" size="sm">
                    Join
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div>
                  <p className="font-medium">Instagram Story Campaign</p>
                  <p className="text-sm text-muted-foreground">Rp 6,000 per click</p>
                </div>
                <Link href="/campaigns/4">
                  <Button variant="ghost" size="sm">
                    Join
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Product Review Campaign</p>
                  <p className="text-sm text-muted-foreground">Rp 7,500 per click</p>
                </div>
                <Link href="/campaigns/5">
                  <Button variant="ghost" size="sm">
                    Join
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-12">
        <Link href="/discover">
          <Button size="lg" className="gap-2 px-8 py-3 text-lg">
            Discover More Campaigns <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
