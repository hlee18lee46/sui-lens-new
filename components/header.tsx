"use client";

import { Search, Star, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

function shortAddr(addr?: string) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";
}

export function Header() {
  const account = useCurrentAccount();
  const connected = !!account?.address;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4">
        {/* Brand + nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-mono text-lg font-bold text-primary-foreground">OS</span>
            </div>
            <span className="text-lg font-semibold">OpenSui Lens</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/explorer" className="text-muted-foreground hover:text-foreground transition-colors">
              Explorer
            </Link>
            <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
              Favorites
            </Link>
          </nav>
        </div>

        {/* Search */}
        <div className="flex flex-1 items-center gap-4 md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contracts, modules, functions..."
              className="w-full pl-9 bg-secondary border-border"
            />
          </div>
        </div>

        {/* Wallet status + actions */}
        <div className="flex items-center gap-3">

          {/* Status + address */}
          <span
            className={`hidden sm:inline text-sm ${
              connected ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            {connected ? "Connected" : "Not connected"}
          </span>
          {connected && (
            <span className="hidden sm:inline font-mono text-xs opacity-80">
              {shortAddr(account?.address)}
            </span>
          )}

          {/* Connect / Disconnect dropdown */}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
