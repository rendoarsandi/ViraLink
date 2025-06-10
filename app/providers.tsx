"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { AuthProvider, useAuth } from "@/lib/auth/context" // Updated import path
import { StatsigClient } from "@statsig/js-client"
import { StatsigAutoCapturePlugin } from "@statsig/web-analytics"
import { StatsigSessionReplayPlugin } from "@statsig/session-replay"

// Create a context for the Statsig client
const StatsigContext = createContext<StatsigClient | null>(null)

// Custom hook to use the Statsig client
export function useStatsig() {
  return useContext(StatsigContext)
}

function StatsigProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth() // Now using the new useAuth hook
  const [statsigClient, setStatsigClient] = useState<StatsigClient | null>(null)

  useEffect(() => {
    // Initialize Statsig with user from BetterAuth context
    const statsigUser = user ? { userID: user.id, email: user.email } : undefined
    
    const client = new StatsigClient(
      "client-IrtmkOC2MMvnBYRKxw0NiB6EMz6pV1MLoJ7cBomnjHd",
      statsigUser || {},
      {
        plugins: [new StatsigSessionReplayPlugin(), new StatsigAutoCapturePlugin()],
      }
    )

    client.initializeAsync().then(() => {
      setStatsigClient(client)
    })
  }, [user])

  return <StatsigContext.Provider value={statsigClient}>{children}</StatsigContext.Provider>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StatsigProvider>{children}</StatsigProvider>
    </AuthProvider>
  )
}
