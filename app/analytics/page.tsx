"use client"

import { Header } from "@/components/header"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { AuthProvider } from "@/lib/auth"

export default function AnalyticsPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                Track usage patterns, popular modules, and developer activity powered by Snowflake
              </p>
            </div>
            <AnalyticsDashboard />
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}
