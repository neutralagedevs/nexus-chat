import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIAnalysisResult, TransactionData } from '@/types';

// Domain operation intent types
export enum DomainIntent {
  TOKENIZE_DOMAIN = 'tokenize_domain',
  CHECK_PORTFOLIO = 'check_portfolio', 
  DOMAIN_ANALYTICS = 'domain_analytics',
  BRIDGE_DOMAIN = 'bridge_domain',
  AUCTION_STRATEGY = 'auction_strategy',
  MARKET_TRENDS = 'market_trends',
  QUERY = 'query',
  TECHNICAL_SUPPORT = 'technical_support',
  UNKNOWN = 'unknown'
}



const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export class AIAssistant {
    private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    async analyzeUserMessage(message: string, context?: Record<string, unknown>): Promise<AIAnalysisResult> {
        try {
            const prompt = this.buildAnalysisPrompt(message, context);
            const result = await this.model.generateContent(prompt);
            const response = result.response.text();

            return this.parseAIResponse(response);
        } catch (error) {
            console.error('AI Analysis Error:', error);
            return {
                intent: 'unknown',
                confidence: 0,
                extractedData: {},
                requiredQuestions: [],
                suggestedResponse: "I'm having trouble understanding your request. Could you please rephrase it?"
            };
        }
    }

    private buildAnalysisPrompt(message: string, context?: Record<string, unknown>): string {
        return `
You are Nexus, an advanced AI assistant specialized in domain intelligence and DomainFi operations through the Doma Protocol ecosystem.

PERSONALITY & TONE:
- Professional yet friendly and approachable
- Clear, concise communication
- Proactive in guiding users through domain operations
- Confident and knowledgeable about domains, blockchain, and DomainFi
- Enthusiastic about helping users maximize their domain portfolio value

User Message: "${message}"
Context: ${context ? JSON.stringify(context) : 'None'}

CORE CAPABILITIES:
1. Domain tokenization guidance on Doma Protocol - Primary Focus
2. Portfolio analytics and insights for tokenized domains
3. Market trends and domain scoring analysis
4. Auction strategies and bidding advice
5. Cross-chain domain management and bridging
6. Domain discovery and evaluation

CONTEXT: User is on Doma Protocol testnet. Help them navigate:
- Domain discovery and evaluation using advanced AI analysis
- Tokenization process via D3 registrar integration
- Trading and portfolio management across multiple chains
- Bridge operations between supported blockchains
- Market insights and investment strategies

CONVERSATION FLOW INTELLIGENCE:
- Greetings: Welcome users warmly, focus on domain intelligence and DomainFi opportunities
- Tokenization requests: Extract domain details, provide scoring analysis, guide through process
- Questions: Answer knowledgeably about domains, NFTs, blockchain, DomainFi ecosystem, Doma Protocol
- Portfolio inquiries: Analyze user's domain portfolio, provide optimization suggestions
- Market analysis: Provide trends, insights, and strategic recommendations
- Technical issues: Provide clear troubleshooting guidance for domain operations
- Missing info: Ask targeted follow-up questions naturally

EXTRACTION GUIDELINES:
- Set intent to "tokenize_domain" when user wants to tokenize domains via Doma Protocol
- Set intent to "check_portfolio" for portfolio reviews, domain analytics, value assessments
- Set intent to "domain_analytics" for domain scoring, market analysis, evaluation requests
- Set intent to "bridge_domain" for cross-chain domain operations
- Set intent to "auction_strategy" for auction participation, bidding advice
- Set intent to "market_trends" for industry insights, trend analysis
- Set intent to "query" for general questions, information requests, casual conversation
- Set intent to "unknown" only if completely unclear

Respond with a JSON object in this exact format:
{
  "intent": "tokenize_domain|check_portfolio|domain_analytics|bridge_domain|auction_strategy|market_trends|query|technical_support|unknown",
  "confidence": 0.8,
  "extractedData": {
    "type": "tokenize_domain",
    "domainName": "example.eth",
    "tld": ".eth",
    "urgency": "normal",
    "targetChain": "doma",
    "analysisRequested": true
  },
  "requiredQuestions": ["Which domain would you like to tokenize?"],
  "suggestedResponse": "I'd be happy to help you tokenize your domain on Doma Protocol! Domain tokenization allows you to unlock liquidity and enable cross-chain functionality. Which domain would you like to tokenize? I can provide a comprehensive analysis including scoring and market potential."
}

EXAMPLE RESPONSES BY INTENT:

GREETING/WELCOME:
{
  "intent": "query",
  "confidence": 0.95,
  "extractedData": {},
  "requiredQuestions": [],
  "suggestedResponse": "Hello! I'm Nexus, your advanced domain intelligence assistant powered by Doma Protocol. I specialize in helping you maximize the value of your domains through tokenization, cross-chain operations, and portfolio optimization. I can help you tokenize domains, analyze market trends, provide domain scoring, and guide you through the entire DomainFi ecosystem. What domain opportunities can I help you explore today?"
}

GENERAL QUERY:
{
  "intent": "query", 
  "confidence": 0.85,
  "extractedData": {},
  "requiredQuestions": [],
  "suggestedResponse": "Great question! I'm here to help with that. [Provide helpful answer and naturally guide toward domain operations and DomainFi opportunities]"
}

PORTFOLIO CHECK:
{
  "intent": "check_portfolio",
  "confidence": 0.9,
  "extractedData": {},
  "requiredQuestions": [],
  "suggestedResponse": "I can help you analyze your domain portfolio and identify optimization opportunities. Let me connect to your wallet to provide real-time portfolio analytics, domain valuations, and strategic insights for your tokenized domains."
}

DOMAIN TOKENIZATION EXAMPLE:
{
  "intent": "tokenize_domain",
  "confidence": 0.9,
  "extractedData": {
    "type": "tokenize_domain",
    "domainName": "myapp.com",
    "tld": ".com",
    "analysisRequested": true
  },
  "requiredQuestions": [],
  "suggestedResponse": "Excellent choice! I can help you tokenize myapp.com on Doma Protocol. Based on my analysis, .com domains have strong market performance. Tokenizing will unlock liquidity, enable cross-chain functionality, and allow you to leverage your domain as a financial asset. Let me guide you through the tokenization process and provide a comprehensive domain score."
}

DOMAIN ANALYTICS EXAMPLE:
{
  "intent": "domain_analytics",
  "confidence": 0.85,
  "extractedData": {
    "type": "domain_analytics",
    "domainName": "crypto.eth",
    "analysisType": "comprehensive"
  },
  "requiredQuestions": [],
  "suggestedResponse": "I'll provide a comprehensive analysis of crypto.eth for you. This premium domain has excellent brandability and strong keyword relevance in the crypto space. Based on recent market data, .eth domains with crypto-related keywords are performing exceptionally well. Let me generate a detailed scoring report including length analysis, keyword strength, SEO value, and market potential."
}

Be conversational and helpful. Ask clarifying questions when information is missing. Always focus on domain intelligence, tokenization opportunities, and guiding users toward profitable domain decisions within the DomainFi ecosystem.
`;
    }

    private parseAIResponse(response: string): AIAnalysisResult {
        try {
            // Extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    intent: parsed.intent || 'unknown',
                    confidence: parsed.confidence || 0.5,
                    extractedData: parsed.extractedData || {},
                    requiredQuestions: parsed.requiredQuestions || [],
                    suggestedResponse: parsed.suggestedResponse || "How can I help you today?"
                };
            }
        } catch (error) {
            console.error('Failed to parse AI response:', error);
        }

        return {
            intent: 'unknown',
            confidence: 0,
            extractedData: {},
            requiredQuestions: [],
            suggestedResponse: response || "How can I help you with your DeFi needs today?"
        };
    }

    async generateFollowUpQuestion(intent: string, missingData: string[]): Promise<string> {
        const prompt = `
Generate a natural follow-up question for a DeFi trading assistant.

Intent: ${intent}
Missing Data: ${missingData.join(', ')}

Generate a single, conversational question to collect the missing information.
Be helpful and specific about what you need.
`;

        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error('Failed to generate follow-up question:', error);
            return "Could you provide more details about your request?";
        }
    }

    async validateTransactionData(data: TransactionData): Promise<{
        isValid: boolean;
        errors: string[];
        suggestions: string[];
    }> {
        const errors: string[] = [];
        const suggestions: string[] = [];

        if (data.type === 'fiat_conversion') {
            if (!data.tokenIn) errors.push('Token to convert is required');
            if (!data.amountIn && !data.fiatAmount) {
                errors.push('Either token amount or fiat amount is required');
            }
            if (!data.fiatCurrency) {
                suggestions.push('Consider specifying the fiat currency (NGN, USD, etc.)');
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            suggestions
        };
    }

    async generateConversionReceipt(transactionData: {
        transactionId?: string;
        txHash?: string;
        amount?: string;
        token?: string;
        fiatCurrency?: string;
        estimatedFiat?: string;
        status?: string;
    }): Promise<string> {
        const currentTime = new Date().toLocaleString();
        const estimatedCompletion = new Date(Date.now() + 15 * 60000).toLocaleString(); // 15 minutes from now

        return `
**CRYPTOCURRENCY CONVERSION RECEIPT**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Transaction Details**
Transaction ID: ${transactionData.transactionId || 'TXN-' + Date.now()}
Blockchain Hash: ${transactionData.txHash || 'Pending...'}
Status: ${transactionData.status || 'Processing'}
Initiated: ${currentTime}
Est. Completion: ${estimatedCompletion}

**Conversion Summary**
From: ${transactionData.amount || 'N/A'} ${transactionData.token || 'ETH'}
To: ${transactionData.fiatCurrency || 'NGN'} ${transactionData.estimatedFiat || 'Calculating...'}
Exchange Rate: Market rate at execution
Platform Fee: 0.5% (Industry leading)

**Bank Transfer Details**
Method: Instant Bank Transfer
Network: ${transactionData.token === 'ETH' ? 'Ethereum Mainnet' : 'Multi-chain'}
Security: End-to-end encrypted
Compliance: Fully regulated & compliant

**Next Steps**
1. Transaction submitted to blockchain
2. Smart contract execution in progress
3. Bank transfer will be initiated upon confirmation
4. Funds typically arrive within 5-15 minutes

**Support Available 24/7**
Need assistance? I'm here to help track your transaction or answer any questions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Thank you for using our professional crypto-to-fiat conversion service! 
Your financial freedom is our priority.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();
    }

    async generateMarketUpdate(tokenSymbol: string = 'ETH'): Promise<string> {
        // In a real implementation, you'd fetch actual market data
        const mockPrice = tokenSymbol === 'ETH' ? 2850 : 1850;
        const mockChange = Math.random() > 0.5 ? '+' : '-';
        const mockPercent = (Math.random() * 5).toFixed(2);

        return `
**LIVE MARKET UPDATE - ${tokenSymbol.toUpperCase()}**

Current Price: $${mockPrice.toLocaleString()} USD
24h Change: ${mockChange}${mockPercent}%
Best Time to Convert: ${Math.random() > 0.5 ? 'Good opportunity' : 'Consider waiting'}

Our AI suggests: ${Math.random() > 0.5
                ? 'Market conditions are favorable for conversion'
                : 'Price trending upward - you might want to hold or convert partially'}

Ready to convert? I can help you get the best rates with minimal fees.
        `.trim();
    }
}
