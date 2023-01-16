import { configureChains, createClient, Chain } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";

export const arbitrumNova: Chain = {
  id: 42170,
  name: "Arbitrum Nova",
  network: "Arbitrum Nova",
  nativeCurrency: {
    decimals: 18,
    symbol: "ETH",
    name: "Arbitrum Nova ETH",
  },
  rpcUrls: {
    default: { http: ["https://nova.arbitrum.io/rpc"] },
  },
  blockExplorers: {
    etherscan: { name: "Arbitrum Nova", url: "https://nova.arbiscan.io" },
    default: { name: "Arbitrum Nova", url: "https://nova.arbiscan.io" },
  },
  contracts: {
    multicall3: {
      address: "0x5e1eE626420A354BbC9a95FeA1BAd4492e3bcB86",
      blockCreated: 24,
    },
  },
};

const { chains, provider, webSocketProvider } = configureChains(
  [arbitrumNova],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }),
    publicProvider(),
  ]
);

export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({ chains, options: { qrcode: true } }),
    new CoinbaseWalletConnector({
      chains,
      options: { appName: "MoonPlace" },
    }),
  ],
  provider,
  webSocketProvider,
});

export { chains };
