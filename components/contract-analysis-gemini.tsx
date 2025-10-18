"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Check, Sparkles } from "lucide-react";

type Props = {
  contractId: string;
  normalizedModules: Record<string, any> | null | undefined;
};

export function ContractAnalysisGemini({ contractId, normalizedModules }: Props) {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trim payload to a reasonable size for the API call
  const payload = useMemo(() => {
    if (!normalizedModules) return null;
    const entries = Object.entries(normalizedModules);
    const top = entries.slice(0, 8);
    const trimmed: Record<string, any> = {};
    for (const [name, mod] of top) {
      const funcs = Object.fromEntries(Object.entries(mod?.exposed_functions ?? {}).slice(0, 25));
      const structs = Object.fromEntries(Object.entries(mod?.structs ?? {}).slice(0, 25));
      trimmed[name] = { exposed_functions: funcs, structs };
    }
    const s = JSON.stringify(trimmed);
    return s.length > 180_000 ? s.slice(0, 180_000) + "\n/* truncated */" : s;
  }, [normalizedModules]);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    setAnalysis("");
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contractId, normalizedModulesJson: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Analysis failed");
      setAnalysis(data.text || "");
    } catch (e: any) {
      setError(e?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Gemini Analysis</CardTitle>
          <CardDescription>Summarizes functions/structs from normalized modules.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button onClick={runAnalysis} disabled={!payload || loading} className="gap-2">
            <Sparkles className="h-4 w-4" />
            {loading ? "Analyzing…" : "Analyze with Gemini"}
          </Button>
          <Button variant="outline" onClick={copy} disabled={!analysis} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!payload && (
          <p className="text-sm text-muted-foreground">
            Load a contract first — the normalized modules will be analyzed.
          </p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <ScrollArea className="h-[520px] rounded-md border border-border">
          <pre className="p-4 text-sm whitespace-pre-wrap leading-relaxed">
            {analysis || (loading ? "Crunching the ABI…" : "")}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
