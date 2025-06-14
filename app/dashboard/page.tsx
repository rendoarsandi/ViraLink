"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, DollarSign, Users, MousePointerClick, TrendingUp, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts"

// Type definitions
interface Profile {
  id: string
  name: string
}

interface PromoterCampaignForCreator {
  id: string
  clicks: number
  earnings: number
  promoterId: string
  promoter: Profile
}

interface CampaignForCreator {
  id: string
  title: string
  status: "active" | "inactive" | "completed"
  budget: number
  promoterCampaigns: PromoterCampaignForCreator[]
}

interface TopPromoter {
  id: string
  name: string
  totalClicks: number
}

interface Activity {
  text: string
  time: string
}

interface ChartData {
  name: string
  clicks: number
}

interface CampaignForPromoter {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: "active" | "inactive" | "completed";
    targetAudience: string;
    rewardRate: number;
}

interface PromoterCampaign {
    id: string;
    clicks: number;
    earnings: number;
    campaigns: CampaignForPromoter[];
}

interface RecommendedCampaign {
  id: string;
  title: string;
  rewardRate: number;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending";
}


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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
        <p className="text-lg text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {userType === "creator" ? <CreatorDashboard /> : <PromoterDashboard />}
    </div>
  )
}

function CreatorDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalPromoters: 0,
    totalClicks: 0,
    totalBudget: 0,
    spentBudget: 0,
  })
  const [recentCampaigns, setRecentCampaigns] = useState<CampaignForCreator[]>([])
  const [topPromoters, setTopPromoters] = useState<TopPromoter[]>([])
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch campaigns created by the user
        const response = await fetch('/api/creator-campaigns')
        if (!response.ok) throw new Error('Failed to fetch campaigns')
        const campaigns = await response.json()

        if (!campaigns) return

        // Calculate stats
        const activeCampaigns = campaigns.filter((c: any) => c.status === "active")
        const allPromoterCampaigns = campaigns.flatMap((c: any) => c.promoterCampaigns || [])
        const uniquePromoterIds = new Set(allPromoterCampaigns.map((pc: any) => pc.promoterId))
        const totalClicks = allPromoterCampaigns.reduce((sum: number, pc: any) => sum + pc.clicks, 0)
        const totalBudget = campaigns.reduce((sum: number, c: any) => sum + (c.budget || 0), 0)
        const spentBudget = allPromoterCampaigns.reduce((sum: number, pc: any) => sum + (pc.earnings || 0), 0)

        setStats({
          activeCampaigns: activeCampaigns.length,
          totalPromoters: uniquePromoterIds.size,
          totalClicks,
          totalBudget,
          spentBudget,
        })

        // Prepare data for components
        setRecentCampaigns(campaigns.slice(0, 3))

        const promoterPerformance = allPromoterCampaigns.reduce((acc: any, pc: any) => {
          if (!pc.promoter) return acc; // Skip if promoter is missing
          acc[pc.promoterId] = acc[pc.promoterId] || { 
            id: pc.promoterId, 
            name: pc.promoter.fullName || 'Unknown', 
            totalClicks: 0 
          }
          acc[pc.promoterId].totalClicks += pc.clicks
          return acc
        }, {})

        const sortedPromoters = Object.values(promoterPerformance).sort((a: any, b: any) => b.totalClicks - a.totalClicks)
        setTopPromoters(sortedPromoters.slice(0, 3) as TopPromoter[])

        // Mock recent activities and chart data for now
        setRecentActivities([
          { text: "New promoter 'Jane Doe' joined 'Summer Product Launch'", time: "5 minutes ago" },
          { text: "'New YouTube Channel Promotion' reached 500 clicks", time: "1 hour ago" },
        ])
        setChartData([
          { name: 'Day 1', clicks: 400 }, { name: 'Day 2', clicks: 300 }, { name: 'Day 3', clicks: 200 },
          { name: 'Day 4', clicks: 278 }, { name: 'Day 5', clicks: 189 }, { name: 'Day 6', clicks: 239 },
          { name: 'Day 7', clicks: 349 },
        ])

      } catch (error) {
        console.error("Error fetching creator dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])
  
  const budgetProgress = stats.totalBudget > 0 ? Math.round((stats.spentBudget / stats.totalBudget) * 100) : 0;

  if (loading) {
    return <div className="container py-10 text-center">Loading dashboard data...</div>
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
            {recentActivities.length > 0 ? (
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
            ) : (
              <p className="text-muted-foreground">No recent activity.</p>
            )}
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
            {recentCampaigns.length > 0 ? (
            <div className="space-y-4">
              {recentCampaigns.map(campaign => (
              <div key={campaign.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div>
                  <p className="font-medium">{campaign.title}</p>
                  <p className="text-sm text-muted-foreground">{campaign.promoterCampaigns?.length || 0} promoters active</p>
                </div>
                <Link href={`/campaigns/${campaign.id}`}>
                  <Button variant="ghost" size="sm">
                    View <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              ))}
            </div>
            ) : (
              <p className="text-muted-foreground">You haven't created any campaigns yet.</p>
            )}
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader>
            <CardTitle>Top Performing Promoters</CardTitle>
            <CardDescription>Promoters with the highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            {topPromoters.length > 0 ? (
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
            ) : (
              <p className="text-muted-foreground">No promoters have joined your campaigns yet.</p>
            )}
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
  const { user } = useAuth()
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalClicks: 0,
    totalEarnings: 0,
    pendingPayment: 0,
  })
  const [activeCampaigns, setActiveCampaigns] = useState<PromoterCampaign[]>([])
  const [recommendedCampaigns, setRecommendedCampaigns] = useState<RecommendedCampaign[]>([])
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch recommended campaigns
        const response = await fetch('/api/discover-campaigns')
        if (!response.ok) throw new Error('Failed to fetch campaigns')
        const allCampaigns = await response.json()

        // Mock payment history for now
        const mockPayments: Payment[] = [
          { id: "PAY-001", date: "2024-05-28", amount: 500000, status: "Paid" },
          { id: "PAY-002", date: "2024-05-15", amount: 300000, status: "Paid" },
          { id: "PAY-003", date: "2024-05-01", amount: 450000, status: "Paid" },
        ]

        // Mock promoter campaigns data for now
        const mockPromoterCampaigns: PromoterCampaign[] = []

        // Calculate stats
        const totalClicks = mockPromoterCampaigns.reduce((sum, pc) => sum + pc.clicks, 0)
        const totalEarnings = mockPromoterCampaigns.reduce((sum, pc) => sum + pc.earnings, 0)
        // Pending payment logic would be more complex, this is a placeholder
        const pendingPayment = totalEarnings * 0.2

        setStats({
          activeCampaigns: mockPromoterCampaigns.length,
          totalClicks,
          totalEarnings,
          pendingPayment,
        })
        setActiveCampaigns(mockPromoterCampaigns)
        setRecommendedCampaigns(allCampaigns.slice(0, 3) || [])
        setPaymentHistory(mockPayments)
      } catch (error) {
        console.error("Error fetching promoter dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return <div className="container py-10 text-center">Loading dashboard data...</div>
  }

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
            {activeCampaigns.length > 0 ? (
              <div className="space-y-4">
                {activeCampaigns.map(pc => (
                  <div key={pc.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                    <div>
                      <p className="font-medium">{pc.campaigns[0]?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Rp {pc.campaigns[0]?.rewardRate.toLocaleString()} per click • {pc.clicks.toLocaleString()} clicks
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
            ) : (
              <p className="text-muted-foreground">You are not promoting any campaigns yet.</p>
            )}
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
          <CardHeader>
            <CardTitle>Recommended Campaigns</CardTitle>
            <CardDescription>Campaigns that match your profile</CardDescription>
          </CardHeader>
          <CardContent>
            {recommendedCampaigns.length > 0 ? (
              <div className="space-y-4">
                {recommendedCampaigns.map(campaign => (
                  <div key={campaign.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                    <div>
                      <p className="font-medium">{campaign.title}</p>
                      <p className="text-sm text-muted-foreground">Rp {campaign.rewardRate.toLocaleString()} per click</p>
                    </div>
                    <Link href={`/campaigns/${campaign.id}`}>
                      <Button variant="ghost" size="sm">
                        Join
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No new campaign recommendations at the moment.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-shadow duration-200 rounded-xl">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your recent earnings and payouts (mock data)</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentHistory.length > 0 ? (
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
          ) : (
            <p className="text-muted-foreground">No payment history available.</p>
          )}
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
