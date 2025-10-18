"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea"; // if you don't have it, use <textarea className="...">
import { Copy, Check, Sparkles, Download } from "lucide-react";

type Props = {
  contractId: string;
  normalizedModules: Record<string, any> | null | undefined;
};

export function ContractMoveGenerator({ contractId, normalizedModules }: Props) {
  const [prompt, setPrompt] = useState(
    "I want a .move smart contract that issues a new coin named LENS with minting restricted to an admin."
  );
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const payload = useMemo(() => {
    if (!normalizedModules) return null;
    const entries = Object.entries(normalizedModules);
    const top = entries.slice(0, 6);
    const trimmed: Record<string, any> = {};
    for (const [name, mod] of top) {
      const funcs = Object.fromEntries(Object.entries(mod?.exposed_functions ?? {}).slice(0, 15));
      const structs = Object.fromEntries(Object.entries(mod?.structs ?? {}).slice(0, 15));
      trimmed[name] = { exposed_functions: funcs, structs };
    }
    const s = JSON.stringify(trimmed);
    return s.length > 100_000 ? s.slice(0, 100_000) + "\n/* truncated */" : s;
  }, [normalizedModules]);

  async function generate() {
    setLoading(true);
    setErr(null);
    setCode("");
    try {
      const res = await fetch("/api/gemini/generate-move", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt,
          normalizedModulesJson: payload,
        }),
      });
      const ct = res.headers.get("content-type") || "";
      const text = ct.includes("application/json") ? await res.json() : { error: await res.text() };
      if (!res.ok) throw new Error(text?.error || "Generation failed");
      setCode(text.move || "");
    } catch (e: any) {
      setErr(e?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function download() {
    if (!code) return;
    const filename = `generated_${contractId.replace(/[:.]/g, "_")}.move`;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex items-start justify-between gap-3">
        <div>
          <CardTitle className="text-lg">Generator</CardTitle>
          <CardDescription>
            Describe what you want in natural language. Gemini will produce a Move module.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button onClick={generate} disabled={loading || !prompt} className="gap-2">
            <Sparkles className="h-4 w-4" />
            {loading ? "Generating…" : "Generate Move"}
          </Button>
          <Button variant="outline" onClick={copy} disabled={!code} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copy
          </Button>
          <Button variant="outline" onClick={download} disabled={!code} className="gap-2">
            <Download className="h-4 w-4" />
            .move
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Your prompt</label>
          {/* If you don’t have shadcn Textarea, replace with a native <textarea> and classes */}
          <Textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your contract…"
            className="bg-secondary border-border"
          />
        </div>

        {err && <p className="text-sm text-destructive">{err}</p>}

        <div className="space-y-1">
          <label className="text-sm font-medium">Generated Move source</label>
          <ScrollArea className="h-[520px] rounded-md border border-border">
            <pre className="p-4 text-sm whitespace-pre-wrap leading-relaxed">{code}</pre>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
