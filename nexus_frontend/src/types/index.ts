// Types for the DEX Chat Interface
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: {
        transactionData?: TransactionData;
        suggestedActions?: SuggestedAction[];
        confirmationRequired?: boolean;
        autoTriggerTransaction?: boolean;
        conversationCount?: number;
    };
}

// Chat session types for history
export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: Date;
    lastUpdated: Date;
    walletAddress?: string;
}

export interface ChatHistoryState {
    currentSessionId: string | null;
    sessions: ChatSession[];
}

export interface TransactionData {
    type: 'fiat_conversion' | 'tokenize_domain' | 'bridge_domain' | 'domain_analytics';
    // Legacy fiat conversion fields
    tokenIn?: string;
    amountIn?: string;
    fiatAmount?: string;
    fiatCurrency?: string;
    recipient?: string;
    // Domain operation fields
    domainName?: string;
    tld?: string;
    targetChain?: string;
    analysisRequested?: boolean;
    urgency?: 'low' | 'normal' | 'high';
    // Common fields
    transactionId?: string;
    txHash?: string; // Transaction hash for completed transactions
}

export interface SuggestedAction {
    id: string;
    type: 'confirm_fiat' | 'connect_wallet' | 'approve_token' | 'check_portfolio' | 'market_rates' | 'learn_more' | 'cancel' |
          'tokenize_domain' | 'analyze_domain' | 'bridge_domain' | 'view_portfolio' | 'get_domain_score' | 'explore_market';
    label: string;
    data?: Record<string, unknown>;
    priority?: boolean;
}

export interface Token {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    balance?: string;
    logoUrl?: string;
}

export interface UserPreferences {
    defaultSlippage: number;
    preferredTokens: string[];
    fiatCurrency: string;
    autoConfirmTransactions: boolean;
}

export interface AIAnalysisResult {
    intent: 'fiat_conversion' | 'tokenize_domain' | 'check_portfolio' | 'domain_analytics' | 'bridge_domain' | 
            'auction_strategy' | 'market_trends' | 'query' | 'technical_support' | 'unknown';
    confidence: number;
    extractedData: Partial<TransactionData>;
    requiredQuestions: string[];
    suggestedResponse: string;
}

// Paystack Types
export interface BankAccount {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    transferCode?: string; // Paystack transfer code
}

export interface PaystackTransfer {
    amount: number;
    recipientCode: string;
    reason: string;
    reference: string;
}

// Ethereum Types
export interface EthereumWalletConnection {
    address: string;
    isConnected: boolean;
    chainId?: number;
    balance?: string;
}

export interface SimpleEthereumWalletConnection {
    address: string;
    isConnected: boolean;
    chainId?: number;
    balance?: string;
}

export interface FiatTransactionParams {
    token: string;
    amount: string;
    fiatAmount: string;
    transactionId: string;
    bankAccount?: BankAccount;
}
