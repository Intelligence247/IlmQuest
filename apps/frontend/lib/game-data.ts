export interface CardPair {
  id: string
  concept: string
  definition: string
  fact: string
}

export interface QuestDeck {
  id: string
  name: string
  description: string
  reward: string
  difficulty: "beginner" | "intermediate" | "advanced"
  isLocked: boolean
  pairs: CardPair[]
}

export const celoBasicsDeck: CardPair[] = [
  {
    id: "cusd",
    concept: "cUSD",
    definition: "Stable Value",
    fact: "cUSD tracks the value of the US Dollar so you can save without volatility.",
  },
  {
    id: "gas",
    concept: "Gas Fee",
    definition: "Transaction Cost",
    fact: "Gas fees pay validators who process your transactions on the blockchain.",
  },
  {
    id: "wallet",
    concept: "Wallet",
    definition: "Your Crypto Bank",
    fact: "Your wallet stores your private keys, which prove you own your crypto assets.",
  },
  {
    id: "blockchain",
    concept: "Blockchain",
    definition: "Digital Ledger",
    fact: "A blockchain is a shared record that everyone can verify but no one can cheat.",
  },
]

export const stablecoinsDeck: CardPair[] = [
  {
    id: "stablecoin",
    concept: "Stablecoin",
    definition: "Steady Price",
    fact: "Stablecoins are designed to maintain a consistent value, usually pegged to a fiat currency like USD.",
  },
  {
    id: "peg",
    concept: "Peg",
    definition: "Fixed Rate",
    fact: "A peg is a mechanism that keeps a stablecoin's value tied to another asset, like 1 cUSD = 1 USD.",
  },
  {
    id: "reserve",
    concept: "Reserve",
    definition: "Backing Assets",
    fact: "Reserves are assets held to guarantee a stablecoin can be redeemed for its pegged value.",
  },
  {
    id: "volatility",
    concept: "Volatility",
    definition: "Price Swings",
    fact: "Volatility measures how much an asset's price changes. Stablecoins aim for low volatility.",
  },
]

export const defiDeck: CardPair[] = [
  {
    id: "defi",
    concept: "DeFi",
    definition: "Open Finance",
    fact: "DeFi stands for Decentralized Finance - financial services without traditional banks or intermediaries.",
  },
  {
    id: "liquidity",
    concept: "Liquidity",
    definition: "Easy Trading",
    fact: "Liquidity means how easily you can buy or sell an asset without affecting its price.",
  },
  {
    id: "yield",
    concept: "Yield",
    definition: "Earnings Rate",
    fact: "Yield is the return you earn on your crypto, similar to interest in a savings account.",
  },
  {
    id: "protocol",
    concept: "Protocol",
    definition: "Smart Rules",
    fact: "A protocol is a set of rules encoded in smart contracts that automate financial operations.",
  },
]

export const securityDeck: CardPair[] = [
  {
    id: "seedphrase",
    concept: "Seed Phrase",
    definition: "Master Key",
    fact: "Your seed phrase is 12-24 words that can recover your entire wallet. Never share it with anyone!",
  },
  {
    id: "phishing",
    concept: "Phishing",
    definition: "Fake Trick",
    fact: "Phishing attacks use fake websites or messages to steal your login credentials and funds.",
  },
  {
    id: "2fa",
    concept: "2FA",
    definition: "Extra Lock",
    fact: "Two-Factor Authentication adds a second layer of security beyond just your password.",
  },
  {
    id: "privatekey",
    concept: "Private Key",
    definition: "Secret Code",
    fact: "Your private key proves ownership of your crypto. If someone gets it, they control your funds.",
  },
]

export const questDecks: QuestDeck[] = [
  {
    id: "celo-basics",
    name: "Celo Basics",
    description: "Learn the fundamentals of the Celo ecosystem",
    reward: "0.10 cUSD",
    difficulty: "beginner",
    isLocked: false,
    pairs: celoBasicsDeck,
  },
  {
    id: "stablecoins-101",
    name: "Stablecoins 101",
    description: "Understand how stablecoins maintain their value",
    reward: "0.15 cUSD",
    difficulty: "beginner",
    isLocked: false,
    pairs: stablecoinsDeck,
  },
  {
    id: "defi-fundamentals",
    name: "DeFi Fundamentals",
    description: "Explore decentralized finance concepts",
    reward: "0.20 cUSD",
    difficulty: "intermediate",
    isLocked: false,
    pairs: defiDeck,
  },
  {
    id: "security-essentials",
    name: "Security Essentials",
    description: "Learn to protect your crypto assets",
    reward: "0.25 cUSD",
    difficulty: "advanced",
    isLocked: false,
    pairs: securityDeck,
  },
]
