"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ContractViewer } from "@/components/contract-viewer"
import { ContractList } from "@/components/contract-list"
import { AuthProvider } from "@/lib/auth"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, TrendingUp, Clock, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExplorerPage() {
  const [selectedContract, setSelectedContract] = useState<string | null>("0x2::sui_system::defi_swap")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-8">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Contract Explorer</h1>
                  <p className="text-muted-foreground mt-2 leading-relaxed">
                    Browse and inspect Sui blockchain smart contracts
                  </p>
                </div>
              </div>

              {/* Search and Filters */}
              <Card className="border-border p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by contract name, package ID, or function..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-secondary border-border"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px] bg-secondary border-border">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Most Popular
                          </div>
                        </SelectItem>
                        <SelectItem value="recent">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Recently Added
                          </div>
                        </SelectItem>
                        <SelectItem value="favorites">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            My Favorites
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
              {/* Contract List Sidebar */}
              <div className="space-y-4">
                <ContractList
                  selectedContract={selectedContract}
                  onSelectContract={setSelectedContract}
                  searchQuery={searchQuery}
                  sortBy={sortBy}
                />
              </div>

{/* Contract Viewer Main Area */}
<div className="space-y-4">
  {selectedContract ? (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Selected Contract</h2>
        <Button
          variant="default"
          onClick={async () => {
            try {
              const res = await fetch("/api/contracts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  packageId: selectedContract,
                  network: "testnet",
                  moduleCount: 3,
                  functionCount: 12,
                  structCount: 5,
                  normalized: { module: "swap", version: "1.0.0" },
                }),
              });

              const data = await res.json();
              if (res.ok) {
                alert("✅ Contract saved to Snowflake!");
              } else {
                alert(`❌ Error: ${data.error || "Failed to save."}`);
              }
            } catch (err: any) {
              alert(`❌ ${err.message}`);
            }
          }}
        >
          Save to Snowflake
        </Button>
      </div>

      <ContractViewer contractId={selectedContract} />
    </>
  ) : (
    <Card className="border-border p-12 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-secondary p-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">No Contract Selected</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Select a contract from the list to view its details, functions, and source code
          </p>
        </div>
      </div>
    </Card>
  )}
</div>

            </div>
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}
