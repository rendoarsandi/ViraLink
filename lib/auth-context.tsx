"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

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
  const supabase = createClient()
  const router = useRouter()

  const fetchUserProfile = useCallback(
    async (supabaseUser: any) => {
      if (!supabaseUser) {
        setUser(null)
        setUserType(null)
        return
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("full_name, role, avatar_url")
          .eq("id", supabaseUser.id)
          .single()

        if (error && error.code === "PGRST116") {
          // No rows found
          // If profile doesn't exist, create it (e.g., for new Google sign-ups)
          const intendedRole = localStorage.getItem("pendingUserType") || "promoter" // Get role from local storage or default
          localStorage.removeItem("pendingUserType") // Clear pending type

          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: supabaseUser.id,
              full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0],
              email: supabaseUser.email,
              avatar_url: supabaseUser.user_metadata?.avatar_url || `/placeholder.svg?height=32&width=32`,
              role: intendedRole,
            })
            .select("full_name, role, avatar_url")
            .single()

          if (createError) throw createError

          setUser({
            id: supabaseUser.id,
            name: newProfile.full_name,
            email: supabaseUser.email,
            image: newProfile.avatar_url,
            role: newProfile.role,
          })
          setUserType(newProfile.role)
        } else if (error) {
          throw error
        } else {
          setUser({
            id: supabaseUser.id,
            name: profile.full_name,
            email: supabaseUser.email,
            image: profile.avatar_url,
            role: profile.role,
          })
          setUserType(profile.role)
        }
      } catch (error) {
        console.error("Error fetching or creating user profile:", error)
        setUser(null)
        setUserType(null)
      }
    },
    [supabase],
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

      // 2. If no mock user, check Supabase session
      const { data } = await supabase.auth.getSession()
      const session = data?.session // Safely access session
      if (isMounted) {
        if (session?.user) {
          await fetchUserProfile(session.user)
        } else {
          setUser(null)
          setUserType(null)
        }
        setIsLoading(false) // Set loading false after initial check
      }
    }

    handleInitialAuth()

    // 3. Set up real-time listener for Supabase auth changes
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      const subscription = data?.subscription // Safely access subscription
      if (isMounted) {
        setIsLoading(true) // Set loading true when auth state changes
        if (session?.user) {
          await fetchUserProfile(session.user)
        } else {
          setUser(null)
          setUserType(null)
          setIsLoading(false) // Set loading false after state is updated
        }
      }
    })

    return () => {
      isMounted = false // Cleanup flag
      // Ensure subscription exists before unsubscribing
      if (data?.subscription) {
        data.subscription.unsubscribe()
      }
    }
  }, [supabase, fetchUserProfile]) // fetchUserProfile is a dependency because it's called inside useEffect

  const loginWithGoogle = async (type: UserType) => {
    setIsLoading(true)
    try {
      if (type) {
        localStorage.setItem("pendingUserType", type)
      }
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error("Google login failed:", error)
      setIsLoading(false)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string, type: UserType) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: type,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: name,
          email: email,
          role: type,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        })
        if (profileError) throw profileError

        setUser({
          id: data.user.id,
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
      const { error } = await supabase.auth.signOut()
      if (error) throw error
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
