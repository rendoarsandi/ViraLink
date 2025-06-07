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
import { createClient } from "@/lib/supabase/client" // Import client-side Supabase client
import { v4 as uuidv4 } from "uuid" // For generating unique file names
import { Loader2 } from "lucide-react"

export default function CreateCampaignPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, userType } = useAuth()
  const supabase = createClient() // Initialize client-side Supabase

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [objective, setObjective] = useState("")
  const [budget, setBudget] = useState("")
  const [rewardModel, setRewardModel] = useState("ppc")
  const [rewardRate, setRewardRate] = useState("")
  const [contentLink, setContentLink] = useState("") // For external link
  const [selectedFile, setSelectedFile] = useState<File | null>(null) // For file upload
  const [instructions, setInstructions] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Redirect if not creator
  if (userType !== "creator") {
    router.push("/dashboard")
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setContentLink("") // Clear external link if file is selected
    } else {
      setSelectedFile(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsUploading(false) // Reset upload status

    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "User not logged in. Please log in to create a campaign.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    let finalContentLink = contentLink

    // Handle file upload if a file is selected
    if (selectedFile) {
      setIsUploading(true)
      const fileExtension = selectedFile.name.split(".").pop()
      const filePath = `${user.id}/${uuidv4()}.${fileExtension}` // Unique path for the file

      try {
        const { data, error } = await supabase.storage
          .from("campaign-content") // Use your Supabase bucket name
          .upload(filePath, selectedFile, {
            cacheControl: "3600",
            upsert: false,
          })

        if (error) throw error

        const { data: publicUrlData } = supabase.storage.from("campaign-content").getPublicUrl(filePath)
        finalContentLink = publicUrlData.publicUrl
        toast({
          title: "File Uploaded",
          description: "Your content file has been uploaded successfully.",
        })
      } catch (error: any) {
        toast({
          title: "Upload Failed",
          description: error.message || "There was a problem uploading your content.",
          variant: "destructive",
        })
        setIsLoading(false)
        setIsUploading(false)
        return // Stop submission if upload fails
      } finally {
        setIsUploading(false)
      }
    } else if (!contentLink) {
      // If no file and no external link, show error
      toast({
        title: "Content Required",
        description: "Please provide either a content link or upload a file.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.from("campaigns").insert({
        creator_id: user.id,
        title,
        description,
        objective,
        budget: Number.parseInt(budget),
        reward_model: rewardModel,
        reward_rate: Number.parseInt(rewardRate),
        content_link: finalContentLink, // Use the uploaded URL or external link
        instructions,
        status: "active", // Default status
        promoters_count: 0,
        clicks_count: 0,
        spent_budget: 0,
      })

      if (error) throw error

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
                disabled={isLoading || isUploading}
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
                disabled={isLoading || isUploading}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="objective">Campaign Objective</Label>
                <Select value={objective} onValueChange={setObjective} required disabled={isLoading || isUploading}>
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
                  disabled={isLoading || isUploading}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rewardModel">Reward Model</Label>
                <Select value={rewardModel} onValueChange={setRewardModel} required disabled={isLoading || isUploading}>
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
                  disabled={isLoading || isUploading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentLink">Content Source</Label>
              <Input
                id="contentLink"
                placeholder="Enter link to Google Drive, YouTube video, etc."
                value={contentLink}
                onChange={(e) => {
                  setContentLink(e.target.value)
                  setSelectedFile(null) // Clear selected file if external link is entered
                }}
                disabled={isLoading || isUploading || selectedFile !== null} // Disable if file is selected
              />
              <p className="text-sm text-muted-foreground">
                Provide a link where promoters can access your content for promotion.
              </p>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <span className="w-full border-t" />
              <span className="absolute bg-background px-2 text-sm text-muted-foreground">OR</span>
              <span className="w-full border-t" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUpload">Upload Content File</Label>
              <Input
                id="fileUpload"
                type="file"
                onChange={handleFileChange}
                disabled={isLoading || isUploading || contentLink !== ""} // Disable if external link is entered
              />
              <p className="text-sm text-muted-foreground">Upload a file directly (e.g., image, video, document).</p>
              {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions for Promoters</Label>
              <Textarea
                id="instructions"
                placeholder="Provide clear instructions on how promoters should use your content"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="min-h-[100px]"
                disabled={isLoading || isUploading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading || isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading || isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isUploading ? "Uploading..." : "Creating..."}
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
