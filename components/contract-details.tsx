"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, ExternalLink, Copy, Check, Calendar, TrendingUp, Users } from "lucide-react";

interface ContractDetailsProps {
  contractId: string;
}

function shortId(id: string) {
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}

export function ContractDetails({ contractId }: ContractDetailsProps) {
  const client = useSuiClient();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1) Fetch normalized modules (ABI-like metadata)
  const modulesQ = useQuery({
    queryKey: ["sui", "pkg", "normalized-modules", contractId],
    queryFn: async () => {
      return client.getNormalizedMoveModulesByPackage({ package: contractId });
    },
    staleTime: 60_000,
  });

  // 2) Best-effort: find the publish tx for this package (and its timestamp)
  const publishQ = useQuery({
    queryKey: ["sui", "pkg", "published-at", contractId],
    queryFn: async () => {
      // scan backwards a few pages to find a transaction where this package was "published"
      let cursor: string | null = null;
      const maxPages = 30; // ~3k txs
      for (let i = 0; i < maxPages; i++) {
        const page = await client.queryTransactionBlocks({
          limit: 100,
          order: "descending",
          cursor: cursor ?? undefined,
          options: { showObjectChanges: true },
        });
        for (const tx of page.data) {
          const changes = (tx.objectChanges ?? []).filter(
            (oc: any) => oc.type === "published" && oc.packageId === contractId
          );
          if (changes.length > 0) {
            return {
              digest: tx.digest,
              timestampMs: Number(tx.timestampMs ?? 0),
            };
          }
        }
        if (!page.nextCursor) break;
        cursor = page.nextCursor;
      }
      return null;
    },
    staleTime: 60_000,
  });

  const isLoading = modulesQ.isLoading || publishQ.isLoading;
  const isError = modulesQ.isError; // publish info is best-effort; don't fail UI if it errors

  // Derive summary metrics from normalized modules
  const derived = useMemo(() => {
    const mods = modulesQ.data ? Object.entries(modulesQ.data) : [];
    const moduleNames = mods.map(([name]) => name);
    let totalFuncs = 0;
    let totalStructs = 0;

    mods.forEach(([, modDef]: any) => {
      totalFuncs += Object.keys(modDef?.exposed_functions ?? {}).length;
      totalStructs += Object.keys(modDef?.structs ?? {}).length;
    });

    const displayName = moduleNames[0]
      ? `${moduleNames[0]} (module)`
      : `Package ${shortId(contractId)}`;

    return {
      moduleNames,
      totalFuncs,
      totalStructs,
      displayName,
    };
  }, [modulesQ.data, contractId]);

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl">Loading contract…</CardTitle>
          <CardDescription>Fetching package metadata from Sui testnet</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-sm text-muted-foreground">Please wait…</CardContent>
      </Card>
    );
  }

  if (isError || !modulesQ.data) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl">Unable to load contract</CardTitle>
          <CardDescription>We couldn’t fetch normalized modules for this package.</CardDescription>
        </CardHeader>
        <CardContent className="py-6 text-sm text-muted-foreground">
          Check that the package ID is on <b>testnet</b> and try again.
        </CardContent>
      </Card>
    );
  }

  const publishedAt = publishQ.data?.timestampMs
    ? new Date(publishQ.data.timestampMs).toLocaleString()
    : "Unknown";
  const explorerUrl = `https://suiscan.xyz/testnet/object/${contractId}`;

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">{derived.displayName}</CardTitle>
              <Badge variant="secondary" className="font-mono text-xs">
                {shortId(contractId)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Modules: {derived.moduleNames.length}
              </Badge>
            </div>
            <CardDescription className="leading-relaxed">
              Normalized module metadata fetched live from Sui testnet.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Package ID */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Package ID</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono bg-secondary px-3 py-2 rounded border border-border">
              {contractId}
            </code>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(contractId)}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={explorerUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Published
            </div>
            <p className="text-sm font-medium">{publishedAt}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Exposed Functions
            </div>
            <p className="text-sm font-medium">{derived.totalFuncs}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Struct Types
            </div>
            <p className="text-sm font-medium">{derived.totalStructs}</p>
          </div>
        </div>

        <Separator />

        {/* Modules list */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Modules</p>
          <div className="flex flex-wrap gap-2">
            {derived.moduleNames.map((m) => (
              <Badge key={m} variant="outline" className="font-mono text-xs">
                {m}
              </Badge>
            ))}
          </div>
        </div>

        {/* (Optional) Raw JSON button */}
        {/* <Button variant="ghost" size="sm" asChild>
          <a href={`/api/contracts/${contractId}`} target="_blank" rel="noreferrer">
            View raw JSON
          </a>
        </Button> */}
      </CardContent>
    </Card>
  );
}
