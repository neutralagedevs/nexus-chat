'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TokenizedDomain {
  id: string;
  name: string;
  tokenId: bigint;
  expirationDate: string;
  registrar: string;
  chain: string;
  value?: number;
  score?: number;
}

interface DomainTransaction {
  id: string;
  type: 'tokenize' | 'bridge' | 'claim' | 'transfer';
  domain: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  txHash?: string;
}

interface DomainWalletConnection {
  address: string;
  isConnected: boolean;
  chainId?: number;
}

interface DomainWalletContextType {
  // Keep existing wallet functionality
  connection: DomainWalletConnection;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToDoma: () => Promise<boolean>;
  isConnecting: boolean;
  error: string | null;
  
  // Add domain-specific state
  tokenizedDomains: TokenizedDomain[];
  portfolioValue: number;
  pendingTransactions: DomainTransaction[];
  
  // Domain operations
  addTokenizedDomain: (domain: TokenizedDomain) => void;
  removeTokenizedDomain: (domainId: string) => void;
  updateDomainValue: (domainId: string, value: number) => void;
  addPendingTransaction: (transaction: DomainTransaction) => void;
  updateTransactionStatus: (txId: string, status: DomainTransaction['status'], txHash?: string) => void;
}

const DomainWalletContext = createContext<DomainWalletContextType | undefined>(undefined);

interface DomainWalletProviderProps {
  children: ReactNode;
}

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (accounts: string[]) => void) => void;
  removeListener: (event: string, callback: (accounts: string[]) => void) => void;
  isMetaMask?: boolean;
}

export function DomainWalletProvider({ children }: DomainWalletProviderProps) {
  const [connection, setConnection] = useState<DomainWalletConnection>({
    address: '',
    isConnected: false,
    chainId: 1,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Domain-specific state
  const [tokenizedDomains, setTokenizedDomains] = useState<TokenizedDomain[]>([]);
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [pendingTransactions, setPendingTransactions] = useState<DomainTransaction[]>([]);

  const connect = async () => {
    const ethereum = (window as Window & { ethereum?: EthereumProvider }).ethereum;

    if (typeof window === 'undefined' || !ethereum) {
      setError('MetaMask not detected. Please install MetaMask to connect.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length > 0) {
        // Get chain ID
        const chainId = await ethereum.request({
          method: 'eth_chainId',
        }) as string;

        setConnection({
          address: accounts[0],
          isConnected: true,
          chainId: parseInt(chainId, 16),
        });

        // Store connection in localStorage
        localStorage.setItem('domain_wallet_connected', 'true');
        localStorage.setItem('domain_wallet_address', accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setConnection({
      address: '',
      isConnected: false,
      chainId: 1,
    });
    setTokenizedDomains([]);
    setPortfolioValue(0);
    setPendingTransactions([]);
    localStorage.removeItem('domain_wallet_connected');
    localStorage.removeItem('domain_wallet_address');
  };

  const switchToDoma = async (): Promise<boolean> => {
    const ethereum = (window as Window & { ethereum?: EthereumProvider }).ethereum;

    if (!ethereum) {
      setError('MetaMask not detected');
      return false;
    }

    try {
      const domaChainId = parseInt(process.env.NEXT_PUBLIC_DOMA_CHAIN_ID || '97476');
      
      // Try to switch to Doma testnet
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${domaChainId.toString(16)}` }],
      });

      return true;
    } catch (switchError: unknown) {
      // If the network doesn't exist, add it
      const error = switchError as { code?: number };
      if (error.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${parseInt(process.env.NEXT_PUBLIC_DOMA_CHAIN_ID || '97476').toString(16)}`,
              chainName: 'Doma Testnet',
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: [process.env.NEXT_PUBLIC_DOMA_TESTNET_RPC || 'https://rpc-testnet.doma.xyz'],
              blockExplorerUrls: ['https://explorer-testnet.doma.xyz'],
            }],
          });

          return true;
        } catch (addError) {
          console.error('Failed to add Doma network:', addError);
          setError('Failed to add Doma network to MetaMask');
          return false;
        }
      } else {
        console.error('Failed to switch to Doma network:', switchError);
        setError('Failed to switch to Doma network');
        return false;
      }
    }
  };

  // Domain operations
  const addTokenizedDomain = (domain: TokenizedDomain) => {
    setTokenizedDomains(prev => [...prev, domain]);
    setPortfolioValue(prev => prev + (domain.value || 0));
  };

  const removeTokenizedDomain = (domainId: string) => {
    setTokenizedDomains(prev => {
      const domain = prev.find(d => d.id === domainId);
      if (domain && domain.value) {
        setPortfolioValue(currentValue => currentValue - domain.value!);
      }
      return prev.filter(d => d.id !== domainId);
    });
  };

  const updateDomainValue = (domainId: string, value: number) => {
    setTokenizedDomains(prev => 
      prev.map(domain => {
        if (domain.id === domainId) {
          const oldValue = domain.value || 0;
          setPortfolioValue(currentValue => currentValue - oldValue + value);
          return { ...domain, value };
        }
        return domain;
      })
    );
  };

  const addPendingTransaction = (transaction: DomainTransaction) => {
    setPendingTransactions(prev => [...prev, transaction]);
  };

  const updateTransactionStatus = (txId: string, status: DomainTransaction['status'], txHash?: string) => {
    setPendingTransactions(prev =>
      prev.map(tx => 
        tx.id === txId ? { ...tx, status, txHash } : tx
      )
    );
  };

  // Auto-connect on mount if previously connected
  React.useEffect(() => {
    const wasConnected = localStorage.getItem('domain_wallet_connected');
    const savedAddress = localStorage.getItem('domain_wallet_address');
    const ethereum = (window as Window & { ethereum?: EthereumProvider }).ethereum;

    if (wasConnected === 'true' && savedAddress && ethereum) {
      connect();
    }
  }, []);

  const value: DomainWalletContextType = {
    connection,
    connect,
    disconnect,
    switchToDoma,
    isConnecting,
    error,
    tokenizedDomains,
    portfolioValue,
    pendingTransactions,
    addTokenizedDomain,
    removeTokenizedDomain,
    updateDomainValue,
    addPendingTransaction,
    updateTransactionStatus,
  };

  return (
    <DomainWalletContext.Provider value={value}>
      {children}
    </DomainWalletContext.Provider>
  );
}

export function useDomainWallet() {
  const context = useContext(DomainWalletContext);
  if (context === undefined) {
    throw new Error('useDomainWallet must be used within a DomainWalletProvider');
  }
  return context;
}

// Export types for use in other components
export type { TokenizedDomain, DomainTransaction, DomainWalletContextType };