import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  DollarSign,
  Feather,
  GitFork,
  Heart,
  Linkedin,
  Star,
  Twitter,
  Users,
} from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-24 md:pt-32 md:pb-36 lg:pt-40 lg:pb-48 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  🚀 New: Now supporting automated performance-based payouts!
                </div>
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Amplify Your Reach,
                  <br className="hidden md:inline" />{" "}
                  <span className="text-primary">Reward Real Impact</span>
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
                  ViraLink connects innovative creators with passionate promoters. Launch powerful campaigns, track
                  real-time results, and reward promoters based on genuine performance.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register?type=creator">
                  <Button size="lg" className="px-8 py-3 text-lg gap-2">
                    Start as a Creator <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register?type=promoter">
                  <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
                    Join as a Promoter
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[350px] md:h-[450px] lg:h-[550px] flex items-center justify-center">
              <div className="absolute w-full h-full bg-primary/10 rounded-3xl transform -rotate-6" />
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="ViraLink Dashboard Preview"
                width={500}
                height={500}
                className="rounded-xl object-cover shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">A Simple Path to Synergy</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Our streamlined process makes collaboration between creators and promoters seamless and effective.
            </p>
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2" />
            <div className="relative grid max-w-6xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                      1
                    </span>
                    For Creators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="font-semibold">Launch Campaign</h3>
                  <p className="text-sm text-muted-foreground">Define goals, upload content, and set your terms.</p>
                </CardContent>
              </Card>
              <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                      2
                    </span>
                    For Promoters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="font-semibold">Discover & Join</h3>
                  <p className="text-sm text-muted-foreground">Find campaigns that match your audience and apply.</p>
                </CardContent>
              </Card>
              <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                      3
                    </span>
                    Collaboration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="font-semibold">Amplify Content</h3>
                  <p className="text-sm text-muted-foreground">Promoters share content, driving engagement.</p>
                </CardContent>
              </Card>
              <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                      4
                    </span>
                    Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="font-semibold">Track & Earn</h3>
                  <p className="text-sm text-muted-foreground">Get rewarded based on measurable performance.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Powerful Tools for Meaningful Impact
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Everything you need to manage successful creator-promoter collaborations.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle>Performance Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track clicks, conversions, and engagement with our real-time analytics dashboard.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <DollarSign className="h-6 w-6" />
                </div>
                <CardTitle>Flexible Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set up rewards based on clicks, engagement, or conversions with secure, automated payouts.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Promoter Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find and approve the perfect promoters for your campaigns from our curated network.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-16 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Loved by Creators & Promoters</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Hear what our users have to say about their success with ViraLink.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="@creatorjane" />
                  <AvatarFallback>CJ</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Creator Jane</CardTitle>
                  <CardDescription>@creatorjane</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "ViraLink helped me connect with promoters who genuinely cared about my content. My campaign reach
                  doubled in a week!"
                </p>
              </CardContent>
              <CardFooter className="flex gap-1">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <Star className="w-4 h-4 text-primary fill-primary" />
                <Star className="w-4 h-4 text-primary fill-primary" />
                <Star className="w-4 h-4 text-primary fill-primary" />
                <Star className="w-4 h-4 text-primary fill-primary" />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="@promotermark" />
                  <AvatarFallback>PM</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Promoter Mark</CardTitle>
                  <CardDescription>@promotermark</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "The platform is so easy to use. I found amazing campaigns and earned rewards for my efforts. Highly
                  recommend it."
                </p>
              </CardContent>
              <CardFooter className="flex gap-1">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <Star className="w-4 h-4 text-primary fill-primary" />
                <Star className="w-4 h-4 text-primary fill-primary" />
                <Star className="w-4 h-4 text-primary fill-primary" />
                <Star className="w-4 h-4 text-primary/50" />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="@techguru" />
                  <AvatarFallback>TG</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Tech Guru</CardTitle>
                  <CardDescription>@techguru</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "As a promoter, I appreciate the transparency and fair reward system. ViraLink is a game-changer for
                  the creator economy."
                </p>
              </CardContent>
              <CardFooter className="flex gap-1">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <Star className="w-4 h-4 text-primary fill-primary" />
                <Star className="w-4 h-4 text-primary fill-primary" />
                <Star className="w-4 h-4 text-primary fill-primary" />
                <Star className="w-4 h-4 text-primary fill-primary" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="relative overflow-hidden rounded-2xl bg-primary/90 p-12 shadow-xl">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="relative z-10 flex flex-col items-center text-center gap-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-foreground">
                Ready to Go Viral?
              </h2>
              <p className="max-w-[600px] text-primary-foreground/80 md:text-xl">
                Join ViraLink today and start your journey towards explosive content growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="px-8 py-3 text-lg gap-2">
                    Get Started Now <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 border-t bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Feather className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">ViraLink</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Connecting creators and promoters for viral content distribution.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="grid gap-2">
                <h3 className="font-semibold">Platform</h3>
                <Link href="/#features" className="text-sm text-muted-foreground hover:text-primary">
                  Features
                </Link>
                <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-primary">
                  How It Works
                </Link>
                <Link href="/#testimonials" className="text-sm text-muted-foreground hover:text-primary">
                  Testimonials
                </Link>
              </div>
              <div className="grid gap-2">
                <h3 className="font-semibold">Company</h3>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
                <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">
                  Careers
                </Link>
              </div>
              <div className="grid gap-2">
                <h3 className="font-semibold">Legal</h3>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-start lg:items-end">
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <GitFork className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">© 2025 ViraLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
