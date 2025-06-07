"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/lib/auth-context"
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

export default function Header() {
  const pathname = usePathname()
  const { user, logout, userType } = useAuth()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">ViraLink</span>
          </Link>
          {user && (
            <nav className="hidden md:flex gap-6">
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
              {userType === "creator" ? (
                <>
                  <Link
                    href="/campaigns"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname.startsWith("/campaigns") ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    My Campaigns
                  </Link>
                  <Link
                    href="/payments"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === "/payments" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Payments
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/discover"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === "/discover" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Discover Campaigns
                  </Link>
                  <Link
                    href="/earnings"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === "/earnings" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    My Earnings
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">{userType}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
