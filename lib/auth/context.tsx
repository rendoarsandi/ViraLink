"use client"

import { SessionProvider, useSession, signIn, signOut } from "better-auth"
import React, { createContext, useContext, useState, ReactNode } from "react"

// Define the user object structure we expect from BetterAuth
interface BetterAuthUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  // Add any other user properties provided by BetterAuth
}

// Define the context state
interface AuthContextType {
  user: BetterAuthUser | null
  userType: "creator" | "promoter" | null
  isLoading: boolean
  login: (type: "creator" | "promoter") => Promise<void>
  logout: () => Promise<void>
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

function AuthProviderContent({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [userType, setUserType] = useState<"creator" | "promoter" | null>(null)

  const user = session?.user ?? null
  const isLoading = status === "loading"

  const login = async (type: "creator" | "promoter") => {
    setUserType(type)
    await signIn()
  }

  const logout = async () => {
    await signOut()
    setUserType(null)
  }

  const value = {
    user,
    userType,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderContent>{children}</AuthProviderContent>
    </SessionProvider>
  )
}