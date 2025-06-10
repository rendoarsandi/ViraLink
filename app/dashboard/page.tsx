"use client"

// TODO: Re-implement with BetterAuth and Cloudflare Workers
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, DollarSign, Users, MousePointerClick, TrendingUp, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts"

export default function DashboardPage() {
  // Mock user data, assuming this will come from BetterAuth context later
  const [user, setUser] = useState({ name: "Demo User" })
  const [userType, setUserType] = useState("creator") // Can be 'creator' or 'promoter'

  // Simple toggle for demonstration
  const toggleUserType = () => {
    setUserType(current => (current === "creator" ? "promoter" : "creator"))
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-lg text-muted-foreground">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <Button onClick={toggleUserType} variant="outline">
          Switch to {userType === "creator" ? "Promoter" : "Creator"} View
        </Button>
      </div>

      {userType === "creator" ? <CreatorDashboard /> : <PromoterDashboard />}
    </div>
  )
}

function CreatorDashboard() {
  // Placeholder data
  const stats = {
    activeCampaigns: 2,
    totalPromoters: 58,
    totalClicks: 20550,
    totalBudget: 15000000,
    spentBudget: 9500000,
  }
  const recentCampaigns = [
    { id: "1", name: "Summer Sale Promotion", promoter_campaigns: { length: 58 } },
    { id: "2", name: "New App Launch", promoter_campaigns: { length: 32 } },
  ]
  const topPromoters = [
    { id: "p1", name: "Alice", totalClicks: 8200 },
    { id: "p2", name: "Bob", totalClicks: 6500 },
  ]
  const recentActivities = [
    { text: "New promoter 'Jane Doe' joined 'Summer Product Launch'", time: "5 minutes ago" },
    { text: "'New YouTube Channel Promotion' reached 500 clicks", time: "1 hour ago" },
  ]
  const chartData = [
    { name: "Day 1", clicks: 400 }, { name: "Day 2", clicks: 300 }, { name: "Day 3", clicks: 200 },
    { name: "Day 4", clicks: 278 }, { name: "Day 5", clicks: 189 }, { name: "Day 6", clicks: 239 },
    { name: "Day 7", clicks: 349 },
  ]
  const budgetProgress = stats.totalBudget > 0 ? Math.round((stats.spentBudget / stats.totalBudget) * 100) : 0

  return (
    <div className="space-y-12">
      {/* Cards and Charts using placeholder data */}
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

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-2 hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Clicks over the last 7 days (mock data)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your campaigns (mock data)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
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
              {recentCampaigns.map(campaign => (
                <div key={campaign.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">{campaign.promoter_campaigns.length} promoters active</p>
                  </div>
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Button variant="ghost" size="sm">
                      View <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
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
              {topPromoters.map(promoter => (
                <div key={promoter.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {promoter.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{promoter.name}</p>
                      <p className="text-sm text-muted-foreground">{promoter.totalClicks.toLocaleString()} clicks</p>
                    </div>
                  </div>
                  <Link href={`/promoters/${promoter.id}`}>
                    <Button variant="ghost" size="sm">
                      Profile
                    </Button>
                  </Link>
                </div>
              ))}
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
  // Placeholder data
  const stats = {
    activeCampaigns: 3,
    totalClicks: 12500,
    totalEarnings: 1875000,
    pendingPayment: 375000,
  }
  const activeCampaigns = [
    { id: "c1", campaigns: [{ name: "Super Summer Sale", cpc_idr: 150, clicks: 5000 }] },
    { id: "c2", campaigns: [{ name: "Gamer Gear Giveaway", cpc_idr: 200, clicks: 7500 }] },
  ]
  const recommendedCampaigns = [
    { id: "c3", name: "Tech Conference 2025", cpc_idr: 250 },
    { id: "c4", name: "New Mobile Game Launch", cpc_idr: 180 },
  ]
  const paymentHistory = [
    { id: "PAY-001", date: "2024-05-28", amount: 500000, status: "Paid" },
    { id: "PAY-002", date: "2024-05-15", amount: 300000, status: "Paid" },
  ]

  return (
    <div className="space-y-12">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat Cards */}
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
              {activeCampaigns.map(pc => (
                <div key={pc.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div>
                    <p className="font-medium">{pc.campaigns[0]?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Rp {pc.campaigns[0]?.cpc_idr.toLocaleString()} per click • {pc.clicks.toLocaleString()} clicks
                    </p>
                  </div>
                  <Link href={`/campaigns/${pc.campaigns[0]?.id}/promote`}>
                    <Button variant="ghost" size="sm">
                      View <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
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
              {recommendedCampaigns.map(campaign => (
                <div key={campaign.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">Rp {campaign.cpc_idr.toLocaleString()} per click</p>
                  </div>
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Button variant="ghost" size="sm">
                      Join
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your recent earnings and payouts (mock data)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>Rp {payment.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === "Paid" ? "default" : "secondary"}>
                      {payment.status === "Paid" ? <CheckCircle className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
