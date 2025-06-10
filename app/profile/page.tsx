"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

// TODO: Re-implement with BetterAuth
export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()

  // Placeholder data
  const [fullName, setFullName] = useState("Demo User")
  const [avatarUrl, setAvatarUrl] = useState("/placeholder-user.jpg")
  const [userEmail, setUserEmail] = useState("demo@example.com")
  const [userType, setUserType] = useState("creator")
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    toast({
      title: "Feature not available",
      description: "Profile update functionality is being migrated. Please try again later.",
      variant: "destructive",
    })
    setIsSaving(false)
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Card className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleUpdateProfile}>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Manage your personal information and account settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={fullName} />
                <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">{fullName}</h2>
                <p className="text-muted-foreground">{userEmail}</p>
                <Badge variant="secondary" className="capitalize">
                  {userType}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={userEmail}
                disabled // Email is usually not editable directly here
              />
              <p className="text-sm text-muted-foreground">Email address cannot be changed from this page.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                placeholder="URL to your avatar image"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                disabled={isSaving}
              />
              <p className="text-sm text-muted-foreground">You can use a direct image URL for your avatar.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
