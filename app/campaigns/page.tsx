"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { BarChart3, MoreHorizontal, Plus, Users, Loader2, Play } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// TODO: Re-implement with BetterAuth and Cloudflare Workers
export default function CampaignsPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Placeholder data
  const campaigns = [
    {
      id: "1",
      creator_id: "user1",
      title: "Summer Sale Promotion",
      objective: "product_sales",
      budget: 10000000,
      spent_budget: 4500000,
      promoters_count: 58,
      clicks_count: 12050,
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      creator_id: "user1",
      title: "New App Launch",
      objective: "website_traffic",
      budget: 5000000,
      spent_budget: 5000000,
      promoters_count: 32,
      clicks_count: 8500,
      status: "paused",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Campaigns</h1>
        <Link href="/campaigns/create">
          <Button className="gap-2 px-4 py-2">
            <Plus className="h-4 w-4" /> Create Campaign
          </Button>
        </Link>
      </div>

      <Card className="mb-10 shadow-lg">
        <CardHeader>
          <CardTitle>Campaign Overview</CardTitle>
          <CardDescription>Summary of all your campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <Play className="h-6 w-6" /> {/* Changed icon to Play for active */}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.filter((c) => c.status === "active").length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Promoters</p>
                <p className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.promoters_count, 0)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>Manage and monitor your campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">You haven&apos;t created any campaigns yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Promoters</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{campaign.title}</p>
                        <p className="text-sm text-muted-foreground">{campaign.objective}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={campaign.status === "active" ? "default" : "secondary"} className="capitalize">
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">Rp {campaign.spent_budget.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">of Rp {campaign.budget.toLocaleString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>{campaign.promoters_count}</TableCell>
                    <TableCell>{campaign.clicks_count}</TableCell>
                    <TableCell>{new Date(campaign.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/campaigns/${campaign.id}/analytics`}>View Analytics</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/campaigns/${campaign.id}/edit`}>Edit Campaign</Link>
                          </DropdownMenuItem>
                          {campaign.status === "active" ? (
                            <DropdownMenuItem>Pause Campaign</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>Activate Campaign</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
