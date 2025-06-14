"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { createDatabaseClient } from "@/lib/db"

type UserType = "creator" | "promoter" | null

interface User {
  id: string
  name: string
  email: string
  image: string
  role: UserType // Add role to the User interface
}

interface AuthContextType {
  user: User | null
  userType: UserType
  loginWithGoogle: (type: UserType) => Promise<void>
  register: (name: string, email: string, password: string, type: UserType) => Promise<void>
  mockLogin: (type: UserType) => Promise<void> // Mock login function
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userType, setUserType] = useState<UserType>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const db = createDatabaseClient()

  const fetchUserProfile = useCallback(
    async (betterAuthUser: any) => {
      if (!betterAuthUser) {
        setUser(null)
        setUserType(null)
        return
      }

      try {
        // Try to find existing profile
        const profile = await db.profile.findUnique({
          where: { email: betterAuthUser.email },
        })

        if (!profile) {
          // If profile doesn't exist, create it (e.g., for new Google sign-ups)
          const intendedRole = localStorage.getItem("pendingUserType") || "promoter" // Get role from local storage or default
          localStorage.removeItem("pendingUserType") // Clear pending type

          const newProfile = await db.profile.create({
            data: {
              name: betterAuthUser.name || betterAuthUser.email?.split("@")[0] || "User",
              email: betterAuthUser.email,
              userType: intendedRole,
            },
          })

          setUser({
            id: betterAuthUser.id,
            name: newProfile.name || "User",
            email: betterAuthUser.email,
            image: betterAuthUser.image || `/placeholder.svg?height=32&width=32`,
            role: newProfile.userType as UserType,
          })
          setUserType(newProfile.userType as UserType)
        } else {
          setUser({
            id: betterAuthUser.id,
            name: profile.name || "User",
            email: betterAuthUser.email,
            image: betterAuthUser.image || `/placeholder.svg?height=32&width=32`,
            role: profile.userType as UserType,
          })
          setUserType(profile.userType as UserType)
        }
      } catch (error) {
        console.error("Error fetching or creating user profile:", error)
        setUser(null)
        setUserType(null)
      }
    },
    [db],
  )

  useEffect(() => {
    let isMounted = true // Flag to prevent state updates on unmounted component

    const handleInitialAuth = async () => {
      // 1. Check for mock user first
      const storedMockUser = localStorage.getItem("mockUser")
      if (storedMockUser) {
        try {
          const parsedUser: User = JSON.parse(storedMockUser)
          if (isMounted) {
            setUser(parsedUser)
            setUserType(parsedUser.role)
            setIsLoading(false)
          }
          return // If mock user found, we're done with initial loading
        } catch (e) {
          console.error("Failed to parse mock user from localStorage", e)
          localStorage.removeItem("mockUser")
        }
      }

      // 2. If no mock user, check BetterAuth session
      try {
        const session = await authClient.getSession()
        if (isMounted) {
          if (session?.data?.user) {
            await fetchUserProfile(session.data.user)
          } else {
            setUser(null)
            setUserType(null)
          }
          setIsLoading(false) // Set loading false after initial check
        }
      } catch (error) {
        console.error("Failed to get session:", error)
        if (isMounted) {
          setUser(null)
          setUserType(null)
          setIsLoading(false)
        }
      }
    }

    handleInitialAuth()

    // 3. For now, we'll skip the real-time listener as BetterAuth React client
    // doesn't have onSessionChange method. We'll rely on manual session checks.

    return () => {
      isMounted = false // Cleanup flag
    }
  }, [fetchUserProfile]) // fetchUserProfile is a dependency because it's called inside useEffect

  const loginWithGoogle = async (type: UserType) => {
    setIsLoading(true)
    try {
      if (type) {
        localStorage.setItem("pendingUserType", type)
      }
      
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error) {
      console.error("Google login failed:", error)
      setIsLoading(false)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string, type: UserType) => {
    setIsLoading(true)
    try {
      // First create the BetterAuth user
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      if (result.data?.user) {
        // Create profile in our database
        const profile = await db.profile.create({
          data: {
            name: name,
            email: email || "",
            userType: type || "promoter",
          },
        })

        setUser({
          id: result.data.user.id,
          name: name,
          email: email,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          role: type,
        })
        setUserType(type)
      }
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const mockLogin = async (type: UserType) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockUser: User = {
        id: `mock-${type}-${Math.random().toString(36).substr(2, 9)}`,
        name: type === "creator" ? "Mock Creator" : "Mock Promoter",
        email: type === "creator" ? "creator@example.com" : "promoter@example.com",
        image: `/placeholder.svg?height=32&width=32`,
        role: type,
      }

      setUser(mockUser)
      setUserType(type)
      localStorage.setItem("mockUser", JSON.stringify(mockUser))
      router.push("/dashboard")
    } catch (error) {
      console.error("Mock login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authClient.signOut()
      setUser(null)
      setUserType(null)
      localStorage.removeItem("mockUser")
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, userType, loginWithGoogle, register, mockLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
