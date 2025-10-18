// app/favorites/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, Package, TrendingUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContractViewer } from "@/components/contract-viewer";

type FavRow = {
  PACKAGE_ID: string;
  NETWORK: string;
  MODULE_COUNT: number | null;
  FUNCTION_COUNT: number | null;
  STRUCT_COUNT: number | null;
  INSERTED_AT: string;
};

export default function FavoritesPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: async () => {
      const r = await fetch("/api/favorites/list");
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed to load favorites");
      return j.items as FavRow[];
    },
    staleTime: 15_000,
  });

  // Select newest on first successful load
  useEffect(() => {
    if (!selected && q.data && q.data.length > 0) {
      setSelected(q.data[0].PACKAGE_ID);
    }
  }, [q.data, selected]);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            {/* Sidebar list */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Favorites</CardTitle>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => q.refetch()}
                  disabled={q.isFetching}
                >
                  <RefreshCw className={`h-4 w-4 ${q.isFetching ? "animate-spin" : ""}`} />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-220px)]">
                  <div className="p-3 space-y-2">
                    {q.isLoading && (
                      <p className="text-sm text-muted-foreground px-1 py-2">Loading…</p>
                    )}
                    {q.isError && (
                      <p className="text-sm text-destructive px-1 py-2">
                        {(q.error as Error)?.message || "Failed to load favorites."}
                      </p>
                    )}
                    {!q.isLoading && q.data?.length === 0 && (
                      <p className="text-sm text-muted-foreground px-1 py-2">
                        No favorites yet. Save a contract from Explorer.
                      </p>
                    )}
                    {q.data?.map((row) => (
                      <button
                        key={row.PACKAGE_ID + row.INSERTED_AT}
                        onClick={() => setSelected(row.PACKAGE_ID)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-colors",
                          selected === row.PACKAGE_ID
                            ? "bg-secondary border-primary"
                            : "bg-card border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Package className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="font-mono text-xs truncate">{row.PACKAGE_ID}</span>
                          </div>
                          <Badge variant="outline" className="text-2xs">{row.NETWORK}</Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {row.FUNCTION_COUNT ?? 0} funcs
                          </span>
                          <span>{row.MODULE_COUNT ?? 0} modules</span>
                          <span>{row.STRUCT_COUNT ?? 0} structs</span>
                          <span className="flex items-center gap-1 ml-auto">
                            <Clock className="h-3 w-3" />
                            {row.INSERTED_AT}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Viewer with Gemini tab visible */}
            <div>
              {selected ? (
                <ContractViewer contractId={selected} /* showGemini defaults to true */ />
              ) : (
                <Card className="border-border p-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Select a saved contract on the left to view details (Overview / Functions / Structs / Source / Gemini).
                  </p>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
