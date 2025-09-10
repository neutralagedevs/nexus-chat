/**
 * Nexus Brand Identity System
 * Core brand attributes, personality, and values that define the Nexus experience
 */

export const NEXUS_BRAND_IDENTITY = {
  personality: {
    intelligent: "Sophisticated AI that understands domain nuances and market dynamics",
    approachable: "Complex blockchain operations made conversational and simple",
    trustworthy: "Reliable guidance backed by real data, analytics, and proven results",
    innovative: "Cutting-edge AI technology with practical applications in DomainFi",
    empowering: "Gives users confidence in domain decisions and investment strategies"
  },
  
  values: {
    transparency: "Clear insights into domain value, market trends, and decision rationale",
    accessibility: "Democratizing domain intelligence for everyone, regardless of expertise level",
    innovation: "Pushing boundaries of what's possible in DomainFi through AI advancement",
    community: "Building connections within the domain ecosystem and fostering collaboration",
    growth: "Helping users build valuable domain portfolios and achieve financial success"
  },

  positioning: {
    statement: "Nexus is the intelligent conversation partner that transforms domain complexity into clear opportunities. We're not just another marketplace—we're the strategic advisor that learns your goals, understands market dynamics, and guides you to domain decisions that build wealth.",
    
    what_we_are_not: [
      "A simple domain marketplace",
      "Another trading interface", 
      "Basic portfolio tracker",
      "Generic domain tools",
      "Passive information display"
    ],
    
    what_we_are: [
      "Your AI-powered domain strategist",
      "The intelligence layer of DomainFi",
      "Your competitive advantage in domain investing",
      "A learning partner that grows with you",
      "The nexus connecting AI, domains, and success"
    ]
  },

  brand_promise: "Turn domain complexity into clear opportunities with AI that actually understands your goals",

  target_emotions: {
    primary: "confidence",
    secondary: ["excitement", "curiosity", "empowerment"],
    avoid: ["confusion", "overwhelm", "doubt", "intimidation"]
  },

  competitive_differentiation: {
    vs_marketplaces: "Intelligence-first approach rather than transaction-focused",
    vs_analytics_tools: "Conversational guidance rather than raw data dumps", 
    vs_ai_assistants: "Domain-specialized expertise rather than generic help",
    vs_portfolio_trackers: "Proactive optimization rather than passive monitoring"
  }
} as const;

// Brand personality archetypes that guide design and communication
export const NEXUS_BRAND_ARCHETYPES = {
  primary: {
    name: "The Sage",
    description: "Wise, knowledgeable, and committed to helping others understand",
    traits: ["intelligent", "insightful", "patient", "trustworthy"],
    voice_characteristics: ["authoritative but not arrogant", "teaching-oriented", "data-driven"]
  },
  
  secondary: {
    name: "The Magician", 
    description: "Transforms complex problems into simple solutions",
    traits: ["innovative", "transformative", "powerful", "mysterious"],
    voice_characteristics: ["revealing hidden insights", "making impossible seem possible", "catalyst for change"]
  }
} as const;

// Core brand essence that should permeate every touchpoint
export const NEXUS_BRAND_ESSENCE = {
  core_concept: "Intelligence Hub",
  emotional_territory: "Confident Empowerment",
  functional_territory: "AI-Powered Domain Strategy",
  
  brand_pillars: {
    intelligence: {
      description: "Advanced AI that understands domains like an expert",
      manifestation: ["sophisticated analysis", "predictive insights", "pattern recognition"]
    },
    
    conversation: {
      description: "Natural dialogue that makes complex operations simple",
      manifestation: ["intuitive interface", "guided experiences", "contextual help"]
    },
    
    growth: {
      description: "Partnership focused on user success and portfolio building",
      manifestation: ["optimization recommendations", "success celebrations", "learning insights"]
    },
    
    trust: {
      description: "Reliable guidance backed by data and proven results",
      manifestation: ["transparent reasoning", "accuracy metrics", "consistent performance"]
    }
  }
} as const;

// Brand application guidelines for different contexts
export const NEXUS_BRAND_CONTEXTS = {
  first_time_users: {
    emphasis: ["approachable", "empowering", "trustworthy"],
    tone: "welcoming and encouraging",
    messaging_focus: "capability demonstration and value clarity"
  },
  
  power_users: {
    emphasis: ["intelligent", "innovative", "efficient"],
    tone: "sophisticated and direct",
    messaging_focus: "advanced features and optimization insights"
  },
  
  technical_audiences: {
    emphasis: ["innovative", "transparent", "precise"],
    tone: "authoritative and detailed",
    messaging_focus: "technical capabilities and data accuracy"
  },
  
  business_audiences: {
    emphasis: ["growth", "trustworthy", "empowering"],
    tone: "confident and results-focused",
    messaging_focus: "ROI and competitive advantages"
  }
} as const;