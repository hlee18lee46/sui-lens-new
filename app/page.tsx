"use client"

import { Header } from "@/components/header"
import { ContractViewer } from "@/components/contract-viewer"
import { AuthProvider } from "@/lib/auth"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, TrendingUp, Star, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container px-4 py-8">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="space-y-4 text-center py-12">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
                Explore Sui Smart Contracts
                <span className="block text-primary mt-2">with OpenSui Lens</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed">
                Powerful developer tools for inspecting, analyzing, and understanding Sui blockchain smart contracts.
                View modules, functions, and get AI-powered explanations.
              </p>
              <div className="flex items-center justify-center gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link href="/explorer">Start Exploring</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/analytics">View Analytics</Link>
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border">
                <CardHeader>
                  <Package className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Contract Explorer</CardTitle>
                  <CardDescription className="leading-relaxed">
                    Browse and inspect smart contracts with detailed function and struct views
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-accent mb-2" />
                  <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
                  <CardDescription className="leading-relaxed">
                    Track usage patterns, popular modules, and developer activity
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <Star className="h-8 w-8 text-chart-3 mb-2" />
                  <CardTitle className="text-lg">Save Favorites</CardTitle>
                  <CardDescription className="leading-relaxed">
                    Bookmark contracts and create custom presets for quick access
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <Zap className="h-8 w-8 text-chart-4 mb-2" />
                  <CardTitle className="text-lg">AI Explanations</CardTitle>
                  <CardDescription className="leading-relaxed">
                    Get instant AI-powered explanations of complex contract functions
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Demo Contract Viewer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Featured Contract</h2>
                <Button variant="outline" asChild>
                  <Link href="/explorer">View All</Link>
                </Button>
              </div>
              <ContractViewer contractId="0x2::sui_system::defi_swap" />
            </div>
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}
