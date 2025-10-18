"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code2, FileCode, Package, Star, Sparkles, Copy, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContractDetails } from "@/components/contract-details";
import { ContractAnalysisGemini } from "@/components/contract-analysis-gemini";

interface ContractViewerProps {
  contractId: string;
}

function shortId(id: string) {
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}

export function ContractViewer({ contractId }: ContractViewerProps) {
  const client = useSuiClient();
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Fetch normalized modules for this package
  const modulesQ = useQuery({
    queryKey: ["sui", "pkg", "normalized-modules", contractId],
    queryFn: async () => client.getNormalizedMoveModulesByPackage({ package: contractId }),
    enabled: !!contractId,
    staleTime: 60_000,
    keepPreviousData: true,
  });

  const derived = useMemo(() => {
    if (!modulesQ.data) {
      return {
        moduleNames: [] as string[],
        functions: [] as {
          module: string;
          name: string;
          visibility: string;
          isEntry: boolean;
          params: string[];
          returns: string[];
        }[],
        structs: [] as {
          module: string;
          name: string;
          typeParams: string[];
          fields: string[];
        }[],
        displayName: shortId(contractId),
      };
    }

    const entries = Object.entries(modulesQ.data) as any[];
    const moduleNames = entries.map(([mod]) => mod);

    const functions: {
      module: string;
      name: string;
      visibility: string;
      isEntry: boolean;
      params: string[];
      returns: string[];
    }[] = [];

    const structs: {
      module: string;
      name: string;
      typeParams: string[];
      fields: string[];
    }[] = [];

    for (const [modName, modDef] of entries) {
      const funs = modDef?.exposed_functions ?? {};
      for (const [fnName, fdef] of Object.entries(funs) as any) {
        // parameters/return types come as normalized type descriptors; stringify for now
        const params = (fdef.parameters ?? []).map(String);
        const returns = (fdef.return ?? []).map(String);
        functions.push({
          module: modName,
          name: fnName,
          visibility: fdef.visibility,
          isEntry: !!fdef.is_entry,
          params,
          returns,
        });
      }

      const sdefs = modDef?.structs ?? {};
      for (const [sname, sdef] of Object.entries(sdefs) as any) {
        const tps = (sdef.type_parameters ?? []).map((tp: any) => (tp.is_phantom ? "phantom" : "T"));
        const fields = (sdef.fields ?? []).map((f: any) => `${f.name}: ${String(f.type)}`);
        structs.push({
          module: modName,
          name: sname,
          typeParams: tps,
          fields,
        });
      }
    }

    const displayName = moduleNames[0] ? `${moduleNames[0]} (module)` : shortId(contractId);

    // Sort by module then name for stable display
    functions.sort((a, b) => (a.module + a.name).localeCompare(b.module + b.name));
    structs.sort((a, b) => (a.module + a.name).localeCompare(b.module + b.name));

    return { moduleNames, functions, structs, displayName };
  }, [modulesQ.data, contractId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Package className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl">
                  {modulesQ.isLoading ? "Loading…" : derived.displayName}
                </CardTitle>
                <Badge variant="secondary" className="font-mono text-xs">
                  {shortId(contractId)}
                </Badge>
                {!modulesQ.isLoading && (
                  <Badge variant="outline" className="text-xs">
                    {derived.moduleNames.length} modules
                  </Badge>
                )}
              </div>
              <CardDescription className="font-mono text-xs">{contractId}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFavorite((v) => !v)}
                className={cn(isFavorite && "text-accent border-accent")}
              >
                <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(contractId)}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary">
          <TabsTrigger value="overview">
            <Info className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="structs">
            <FileCode className="h-4 w-4 mr-2" />
            Structs
          </TabsTrigger>
          <TabsTrigger value="source">
            <Package className="h-4 w-4 mr-2" />
            Source
          </TabsTrigger>
            <TabsTrigger value="gemini">
    <Sparkles className="h-4 w-4 mr-2" />
    Gemini
  </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <ContractDetails contractId={contractId} />
        </TabsContent>

        {/* Functions (live) */}
        <TabsContent value="functions" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              {modulesQ.isLoading ? "Loading functions…" : `${derived.functions.length} exposed functions`}
            </p>
          </div>

          {modulesQ.isLoading ? (
            <Card className="border-border">
              <CardContent className="py-6 text-sm text-muted-foreground">Loading…</CardContent>
            </Card>
          ) : derived.functions.length === 0 ? (
            <Card className="border-border">
              <CardContent className="py-6 text-sm text-muted-foreground">No exposed functions.</CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {derived.functions.map((fn) => (
                <Card key={`${fn.module}::${fn.name}`} className="border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Code2 className="h-4 w-4 text-primary" />
                          <CardTitle className="font-mono text-lg">
                            {fn.module}::{fn.name}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {fn.visibility}
                          </Badge>
                          {fn.isEntry && (
                            <Badge variant="secondary" className="text-xs">
                              entry
                            </Badge>
                          )}
                        </div>
                        {/* simple signature preview */}
                        <CardDescription className="text-xs leading-relaxed">
                          params:
                          {" ["}
                          {fn.params.join(", ")}
                          {"] "}
                          → returns:
                          {" ["}
                          {fn.returns.join(", ")}
                          {"]"}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0">
                        <Sparkles className="h-4 w-4" />
                        Explain
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Structs (live) */}
        <TabsContent value="structs" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              {modulesQ.isLoading ? "Loading structs…" : `${derived.structs.length} struct definitions`}
            </p>
          </div>

          {modulesQ.isLoading ? (
            <Card className="border-border">
              <CardContent className="py-6 text-sm text-muted-foreground">Loading…</CardContent>
            </Card>
          ) : derived.structs.length === 0 ? (
            <Card className="border-border">
              <CardContent className="py-6 text-sm text-muted-foreground">No structs found.</CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {derived.structs.map((st) => (
                <Card key={`${st.module}::${st.name}`} className="border-border">
                  <CardHeader>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <FileCode className="h-4 w-4 text-accent" />
                        <CardTitle className="font-mono text-lg">
                          {st.module}::{st.name}
                          {st.typeParams.length > 0 && (
                            <span className="text-muted-foreground">
                              &lt;{st.typeParams.join(", ")}&gt;
                            </span>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {st.fields.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No fields.</p>
                    ) : (
                      <div className="space-y-1">
                        {st.fields.map((f, i) => (
                          <code
                            key={i}
                            className="block text-sm font-mono bg-secondary px-3 py-2 rounded border border-border"
                          >
                            {f}
                          </code>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Source (ABI-ish preview) */}
        <TabsContent value="source">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Normalized Modules (JSON)</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(JSON.stringify(modulesQ.data ?? {}, null, 2))
                  }
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <CardDescription>
                Raw normalized metadata from the Sui node. (Move source files aren’t stored on chain.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border border-border">
                <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-words">
                  {modulesQ.isLoading
                    ? "Loading…"
                    : JSON.stringify(modulesQ.data ?? {}, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="gemini">
  <ContractAnalysisGemini
    contractId={contractId}
    normalizedModules={modulesQ.data}
  />
</TabsContent>
      </Tabs>
    </div>
  );
}
