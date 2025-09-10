/**
 * Doma Protocol Contract Interfaces and Types
 * Contains all necessary interfaces and types for interacting with Doma Protocol
 */

// Basic types
export interface NameInfo {
  name: string;
  tld: string;
  registrar: string;
  expirationDate: string;
}

export interface TokenizationVoucher {
  names: NameInfo[];
  nonce: bigint;
  expiresAt: bigint;
  ownerAddress: string;
  signature?: string;
}

export interface BridgeRequest {
  tokenId: bigint;
  targetChain: string;
  targetAddress: string;
  fee: bigint;
}

export interface DomainOwnership {
  tokenId: bigint;
  owner: string;
  domain: string;
  registrar: string;
  expirationDate: string;
  isActive: boolean;
}

// Contract ABIs (these would be populated from actual Doma Protocol documentation)
export const DOMA_CONTRACTS = {
  // Proxy Doma Record Contract ABI
  PROXY_DOMA_RECORD_ABI: [
    // Write functions
    {
      "inputs": [
        {"name": "voucher", "type": "tuple", "components": [
          {"name": "names", "type": "tuple[]", "components": [
            {"name": "name", "type": "string"},
            {"name": "tld", "type": "string"},
            {"name": "registrar", "type": "string"},
            {"name": "expirationDate", "type": "string"}
          ]},
          {"name": "nonce", "type": "uint256"},
          {"name": "expiresAt", "type": "uint256"},
          {"name": "ownerAddress", "type": "address"}
        ]},
        {"name": "signature", "type": "bytes"}
      ],
      "name": "tokenizeDomains",
      "outputs": [{"name": "", "type": "uint256[]"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "tokenId", "type": "uint256"},
        {"name": "targetChain", "type": "string"},
        {"name": "targetAddress", "type": "address"}
      ],
      "name": "bridgeDomain",
      "outputs": [{"name": "", "type": "bool"}],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "tokenId", "type": "uint256"}
      ],
      "name": "claimDomain",
      "outputs": [{"name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    // Read functions
    {
      "inputs": [
        {"name": "owner", "type": "address"}
      ],
      "name": "getOwnedDomains",
      "outputs": [{"name": "", "type": "uint256[]"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "tokenId", "type": "uint256"}
      ],
      "name": "getDomainInfo",
      "outputs": [
        {"name": "domain", "type": "string"},
        {"name": "owner", "type": "address"},
        {"name": "registrar", "type": "string"},
        {"name": "expirationDate", "type": "string"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "tokenId", "type": "uint256"}
      ],
      "name": "isTokenized",
      "outputs": [{"name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    // Events
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "name": "owner", "type": "address"},
        {"indexed": false, "name": "domains", "type": "string[]"},
        {"indexed": false, "name": "tokenIds", "type": "uint256[]"}
      ],
      "name": "DomainsTokenized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "name": "tokenId", "type": "uint256"},
        {"indexed": false, "name": "targetChain", "type": "string"},
        {"indexed": true, "name": "owner", "type": "address"}
      ],
      "name": "DomainBridged",
      "type": "event"
    }
  ] as const,

  // Ownership Token Contract ABI (ERC721-based)
  OWNERSHIP_TOKEN_ABI: [
    // Standard ERC721 functions
    {
      "inputs": [
        {"name": "owner", "type": "address"}
      ],
      "name": "balanceOf",
      "outputs": [{"name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "tokenId", "type": "uint256"}
      ],
      "name": "ownerOf",
      "outputs": [{"name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "from", "type": "address"},
        {"name": "to", "type": "address"},
        {"name": "tokenId", "type": "uint256"}
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "to", "type": "address"},
        {"name": "approved", "type": "bool"}
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    // Domain-specific functions
    {
      "inputs": [
        {"name": "tokenId", "type": "uint256"}
      ],
      "name": "tokenURI",
      "outputs": [{"name": "", "type": "string"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "owner", "type": "address"}
      ],
      "name": "tokensOfOwner",
      "outputs": [{"name": "", "type": "uint256[]"}],
      "stateMutability": "view",
      "type": "function"
    }
  ] as const,

  // Bridge Contract ABI
  BRIDGE_CONTRACT_ABI: [
    {
      "inputs": [
        {"name": "tokenId", "type": "uint256"},
        {"name": "targetChain", "type": "string"},
        {"name": "targetAddress", "type": "address"}
      ],
      "name": "initiateBridge",
      "outputs": [{"name": "bridgeId", "type": "bytes32"}],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "bridgeId", "type": "bytes32"}
      ],
      "name": "getBridgeStatus",
      "outputs": [
        {"name": "status", "type": "uint8"},
        {"name": "targetChain", "type": "string"},
        {"name": "completedAt", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ] as const,
} as const;

// Transaction result types
export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  gasUsed?: bigint;
  tokenIds?: bigint[];
}

// Domain analytics types
export interface DomainScore {
  overall: number;
  length: number;
  keywords: number;
  tld: number;
  brandability: number;
  seoValue: number;
  lastUpdated: string;
}

export interface MarketTrend {
  period: string;
  volume: number;
  averagePrice: number;
  topSales: Array<{
    domain: string;
    price: number;
    timestamp: string;
  }>;
}

// Portfolio types
export interface TokenizedDomain {
  id: string;
  name: string;
  tokenId: bigint;
  owner: string;
  registrar: string;
  expirationDate: string;
  chain: string;
  value?: number;
  score?: DomainScore;
  metadata?: {
    imageUrl?: string;
    description?: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

// Bridge operation types
export interface BridgeOperation {
  id: string;
  tokenId: bigint;
  sourceChain: string;
  targetChain: string;
  status: 'pending' | 'confirmed' | 'failed';
  initiatedAt: string;
  completedAt?: string;
  txHash?: string;
  fee: bigint;
}

// Contract addresses type
export interface DomaContractAddresses {
  domaRecord: string;
  proxyDomaRecord: string;
  ownershipToken: string;
  bridgeContract: string;
}

// Error types
export interface DomaError {
  code: string;
  message: string;
  details?: any;
}

// Event types for listening to contract events
export interface ContractEventMap {
  DomainsTokenized: {
    owner: string;
    domains: string[];
    tokenIds: bigint[];
  };
  DomainBridged: {
    tokenId: bigint;
    targetChain: string;
    owner: string;
  };
  Transfer: {
    from: string;
    to: string;
    tokenId: bigint;
  };
}

// Chain configuration
export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorer: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  doma: {
    chainId: 97476,
    name: 'Doma Testnet',
    rpcUrl: 'https://rpc-testnet.doma.xyz',
    explorer: 'https://explorer-testnet.doma.xyz',
    currency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    currency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon.llamarpc.com',
    explorer: 'https://polygonscan.com',
    currency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
};