"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
// import { useAuth } from "@/lib/auth-context" // Removed
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"

// TODO: Re-implement with BetterAuth
export default function Header() {
  const pathname = usePathname()
  // Mock user state for now, will be replaced by BetterAuth
  const user = null // Set to null to show logged-out state

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">ViraLink</span>
          </Link>
          {/* Nav links are hidden when logged out */}
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {user ? (
            <p>Welcome</p> // Placeholder for logged-in state
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
