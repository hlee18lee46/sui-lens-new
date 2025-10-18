"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, TrendingUp, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SuiObjectChange, SuiObjectChangePublished } from "@mysten/sui.js/client";

// type guard to narrow to 'published' changes
function isPublishedChange(oc: SuiObjectChange): oc is SuiObjectChangePublished {
  return oc.type === "published";
}

interface ContractListProps {
  selectedContract: string | null;
  onSelectContract: (contractId: string) => void;
  searchQuery: string;
  sortBy: string; // "popular" | "recent" | "favorites"
  favorites?: string[];
}

type PackageItem = {
  id: string;          // packageId
  name: string;        // first module or short id
  package: string;     // packageId
  modules: string[];
  lastUpdated: number; // timestampMs
  views: number;
  isFavorite?: boolean;
};

function shortId(id: string) {
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}

// ...imports stay the same

export function ContractList({
  selectedContract,
  onSelectContract,
  searchQuery,
  sortBy,
  favorites = [],
}: ContractListProps) {
  const client = useSuiClient();

  const { data, isLoading, isError, isFetching } = useQuery({
    // ❌ was: ["sui", "testnet", "published-packages", favorites.length]
    queryKey: ["sui", "testnet", "published-packages"],
    queryFn: async () => {
      const maxPages = 300;            // scan deeper for reliability
      const pageSize = 100 as const;
      let cursor: string | null = null;

      const byPkg = new Map<string, { modules: string[]; timestampMs: number }>();

      for (let i = 0; i < maxPages; i++) {
        const page = await client.queryTransactionBlocks({
          limit: pageSize,
          order: "descending",
          cursor: cursor ?? undefined,
          options: { showObjectChanges: true },
        });

        for (const tx of page.data) {
          const ts = Number(tx.timestampMs ?? 0);
          const changes = (tx.objectChanges ?? []).filter(isPublishedChange);
          for (const oc of changes) {
            const pkg = oc.packageId;
            const modules = oc.modules ?? [];
            const prev = byPkg.get(pkg);
            if (!prev || ts > prev.timestampMs) byPkg.set(pkg, { modules, timestampMs: ts });
          }
        }

        if (!page.nextCursor) break;
        cursor = page.nextCursor;
      }

      const favSet = new Set(favorites);

      return Array.from(byPkg.entries()).map(([pkg, info]) => ({
        id: pkg,
        name: info.modules?.[0] ? `${info.modules[0]} (module)` : `Package ${pkg.slice(0, 6)}…${pkg.slice(-4)}`,
        package: pkg,
        modules: info.modules,
        lastUpdated: info.timestampMs,
        views: 0,
        isFavorite: favSet.has(pkg),
      })) as PackageItem[];
    },
    // ✅ stability settings
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    keepPreviousData: true,
    retry: 1,
  });

  // Filter/sort (unchanged)...
  const sortedContracts = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();
    let list = data;

    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.package.toLowerCase().includes(q) ||
          c.modules.some((m) => m.toLowerCase().includes(q))
      );
    }

    if (sortBy === "recent") {
      list = [...list].sort((a, b) => b.lastUpdated - a.lastUpdated);
    } else if (sortBy === "favorites") {
      list = [...list].filter((c) => c.isFavorite).sort((a, b) => b.lastUpdated - a.lastUpdated);
    } else {
      list = [...list].sort((a, b) => b.lastUpdated - a.lastUpdated);
    }
    return list;
  }, [data, searchQuery, sortBy, favorites]); // ✅ include favorites here (UI-only)

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Contracts</CardTitle>
        <CardDescription>
          {isLoading && "Loading contracts…"}
          {isError && <span className="text-destructive"> Failed to load.</span>}
          {!isLoading && !isError && !isFetching && (
            <>
              {sortedContracts.length} {sortedContracts.length === 1 ? "contract" : "contracts"} found
            </>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-320px)]">
          <div className="space-y-2 p-4 pt-0">
            {/* ✅ don’t show empty state while fetching */}
            {!isLoading && !isError && !isFetching && sortedContracts.length === 0 && (
              <div className="text-sm text-muted-foreground px-1 py-2">
                No published packages found in recent transactions.
                <br />
                Make sure your app is set to <b>testnet</b> in <code>NEXT_PUBLIC_SUI_NETWORK</code>.
              </div>
            )}

            {sortedContracts.map((contract) => (
<button
  key={contract.id}
  onClick={() => onSelectContract(contract.id)}
  className={cn(
    // fit the container and prevent overflow
    "w-full max-w-full min-w-0 text-left rounded-lg border transition-all hover:bg-secondary/50",
    "p-3 sm:p-4", // tighter on small screens
    selectedContract === contract.id
      ? "bg-secondary border-primary shadow-sm"
      : "bg-card border-border hover:border-primary/50"
  )}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Package className="h-4 w-4 text-primary flex-shrink-0" />
                      <h3 className="font-semibold text-sm truncate">{contract.name}</h3>
                    </div>
                    {contract.isFavorite && <Star className="h-4 w-4 text-accent fill-current flex-shrink-0" />}
                  </div>

                  <p className="text-xs font-mono text-muted-foreground truncate">
                    {contract.package}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">Package</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      {contract.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {contract.lastUpdated ? new Date(contract.lastUpdated).toLocaleString() : "—"}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

