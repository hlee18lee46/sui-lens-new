"use client";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";

export default function LoginPage() {
  const account = useCurrentAccount();
  const router = useRouter();

  useEffect(() => {
    if (account) router.replace("/explorer"); // redirect once connected
  }, [account, router]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ✅ Keep the global Header at the top */}
      <Header />

      {/* Main login area */}
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-3xl font-bold">Connect your Sui Wallet</h1>
          <p className="text-muted-foreground">
            Use your wallet to sign in and start exploring contracts.
          </p>
          <div className="flex justify-center pt-4">
            <ConnectButton />
          </div>
        </div>
      </main>
    </div>
  );
}
