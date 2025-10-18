"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Activity, Users, Clock, Package } from "lucide-react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"

const pageViewsData = [
  { date: "Jan 10", views: 245, users: 89 },
  { date: "Jan 11", views: 312, users: 102 },
  { date: "Jan 12", views: 289, users: 95 },
  { date: "Jan 13", views: 401, users: 134 },
  { date: "Jan 14", views: 378, users: 121 },
  { date: "Jan 15", views: 456, users: 156 },
  { date: "Jan 16", views: 523, users: 178 },
]

const popularModulesData = [
  { module: "sui_system", views: 1234, category: "Core" },
  { module: "defi_swap", views: 987, category: "DeFi" },
  { module: "nft_market", views: 756, category: "NFT" },
  { module: "staking", views: 654, category: "Staking" },
  { module: "governance", views: 432, category: "Governance" },
]

const categoryDistribution = [
  { name: "DeFi", value: 35, color: "hsl(var(--chart-1))" },
  { name: "NFT", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Staking", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Governance", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 8, color: "hsl(var(--chart-5))" },
]

const searchTrendsData = [
  { query: "swap tokens", count: 456 },
  { query: "add liquidity", count: 389 },
  { query: "nft marketplace", count: 312 },
  { query: "staking rewards", count: 278 },
  { query: "governance vote", count: 234 },
]

const userActivityData = [
  { hour: "00:00", active: 12 },
  { hour: "04:00", active: 8 },
  { hour: "08:00", active: 45 },
  { hour: "12:00", active: 89 },
  { hour: "16:00", active: 134 },
  { hour: "20:00", active: 98 },
  { hour: "23:00", active: 34 },
]

const topContractsData = [
  { name: "DeFi Swap", interactions: 2341, users: 456 },
  { name: "NFT Market", interactions: 1987, users: 389 },
  { name: "Staking Pool", interactions: 1654, users: 312 },
  { name: "DAO Governance", interactions: 1432, users: 278 },
  { name: "Lending Protocol", interactions: 1234, users: 234 },
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">+18.2%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contracts Inspected</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,421</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">+12.5%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">+8.1%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4m 32s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">+2.3%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-secondary">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Page Views & Users</CardTitle>
                <CardDescription>Daily traffic over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    views: {
                      label: "Views",
                      color: "hsl(var(--chart-1))",
                    },
                    users: {
                      label: "Users",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={pageViewsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="var(--color-views)"
                        fill="var(--color-views)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stroke="var(--color-users)"
                        fill="var(--color-users)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>User Activity by Hour</CardTitle>
                <CardDescription>Peak usage times throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    active: {
                      label: "Active Users",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="active"
                        stroke="var(--color-active)"
                        fill="var(--color-active)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Most Popular Modules</CardTitle>
                <CardDescription>Top 5 most viewed smart contract modules</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    views: {
                      label: "Views",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={popularModulesData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis
                        dataKey="module"
                        type="category"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        width={100}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="views" fill="var(--color-views)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Top Contracts by Interaction</CardTitle>
                <CardDescription>Most interacted contracts this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContractsData.map((contract, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{contract.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Activity className="h-3 w-3" />
                          {contract.interactions.toLocaleString()} interactions
                          <Users className="h-3 w-3 ml-2" />
                          {contract.users.toLocaleString()} users
                        </div>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        #{idx + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>User Growth Trend</CardTitle>
              <CardDescription>New and returning users over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  users: {
                    label: "Active Users",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pageViewsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Top Search Queries</CardTitle>
              <CardDescription>Most popular search terms this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchTrendsData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <Badge variant="outline" className="font-mono w-8 justify-center">
                      {idx + 1}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{item.query}</p>
                        <span className="text-sm text-muted-foreground">{item.count} searches</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(item.count / searchTrendsData[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Contract Category Distribution</CardTitle>
                <CardDescription>Breakdown of contracts by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Percentage",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="var(--color-value)"
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Detailed statistics by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryDistribution.map((category, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm font-bold">{category.value}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${category.value}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
