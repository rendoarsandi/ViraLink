"use client"

// Correctly import from @/lib/auth-client which exports methods from better-auth/react's authClient
import { useSession, signIn, signOut } from "@/lib/auth-client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the user object structure we expect from BetterAuth's session.user
// This should align with what BetterAuth actually provides in session.user
interface BetterAuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  // Ensure these fields match the actual session.user structure from better-auth
}

// Define the context state
interface AuthContextType {
  user: BetterAuthUser | null; // User object from better-auth session
  userType: "creator" | "promoter" | null; // Application-specific role
  isLoading: boolean; // Based on session loading state
  // login function might need to be re-evaluated if signIn is a redirect (OIDC)
  // For now, it's kept, but its usage for OIDC might be just calling signIn("oidc")
  loginWithRole: (type: "creator" | "promoter") => Promise<void>;
  logoutFromApp: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// This component now directly uses the useSession hook from our authClient
function AuthProviderContent({ children }: { children: ReactNode }) {
  // useSession from @/lib/auth-client returns { data: session, isPending, error, refetch }
  const { data: session, isPending } = useSession();
  const [userType, setUserType] = useState<"creator" | "promoter" | null>(null);

  // Assuming session.user structure matches BetterAuthUser
  const user = session?.user as BetterAuthUser | null ?? null;
  const isLoading = isPending;

  // This login function's purpose is mainly to set userType locally
  // and then call the global signIn (which for OIDC would redirect).
  // The actual OIDC sign-in is provider-based.
  const loginWithRole = async (type: "creator" | "promoter") => {
    setUserType(type); // Set app-specific role
    // For OIDC, signIn usually takes a provider argument e.g. signIn('oidc') or signIn.social({provider: 'oidc'})
    // The generic signIn() call might not be what's needed for OIDC.
    // This might need to be adapted based on how login page calls signIn.
    // For now, assuming a generic signIn() call is a placeholder or for a different auth method.
    // If using OIDC as configured, this signIn() here might not be the one used for actual login.
    // await signIn(); // This might be a global signIn from better-auth/react
    console.log("AuthContext: login function called, userType set. Actual sign-in is via login page.");
  };

  const logoutFromApp = async () => {
    await signOut(); // Call signOut from @/lib/auth-client
    setUserType(null); // Clear app-specific role
  };

  const value: AuthContextType = {
    user,
    userType,
    isLoading,
    loginWithRole,
    logoutFromApp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Create the provider component
// Removed the SessionProvider wrapper as it's not from better-auth and likely not needed.
export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthProviderContent>{children}</AuthProviderContent>;
}