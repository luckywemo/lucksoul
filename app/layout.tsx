'use client'

import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import "./globals.css";
import { Providers } from "./providers";
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/web3-config'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Providers>{children}</Providers>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
