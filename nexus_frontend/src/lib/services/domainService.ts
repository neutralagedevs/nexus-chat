/**
 * Domain Service Layer
 * Handles all domain-related operations including tokenization, bridging, and portfolio management
 */

import { ethers } from 'ethers';
import { 
  DOMA_CONTRACTS, 
  type TokenizationVoucher, 
  type TransactionResult, 
  type TokenizedDomain, 
  type BridgeOperation,
  type DomainScore,
  type DomaContractAddresses,
  type DomaError
} from '../contracts/domaInterfaces';
import { getDomaConfig } from '../config/doma';

export class DomainService {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;
  private contracts: DomaContractAddresses;
  private config = getDomaConfig();

  constructor(provider: ethers.Provider, signer?: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
    this.contracts = this.config.contracts;
  }

  /**
   * Update the signer when wallet connects
   */
  setSigner(signer: ethers.Signer) {
    this.signer = signer;
  }

  /**
   * Tokenize a domain using Doma Protocol
   */
  async tokenizeDomain(domainName: string): Promise<TransactionResult> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      // Create tokenization voucher
      const voucher: TokenizationVoucher = {
        names: [{
          name: domainName.split('.')[0],
          tld: '.' + domainName.split('.').slice(1).join('.'),
          registrar: 'default', // This would come from actual registrar
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        }],
        nonce: BigInt(Date.now()),
        expiresAt: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
        ownerAddress: await this.signer.getAddress(),
      };

      // Create contract instance
      const contract = new ethers.Contract(
        this.contracts.proxyDomaRecord,
        DOMA_CONTRACTS.PROXY_DOMA_RECORD_ABI,
        this.signer
      );

      // Execute tokenization
      const tx = await contract.tokenizeDomains(voucher, '0x'); // Signature would be generated properly
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
        gasUsed: receipt.gasUsed,
        tokenIds: receipt.logs
          .filter((log: any) => log.topics[0] === ethers.id('DomainsTokenized(address,string[],uint256[])'))
          .map((log: any) => {
            const decoded = contract.interface.parseLog(log);
            return decoded?.args.tokenIds || [];
          })
          .flat()
      };
    } catch (error) {
      console.error('Tokenization failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tokenization failed'
      };
    }
  }

  /**
   * Bridge a domain to another chain
   */
  async bridgeDomain(tokenId: bigint, targetChain: string): Promise<TransactionResult> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const contract = new ethers.Contract(
        this.contracts.proxyDomaRecord,
        DOMA_CONTRACTS.PROXY_DOMA_RECORD_ABI,
        this.signer
      );

      const targetAddress = await this.signer.getAddress();
      const bridgeFee = ethers.parseEther('0.001'); // Bridge fee

      const tx = await contract.bridgeDomain(tokenId, targetChain, targetAddress, {
        value: bridgeFee
      });
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
        gasUsed: receipt.gasUsed
      };
    } catch (error) {
      console.error('Bridge operation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bridge operation failed'
      };
    }
  }

  /**
   * Claim a domain that was bridged to this chain
   */
  async claimDomain(tokenId: bigint): Promise<TransactionResult> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const contract = new ethers.Contract(
        this.contracts.proxyDomaRecord,
        DOMA_CONTRACTS.PROXY_DOMA_RECORD_ABI,
        this.signer
      );

      const tx = await contract.claimDomain(tokenId);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
        gasUsed: receipt.gasUsed
      };
    } catch (error) {
      console.error('Claim operation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Claim operation failed'
      };
    }
  }

  /**
   * Get user's domain portfolio
   */
  async getDomainPortfolio(address: string): Promise<TokenizedDomain[]> {
    try {
      const contract = new ethers.Contract(
        this.contracts.proxyDomaRecord,
        DOMA_CONTRACTS.PROXY_DOMA_RECORD_ABI,
        this.provider
      );

      const tokenIds = await contract.getOwnedDomains(address);
      const domains: TokenizedDomain[] = [];

      for (const tokenId of tokenIds) {
        try {
          const [domainName, owner, registrar, expirationDate] = await contract.getDomainInfo(tokenId);
          
          domains.push({
            id: tokenId.toString(),
            name: domainName,
            tokenId: BigInt(tokenId),
            owner,
            registrar,
            expirationDate,
            chain: 'doma',
          });
        } catch (error) {
          console.warn(`Failed to get info for token ${tokenId}:`, error);
        }
      }

      return domains;
    } catch (error) {
      console.error('Failed to get domain portfolio:', error);
      throw new DomaError('PORTFOLIO_FETCH_FAILED', 'Failed to fetch domain portfolio');
    }
  }

  /**
   * Check if a domain is already tokenized
   */
  async isDomainTokenized(domainName: string): Promise<boolean> {
    try {
      // This would involve checking the domain registry
      // Implementation depends on how Doma Protocol tracks domain registration
      return false; // Placeholder
    } catch (error) {
      console.error('Failed to check domain tokenization status:', error);
      return false;
    }
  }

  /**
   * Get domain metadata (score, value, etc.)
   */
  async getDomainMetadata(tokenId: bigint): Promise<{
    score?: DomainScore;
    value?: number;
    metadata?: any;
  }> {
    try {
      const ownershipContract = new ethers.Contract(
        this.contracts.ownershipToken,
        DOMA_CONTRACTS.OWNERSHIP_TOKEN_ABI,
        this.provider
      );

      const tokenURI = await ownershipContract.tokenURI(tokenId);
      
      // Fetch metadata from URI
      if (tokenURI) {
        const response = await fetch(tokenURI);
        const metadata = await response.json();
        
        return {
          metadata,
          // Additional analysis could be performed here
        };
      }

      return {};
    } catch (error) {
      console.error('Failed to get domain metadata:', error);
      return {};
    }
  }

  /**
   * Transfer a domain to another address
   */
  async transferDomain(tokenId: bigint, toAddress: string): Promise<TransactionResult> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const ownershipContract = new ethers.Contract(
        this.contracts.ownershipToken,
        DOMA_CONTRACTS.OWNERSHIP_TOKEN_ABI,
        this.signer
      );

      const fromAddress = await this.signer.getAddress();
      const tx = await ownershipContract.transferFrom(fromAddress, toAddress, tokenId);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
        gasUsed: receipt.gasUsed
      };
    } catch (error) {
      console.error('Transfer failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transfer failed'
      };
    }
  }

  /**
   * Get bridge operations for a user
   */
  async getBridgeOperations(address: string): Promise<BridgeOperation[]> {
    try {
      // This would query bridge contract events or API
      // Placeholder implementation
      return [];
    } catch (error) {
      console.error('Failed to get bridge operations:', error);
      return [];
    }
  }

  /**
   * Estimate gas for domain operations
   */
  async estimateGas(operation: 'tokenize' | 'bridge' | 'claim' | 'transfer', params: any): Promise<bigint> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const contract = new ethers.Contract(
        this.contracts.proxyDomaRecord,
        DOMA_CONTRACTS.PROXY_DOMA_RECORD_ABI,
        this.signer
      );

      switch (operation) {
        case 'tokenize':
          return await contract.tokenizeDomains.estimateGas(params.voucher, params.signature || '0x');
        case 'bridge':
          return await contract.bridgeDomain.estimateGas(params.tokenId, params.targetChain, params.targetAddress);
        case 'claim':
          return await contract.claimDomain.estimateGas(params.tokenId);
        default:
          throw new Error('Unsupported operation');
      }
    } catch (error) {
      console.error('Gas estimation failed:', error);
      return BigInt(0);
    }
  }

  /**
   * Listen to contract events
   */
  onEvent(eventName: keyof typeof DOMA_CONTRACTS.PROXY_DOMA_RECORD_ABI, callback: (event: any) => void) {
    const contract = new ethers.Contract(
      this.contracts.proxyDomaRecord,
      DOMA_CONTRACTS.PROXY_DOMA_RECORD_ABI,
      this.provider
    );

    contract.on(eventName, callback);

    // Return cleanup function
    return () => {
      contract.off(eventName, callback);
    };
  }

  /**
   * Get current gas price for the network
   */
  async getCurrentGasPrice(): Promise<bigint> {
    try {
      const feeData = await this.provider.getFeeData();
      return feeData.gasPrice || BigInt(0);
    } catch (error) {
      console.error('Failed to get gas price:', error);
      return BigInt(0);
    }
  }
}

// Utility function to create DomainService instance
export function createDomainService(provider: ethers.Provider, signer?: ethers.Signer): DomainService {
  return new DomainService(provider, signer);
}

// Export error class
export class DomainServiceError extends Error {
  code: string;
  
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'DomainServiceError';
  }
}