/**
 * Doma Protocol Configuration
 * Contains all necessary configuration for interacting with Doma Protocol
 */

export const DOMA_CONFIG = {
  TESTNET: {
    chainId: 97476,
    rpcUrl: 'https://rpc-testnet.doma.xyz',
    explorer: 'https://explorer-testnet.doma.xyz',
    subgraph: 'https://api-testnet.doma.xyz/graphql',
    api: 'https://api-testnet.doma.xyz',
    d3Registrar: 'https://testnet.d3.app',
    dashboard: 'https://dashboard-testnet.doma.xyz',
    contracts: {
      // Doma Protocol contract addresses (to be filled from official docs)
      domaRecord: '', // Main domain record contract
      proxyDomaRecord: '', // Proxy contract for domain operations
      ownershipToken: '', // NFT contract for domain ownership
      bridgeContract: '', // Cross-chain bridge contract
    },
    network: {
      name: 'Doma Testnet',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
    },
  },
  MAINNET: {
    // Placeholder for mainnet configuration when available
    chainId: 0, // To be updated when mainnet is live
    rpcUrl: '',
    explorer: '',
    subgraph: '',
    api: '',
    d3Registrar: '',
    dashboard: '',
    contracts: {
      domaRecord: '',
      proxyDomaRecord: '',
      ownershipToken: '',
      bridgeContract: '',
    },
    network: {
      name: 'Doma Mainnet',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
    },
  },
} as const;

// Helper function to get current environment config
export function getDomaConfig() {
  // For now, always use testnet
  return DOMA_CONFIG.TESTNET;
}

// Domain operation types
export enum DomainOperationType {
  TOKENIZE = 'tokenize',
  BRIDGE = 'bridge',
  CLAIM = 'claim',
  TRANSFER = 'transfer',
  LIST = 'list',
  UNLIST = 'unlist',
}

// Supported chains for domain bridging
export enum SupportedChain {
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  BSC = 'bsc',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism',
  DOMA = 'doma',
}

// Domain TLD configurations
export const SUPPORTED_TLDS = [
  { name: '.eth', description: 'Ethereum Name Service domains' },
  { name: '.xyz', description: 'Generic top-level domain' },
  { name: '.com', description: 'Commercial domains' },
  { name: '.org', description: 'Organization domains' },
  { name: '.net', description: 'Network domains' },
  { name: '.app', description: 'Application domains' },
  { name: '.dev', description: 'Developer domains' },
] as const;

// Tokenization fee structure
export const TOKENIZATION_FEES = {
  baseFee: 0.001, // ETH
  percentageFee: 0.025, // 2.5%
  crossChainFee: 0.005, // ETH
} as const;

// GraphQL query limits
export const QUERY_LIMITS = {
  maxDomainsPerQuery: 100,
  maxTransactionsPerQuery: 50,
  defaultPageSize: 20,
} as const;

// Domain scoring weights
export const DOMAIN_SCORING_WEIGHTS = {
  length: 0.2,
  keywords: 0.25,
  tld: 0.15,
  brandability: 0.2,
  seoValue: 0.2,
} as const;

// Cache durations (in milliseconds)
export const CACHE_DURATIONS = {
  domainData: 5 * 60 * 1000, // 5 minutes
  marketData: 30 * 1000, // 30 seconds
  portfolioData: 60 * 1000, // 1 minute
  analyticsData: 2 * 60 * 1000, // 2 minutes
} as const;