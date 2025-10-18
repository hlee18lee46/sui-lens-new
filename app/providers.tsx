"use client";

import { PropsWithChildren, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider, createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { AuthProvider } from "@/lib/auth"; // <-- ensure this path is correct

const { networkConfig } = createNetworkConfig({
  devnet:  { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

export function Providers({ children }: PropsWithChildren) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const defaultNetwork =
    (process.env.NEXT_PUBLIC_SUI_NETWORK as "devnet" | "testnet" | "mainnet") ?? "testnet";

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork={defaultNetwork}>
        <WalletProvider autoConnect>
          {/* ✅ DO NOT comment this out */}
          <AuthProvider>
            {children}
          </AuthProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
