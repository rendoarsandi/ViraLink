import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, DollarSign, Users } from "lucide-react"
import Image from "next/image" // Import Image component

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5" /> {/* Subtle background pattern */}
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Boost Your Content Reach
                  <br className="hidden md:inline" /> with Powerful Promoters
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
                  Connect with top-tier promoters who can amplify your content and get rewarded based on real
                  performance. A win-win platform for creators and promoters.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register?type=creator">
                  <Button size="lg" className="px-8 py-3 text-lg">
                    I'm a Creator
                  </Button>
                </Link>
                <Link href="/register?type=promoter">
                  <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
                    I'm a Promoter
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=500&width=500" // Adjusted dimensions for better fit
                alt="Platform Preview"
                width={500}
                height={500}
                className="rounded-xl object-cover shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-16 md:py-28 lg:py-36 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform connects content creators with promoters for mutual benefit
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl items-start gap-10 py-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">For Creators</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-xl">Create a Campaign</h4>
                      <p className="text-base text-muted-foreground">
                        Set your budget, upload content, and define reward metrics
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-xl">Approve Promoters</h4>
                      <p className="text-base text-muted-foreground">
                        Review and approve promoters who want to join your campaign
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-xl">Track Performance</h4>
                      <p className="text-base text-muted-foreground">
                        Monitor campaign metrics and promoter performance in real-time
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">For Promoters</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-xl">Discover Campaigns</h4>
                      <p className="text-base text-muted-foreground">
                        Browse available campaigns that match your audience and interests
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-xl">Access & Modify Content</h4>
                      <p className="text-base text-muted-foreground">
                        Download creator content and customize it for your audience
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-xl">Earn Rewards</h4>
                      <p className="text-base text-muted-foreground">
                        Get paid based on your promotion performance metrics
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-16 md:py-28 lg:py-36 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to connect creators with promoters effectively
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl items-start gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-8 shadow-lg bg-card transition-transform hover:scale-105 duration-300 ease-in-out">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Performance Tracking</h3>
              <p className="text-base text-muted-foreground text-center">
                Track clicks, conversions, and engagement with accurate analytics
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-8 shadow-lg bg-card transition-transform hover:scale-105 duration-300 ease-in-out">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Flexible Payments</h3>
              <p className="text-base text-muted-foreground text-center">
                Pay per click, engagement, or conversion with secure transactions
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-8 shadow-lg bg-card transition-transform hover:scale-105 duration-300 ease-in-out">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Content Modification</h3>
              <p className="text-base text-muted-foreground text-center">
                Allow promoters to customize content for better audience engagement
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <Link href="/register">
              <Button className="gap-2 px-8 py-3 text-lg">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 border-t bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <p className="text-sm text-muted-foreground">© 2025 CreatorBoost. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:underline hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:underline hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:underline hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
