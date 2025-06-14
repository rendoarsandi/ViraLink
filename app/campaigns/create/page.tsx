"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export default function CreateCampaignPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, userType } = useAuth()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [objective, setObjective] = useState("")
  const [budget, setBudget] = useState("")
  const [rewardModel, setRewardModel] = useState("ppc")
  const [rewardRate, setRewardRate] = useState("")
  const [contentLink, setContentLink] = useState("")
  const [instructions, setInstructions] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if not creator
  if (userType !== "creator") {
    router.push("/dashboard")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "User not logged in. Please log in to create a campaign.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!contentLink) {
      toast({
        title: "Content Required",
        description: "Please provide a content link.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          objective,
          budget: Number.parseInt(budget),
          rewardModel,
          rewardRate: Number.parseInt(rewardRate),
          contentLink,
          instructions,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create campaign')
      }

      toast({
        title: "Campaign created",
        description: "Your campaign has been created successfully.",
      })

      router.push("/campaigns")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was a problem creating your campaign.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Campaign</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Provide information about your campaign to attract promoters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                placeholder="Enter a catchy title for your campaign"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Campaign Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign in detail"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[100px]"
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="objective">Campaign Objective</Label>
                <Select value={objective} onValueChange={setObjective} required disabled={isLoading}>
                  <SelectTrigger id="objective">
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube_subscribers">Increase YouTube Subscribers</SelectItem>
                    <SelectItem value="instagram_followers">Increase Instagram Followers</SelectItem>
                    <SelectItem value="tiktok_views">Increase TikTok Views</SelectItem>
                    <SelectItem value="website_traffic">Increase Website Traffic</SelectItem>
                    <SelectItem value="product_sales">Increase Product Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Total Budget (Rp)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Enter your total budget in Rupiah"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rewardModel">Reward Model</Label>
                <Select value={rewardModel} onValueChange={setRewardModel} required disabled={isLoading}>
                  <SelectTrigger id="rewardModel">
                    <SelectValue placeholder="Select reward model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ppc">Pay Per Click (PPC)</SelectItem>
                    <SelectItem value="ppa">Pay Per Acquisition (PPA)</SelectItem>
                    <SelectItem value="ppe">Pay Per Engagement (PPE)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rewardRate">Reward Rate (Rp per unit)</Label>
                <Input
                  id="rewardRate"
                  type="number"
                  placeholder="Enter reward rate in Rupiah"
                  value={rewardRate}
                  onChange={(e) => setRewardRate(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentLink">Content Link</Label>
              <Input
                id="contentLink"
                placeholder="Enter link to Google Drive, YouTube video, etc."
                value={contentLink}
                onChange={(e) => setContentLink(e.target.value)}
                disabled={isLoading}
                required
              />
              <p className="text-sm text-muted-foreground">
                Provide a link where promoters can access your content for promotion.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions for Promoters</Label>
              <Textarea
                id="instructions"
                placeholder="Provide clear instructions on how promoters should use your content"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="min-h-[100px]"
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Campaign"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
