export enum Chains {
  gemini3h = 'gemini-3h',
  gemini3g = 'gemini-3g',
  devnet = 'devnet',
  localhost = 'localhost',
}

export interface Chain {
  title: string
  urls: {
    rpc: string
    page: Chains
    squids: {
      old: string
      general?: string
      account?: string
      rewards?: string
    }
  }
  isDomain: boolean
}

export const chains: Chain[] = [
  {
    title: 'Localhost',
    urls: {
      rpc: 'ws://127.0.0.1:9944/ws',
      page: Chains.localhost,
      squids: {
        old: 'http://localhost:4349/graphql',
        general: 'http://localhost:4350/graphql',
        rewards: 'http://localhost:4351/graphql',
        account: 'http://localhost:4352/graphql',
      },
    },
    isDomain: false,
  },
  {
    title: 'Gemini 3h',
    urls: {
      rpc: 'wss://rpc-0.gemini-3h.subspace.network/ws',
      page: Chains.gemini3h,
      squids: {
        old: 'https://squid.gemini-3h.subspace.network/graphql',
        general: 'https://squid.green.gemini-3h.subspace.network/graphql',
        rewards: 'https://rewards.squid.green.gemini-3h.subspace.network/graphql',
        account: 'https://account.squid.green.gemini-3h.subspace.network/graphql',
      },
    },
    isDomain: false,
  },
  {
    title: 'Gemini 3g',
    urls: {
      rpc: 'wss://rpc-0.gemini-3g.subspace.network/ws',
      page: Chains.gemini3g,
      squids: {
        old: 'https://squid.gemini-3g.subspace.network/graphql',
      },
    },
    isDomain: false,
  },
]

export const chainesSet = new Set(chains.map((chain) => chain.urls.page))

export const defaultChain = chains.find((chain) => chain.urls.page === Chains.gemini3h) || chains[0]
