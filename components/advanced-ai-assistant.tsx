"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Send, Mic, ImageIcon, Loader2, RefreshCw, Sparkles, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { apiService } from "@/lib/api-service"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isLoading?: boolean
  isError?: boolean
}

// Enhanced crypto knowledge base for the AI assistant
const cryptoKnowledge = {
  bitcoin: {
    description:
      "Bitcoin is the first and most well-known cryptocurrency, created in 2009 by an unknown person or group using the pseudonym Satoshi Nakamoto.",
    marketCap:
      "Bitcoin has the largest market capitalization among all cryptocurrencies, often exceeding $1 trillion during bull markets.",
    technology: "Bitcoin uses a proof-of-work consensus mechanism and has a fixed supply cap of 21 million coins.",
    investment:
      "Bitcoin is often considered 'digital gold' and a store of value. Many investors use it as a hedge against inflation.",
    risks: "Bitcoin's price can be highly volatile, and it faces regulatory challenges in many jurisdictions.",
    history:
      "Bitcoin was created in the aftermath of the 2008 financial crisis as an alternative to traditional financial systems controlled by central banks and governments.",
    mining:
      "Bitcoin mining is the process by which new bitcoins are entered into circulation. It requires specialized hardware and significant electricity consumption.",
    halving:
      "Bitcoin undergoes a 'halving' approximately every four years, where the reward for mining new blocks is cut in half, reducing the rate at which new bitcoins are created.",
  },
  ethereum: {
    description:
      "Ethereum is a decentralized, open-source blockchain with smart contract functionality. It was proposed in 2013 by Vitalik Buterin.",
    marketCap: "Ethereum typically has the second-largest market capitalization after Bitcoin.",
    technology:
      "Ethereum transitioned from proof-of-work to proof-of-stake with 'The Merge' upgrade, significantly reducing its energy consumption.",
    investment:
      "Ethereum is valued for its smart contract capabilities and the ecosystem of decentralized applications (dApps) built on it.",
    risks: "Ethereum faces competition from other smart contract platforms and scaling challenges.",
    history:
      "Ethereum was conceived in 2013 by Vitalik Buterin, a programmer and co-founder of Bitcoin Magazine. The network went live on July 30, 2015.",
    upgrades:
      "Ethereum has undergone several major upgrades, including 'The Merge' (transition to proof-of-stake), and is planning further improvements like sharding to increase scalability.",
    gas: "Transactions on Ethereum require 'gas' fees, which can fluctuate based on network congestion. These fees are paid in ETH and compensate validators for processing transactions.",
  },
  defi: {
    description:
      "Decentralized Finance (DeFi) refers to financial services built on blockchain technology that aim to recreate and improve upon traditional financial systems.",
    components: "DeFi includes lending platforms, decentralized exchanges (DEXs), yield farming, and stablecoins.",
    popular: "Popular DeFi protocols include Uniswap, Aave, Compound, and MakerDAO.",
    risks: "DeFi carries risks including smart contract vulnerabilities, impermanent loss, and regulatory uncertainty.",
    tvl: "Total Value Locked (TVL) is a key metric in DeFi, representing the total value of assets deposited in DeFi protocols.",
    yield:
      "Yield farming involves staking or lending crypto assets to generate returns or rewards in the form of additional cryptocurrency.",
    liquidity:
      "Liquidity pools are collections of funds locked in a smart contract, used to facilitate trading by providing liquidity to various markets.",
    governance:
      "Many DeFi protocols use governance tokens that allow holders to vote on changes to the protocol, creating decentralized governance systems.",
  },
  nft: {
    description:
      "Non-Fungible Tokens (NFTs) are unique digital assets that represent ownership of specific items or content on the blockchain.",
    uses: "NFTs are commonly used for digital art, collectibles, gaming items, and virtual real estate.",
    markets: "Major NFT marketplaces include OpenSea, Rarible, and Blur.",
    considerations:
      "When investing in NFTs, consider factors like creator reputation, scarcity, utility, and community support.",
    standards:
      "Most NFTs use the ERC-721 or ERC-1155 token standards on Ethereum, though other blockchains have developed their own NFT standards.",
    royalties:
      "NFTs can be programmed to pay royalties to their original creators every time they're resold, providing ongoing income to artists and creators.",
    environmental:
      "Early NFTs on proof-of-work blockchains faced criticism for their environmental impact, though this has decreased with the shift to proof-of-stake systems.",
    utility:
      "Beyond digital art, NFTs are increasingly being used for event tickets, membership passes, domain names, and as proof of authenticity for physical items.",
  },
  trading: {
    strategies:
      "Common crypto trading strategies include HODLing (long-term holding), day trading, swing trading, and dollar-cost averaging.",
    analysis:
      "Traders use technical analysis (chart patterns, indicators) and fundamental analysis (project evaluation, team assessment) to make decisions.",
    risk: "Risk management is crucial in crypto trading. Consider using stop-loss orders and never invest more than you can afford to lose.",
    taxes:
      "Cryptocurrency trading may have tax implications. Keep detailed records of all transactions for tax reporting purposes.",
    leverage:
      "Leverage trading allows traders to borrow funds to increase their trading position, potentially amplifying both gains and losses.",
    indicators:
      "Popular technical indicators include Moving Averages, Relative Strength Index (RSI), MACD, and Bollinger Bands.",
    patterns:
      "Chart patterns like head and shoulders, double tops/bottoms, and triangles can signal potential price movements.",
    sentiment:
      "Market sentiment analysis examines social media, news, and other sources to gauge public perception and potential market movements.",
  },
  staking: {
    description: "Staking involves locking up cryptocurrency to support network operations in exchange for rewards.",
    benefits: "Staking can provide passive income through rewards while supporting blockchain security and operations.",
    risks:
      "Staking risks include lockup periods, validator performance, and potential slashing penalties for validator misconduct.",
    popular: "Popular staking cryptocurrencies include Ethereum, Solana, Cardano, and Polkadot.",
    validators:
      "Validators are participants who lock up tokens to validate transactions and create new blocks in proof-of-stake networks.",
    delegation:
      "Many networks allow token holders to delegate their stake to validators without transferring ownership, sharing in the rewards.",
    liquid:
      "Liquid staking solutions allow users to receive tradable tokens representing their staked assets, maintaining liquidity while earning staking rewards.",
    yield:
      "Staking yields vary widely between different cryptocurrencies and can change based on network participation and token economics.",
  },
  security: {
    wallets:
      "Cryptocurrency wallets can be hot (connected to the internet) or cold (offline). Hardware wallets like Ledger and Trezor offer strong security for long-term storage.",
    practices:
      "Best security practices include using strong passwords, enabling two-factor authentication, and being cautious of phishing attempts.",
    risks:
      "Common security risks include exchange hacks, phishing attacks, and malware targeting cryptocurrency holdings.",
    privateKeys:
      "Private keys are cryptographic keys that prove ownership of cryptocurrency. Never share your private keys or seed phrases with anyone.",
    seedPhrase:
      "A seed phrase (or recovery phrase) is a series of words that can be used to recover your cryptocurrency wallet if lost or damaged.",
    multisig:
      "Multi-signature (multisig) wallets require multiple signatures to authorize transactions, providing an additional layer of security.",
    custody:
      "Self-custody means maintaining control of your own private keys, while custodial services hold your cryptocurrency on your behalf.",
    backups:
      "Creating secure, encrypted backups of wallet information is essential for recovering access to your funds in case of device failure or loss.",
  },
  regulation: {
    global: "Cryptocurrency regulation varies widely by country, from supportive frameworks to outright bans.",
    trends: "Regulatory trends include increased KYC/AML requirements, stablecoin regulation, and tax enforcement.",
    impact: "Regulatory developments can significantly impact cryptocurrency prices and adoption.",
    compliance:
      "Cryptocurrency businesses increasingly need to comply with regulations similar to traditional financial institutions.",
    cbdc: "Central Bank Digital Currencies (CBDCs) are digital versions of national currencies, being explored by many countries as alternatives to private cryptocurrencies.",
    taxation:
      "Most jurisdictions now have specific tax guidelines for cryptocurrency transactions, including capital gains taxes on trading profits.",
    travel:
      "The 'Travel Rule' requires financial institutions to share sender and recipient information for cryptocurrency transactions above certain thresholds.",
    licensing:
      "Many jurisdictions now require cryptocurrency exchanges and service providers to obtain specific licenses to operate legally.",
  },
  // Add more categories as needed
}

// Function to generate a more contextual and intelligent response based on user input
function generateAdvancedResponse(input: string): string {
  const lowercaseInput = input.toLowerCase()

  // Check for greetings
  if (/^(hi|hello|hey|greetings)/.test(lowercaseInput)) {
    return "Hello! I'm your advanced crypto assistant. How can I help you with cryptocurrency information today?"
  }

  // Check for price inquiries
  if (/price of|how much is|current price|worth|value/.test(lowercaseInput)) {
    // Determine which cryptocurrency they're asking about
    let coinName = "cryptocurrency"
    if (lowercaseInput.includes("bitcoin") || lowercaseInput.includes("btc")) {
      coinName = "Bitcoin"
    } else if (lowercaseInput.includes("ethereum") || lowercaseInput.includes("eth")) {
      coinName = "Ethereum"
    } else if (lowercaseInput.includes("solana") || lowercaseInput.includes("sol")) {
      coinName = "Solana"
    } else if (lowercaseInput.includes("cardano") || lowercaseInput.includes("ada")) {
      coinName = "Cardano"
    }

    return `For the most current price of ${coinName}, I recommend checking a real-time price tracker like CoinGecko or CoinMarketCap. Prices in the cryptocurrency market are highly volatile and can change rapidly. Would you like me to explain more about ${coinName} or provide information about price analysis methods?`
  }

  // Check for investment advice
  if (/should i (buy|invest|purchase|sell)|good investment|worth (buying|investing)/.test(lowercaseInput)) {
    return "I can't provide personalized investment advice, as cryptocurrency investments carry significant risks and should be based on your own research and risk tolerance. However, I can explain different investment strategies like dollar-cost averaging, which involves investing fixed amounts at regular intervals to reduce the impact of volatility. Would you like to learn more about risk management in crypto investing?"
  }

  // Check for specific crypto knowledge
  if (lowercaseInput.includes("bitcoin") || lowercaseInput.includes("btc")) {
    if (lowercaseInput.includes("mining") || lowercaseInput.includes("miner")) {
      return `${cryptoKnowledge.bitcoin.mining} The mining process involves solving complex mathematical problems to validate transactions and secure the network. As more miners join the network, the difficulty of these problems increases, requiring more computational power. Would you like to know more about Bitcoin mining or how it compares to other consensus mechanisms?`
    } else if (lowercaseInput.includes("halving")) {
      return `${cryptoKnowledge.bitcoin.halving} This mechanism is built into Bitcoin's code and helps create scarcity. The most recent halving occurred in May 2020, reducing the block reward to 6.25 BTC. The next halving is expected around 2024. Historically, halvings have preceded bull markets, though past performance doesn't guarantee future results.`
    } else if (
      lowercaseInput.includes("history") ||
      lowercaseInput.includes("created") ||
      lowercaseInput.includes("origin")
    ) {
      return `${cryptoKnowledge.bitcoin.history} The first block, known as the "genesis block," was mined on January 3, 2009. The first real  The first block, known as the "genesis block," was mined on January 3, 2009. The first real-world transaction occurred when Satoshi Nakamoto sent Bitcoin to Hal Finney on January 12, 2009. Bitcoin remained relatively obscure for its first few years before beginning to gain mainstream attention around 2013.`
    } else if (lowercaseInput.includes("invest") || lowercaseInput.includes("buy")) {
      return `${cryptoKnowledge.bitcoin.investment} However, it's important to do your own research and consider your risk tolerance before investing. Bitcoin's price can be highly volatile, with significant price swings in short periods. Many financial advisors suggest only allocating a small percentage of your portfolio to cryptocurrencies like Bitcoin.`
    } else {
      return `${cryptoKnowledge.bitcoin.description} ${cryptoKnowledge.bitcoin.technology} Bitcoin operates on a decentralized network of computers that maintain its blockchain, eliminating the need for central authorities like banks or governments. Would you like to know more about how Bitcoin works or its market performance?`
    }
  }

  if (lowercaseInput.includes("ethereum") || lowercaseInput.includes("eth")) {
    if (lowercaseInput.includes("smart contract") || lowercaseInput.includes("dapp")) {
      return `Ethereum pioneered smart contracts, which are self-executing contracts with the terms directly written into code. ${cryptoKnowledge.ethereum.technology} This enables developers to build decentralized applications (dApps) on the Ethereum blockchain. These dApps can range from financial services and games to social networks and art marketplaces, all operating without central authorities.`
    } else if (lowercaseInput.includes("gas") || lowercaseInput.includes("fee")) {
      return `${cryptoKnowledge.ethereum.gas} Gas prices are measured in "gwei," which is a denomination of ETH (1 gwei = 0.000000001 ETH). During periods of high network congestion, gas prices can spike significantly. Several Ethereum upgrades aim to reduce these fees and improve scalability.`
    } else if (
      lowercaseInput.includes("merge") ||
      lowercaseInput.includes("pos") ||
      lowercaseInput.includes("proof of stake")
    ) {
      return `${cryptoKnowledge.ethereum.upgrades} The Merge was completed in September 2022, transitioning Ethereum from proof-of-work to proof-of-stake consensus. This reduced Ethereum's energy consumption by approximately 99.95% and laid the groundwork for future scaling solutions. The next major upgrades focus on improving transaction throughput and reducing costs.`
    } else {
      return `${cryptoKnowledge.ethereum.description} ${cryptoKnowledge.ethereum.investment} Ethereum's programmable nature makes it fundamentally different from Bitcoin, as it can support a wide range of applications beyond simple value transfer. This has led to a vast ecosystem of projects built on its platform.`
    }
  }

  if (lowercaseInput.includes("defi") || lowercaseInput.includes("decentralized finance")) {
    if (lowercaseInput.includes("yield") || lowercaseInput.includes("farming") || lowercaseInput.includes("staking")) {
      return `${cryptoKnowledge.defi.yield} Yield farming strategies can be complex and often involve moving assets between different protocols to maximize returns. While yields can be attractive, they typically come with corresponding risks, including smart contract vulnerabilities, impermanent loss, and market volatility. It's important to thoroughly research protocols before committing funds.`
    } else if (lowercaseInput.includes("tvl") || lowercaseInput.includes("total value locked")) {
      return `${cryptoKnowledge.defi.tvl} TVL is an important metric for evaluating the size and growth of DeFi protocols. A higher TVL generally indicates more trust in the protocol, though it shouldn't be the only factor considered when evaluating DeFi platforms. TVL can fluctuate based on both asset prices and user participation.`
    } else if (lowercaseInput.includes("governance") || lowercaseInput.includes("dao")) {
      return `${cryptoKnowledge.defi.governance} These Decentralized Autonomous Organizations (DAOs) allow for community-driven decision making about protocol parameters, treasury management, and development priorities. Governance token holders can propose and vote on changes, creating a more democratic approach to protocol management compared to traditional financial systems.`
    } else {
      return `${cryptoKnowledge.defi.description} ${cryptoKnowledge.defi.components} Popular protocols include Uniswap, Aave, and Compound. While DeFi offers exciting opportunities like permissionless lending and trading, it also carries risks including smart contract vulnerabilities, regulatory uncertainty, and market volatility. The space continues to innovate rapidly.`
    }
  }

  if (lowercaseInput.includes("nft") || lowercaseInput.includes("non-fungible")) {
    if (lowercaseInput.includes("royalty") || lowercaseInput.includes("royalties")) {
      return `${cryptoKnowledge.nft.royalties} This creates a new economic model for creators, who can earn income not just from initial sales but throughout the lifetime of their work. Royalty percentages typically range from 2.5% to 10% of the sale price. However, enforcement of royalties varies across marketplaces, with some making them optional rather than mandatory.`
    } else if (
      lowercaseInput.includes("environment") ||
      lowercaseInput.includes("energy") ||
      lowercaseInput.includes("climate")
    ) {
      return `${cryptoKnowledge.nft.environmental} Many NFT platforms have now moved to more energy-efficient blockchains or layer-2 solutions. Ethereum's transition to proof-of-stake has significantly reduced the environmental footprint of NFTs minted on its blockchain. Some platforms also offer carbon-offset options for NFT creators and collectors.`
    } else if (lowercaseInput.includes("utility") || lowercaseInput.includes("use case")) {
      return `${cryptoKnowledge.nft.utility} For example, NFTs are being used as access tokens for exclusive communities, as tickets for events (both virtual and physical), as in-game items with real utility, and as verifiable credentials. Some projects are exploring NFTs that evolve over time or provide ongoing benefits to holders.`
    } else {
      return `${cryptoKnowledge.nft.description} ${cryptoKnowledge.nft.uses} The NFT market has seen significant volatility, with periods of extreme growth followed by contractions. If you're interested in NFTs, research thoroughly and consider both artistic value and potential utility. The technology continues to evolve beyond simple collectibles toward more utility-focused applications.`
    }
  }

  if (lowercaseInput.includes("stake") || lowercaseInput.includes("staking")) {
    if (lowercaseInput.includes("liquid") || lowercaseInput.includes("liquidity")) {
      return `${cryptoKnowledge.staking.liquid} These liquid staking derivatives (LSDs) like Lido's stETH for Ethereum allow users to maintain exposure to the market while still earning staking rewards. This solves one of the main drawbacks of traditional staking: the inability to use staked assets for other purposes during the lockup period.`
    } else if (lowercaseInput.includes("validator") || lowercaseInput.includes("node")) {
      return `${cryptoKnowledge.staking.validators} Validators are selected to create new blocks based on factors like the size of their stake and randomization. Running a validator typically requires technical knowledge and a minimum stake amount (e.g., 32 ETH for Ethereum). Validators earn rewards for honest participation but may face penalties for downtime or malicious behavior.`
    } else if (lowercaseInput.includes("delegate") || lowercaseInput.includes("delegation")) {
      return `${cryptoKnowledge.staking.delegation} This delegation model makes staking accessible to users with smaller holdings who may not have the technical expertise or minimum tokens required to run their own validator. When selecting a validator to delegate to, consider factors like commission rates, uptime history, and their contribution to the ecosystem.`
    } else {
      return `${cryptoKnowledge.staking.description} ${cryptoKnowledge.staking.benefits} Popular staking cryptocurrencies include Ethereum, Solana, Cardano, and Polkadot. Each has different mechanisms and reward rates. Staking can be a way to earn passive income while supporting networks you believe in, but be sure to understand the specific rules and risks for each blockchain.`
    }
  }

  if (lowercaseInput.includes("wallet") || lowercaseInput.includes("storage") || lowercaseInput.includes("secure")) {
    if (lowercaseInput.includes("seed") || lowercaseInput.includes("recovery") || lowercaseInput.includes("phrase")) {
      return `${cryptoKnowledge.security.seedPhrase} Typically consisting of 12 or 24 words in a specific order, your seed phrase should be written down on paper (not stored digitally) and kept in a secure location, ideally in multiple locations to prevent loss from disasters. Never share your seed phrase with anyone, as it provides complete access to your funds.`
    } else if (lowercaseInput.includes("hardware") || lowercaseInput.includes("cold")) {
      return `${cryptoKnowledge.security.wallets} Hardware wallets store your private keys offline, making them highly resistant to hacking attempts. Popular options include Ledger, Trezor, and GridPlus. Even when using a hardware wallet, it's crucial to securely back up your seed phrase and keep your device's firmware updated.`
    } else if (lowercaseInput.includes("multisig") || lowercaseInput.includes("multi-sig")) {
      return `${cryptoKnowledge.security.multisig} For example, a 2-of-3 multisig wallet requires any two of three designated keys to authorize a transaction. This provides protection against a single point of failure and is commonly used by businesses, DAOs, and individuals with significant holdings. Multisig setups can be implemented through specialized wallets or smart contracts.`
    } else {
      return `${cryptoKnowledge.security.wallets} For maximum security, consider using a hardware wallet for long-term storage and only keep small amounts in exchange wallets for trading. Always backup your seed phrases in a secure, offline location. Remember that with self-custody comes complete responsibility—there's no 'forgot password' option in cryptocurrency.`
    }
  }

  if (lowercaseInput.includes("trade") || lowercaseInput.includes("trading") || lowercaseInput.includes("strategy")) {
    if (
      lowercaseInput.includes("technical") ||
      lowercaseInput.includes("chart") ||
      lowercaseInput.includes("indicator")
    ) {
      return `${cryptoKnowledge.trading.indicators} Technical analysis attempts to predict future price movements based on historical data and chart patterns. While some traders rely heavily on these indicators, it's important to remember that no indicator is foolproof, especially in the volatile crypto market. Many successful traders use multiple indicators in combination rather than relying on any single signal.`
    } else if (lowercaseInput.includes("leverage") || lowercaseInput.includes("margin")) {
      return `${cryptoKnowledge.trading.leverage} For example, 10x leverage means you can open a position 10 times larger than your capital, but it also means a 10% move against your position would result in liquidation. Due to cryptocurrency's inherent volatility, leveraged trading carries extreme risk and is not recommended for beginners. Many experienced traders limit themselves to low leverage or avoid it entirely.`
    } else if (
      lowercaseInput.includes("sentiment") ||
      lowercaseInput.includes("social") ||
      lowercaseInput.includes("news")
    ) {
      return `${cryptoKnowledge.trading.sentiment} Tools like the Fear & Greed Index, social media volume metrics, and sentiment analysis algorithms can help gauge market psychology. Contrarian investors often look for extreme sentiment readings as potential reversal indicators, buying when fear is high and selling when greed is excessive. However, sentiment should be just one component of a comprehensive trading strategy.`
    } else {
      return `${cryptoKnowledge.trading.strategies} ${cryptoKnowledge.trading.risk} Many successful traders emphasize the importance of emotional discipline and having a clear strategy before entering positions. It's also crucial to determine your time horizon—whether you're day trading, swing trading, or investing for the long term—as this will influence your approach to market movements.`
    }
  }

  if (lowercaseInput.includes("regulation") || lowercaseInput.includes("legal") || lowercaseInput.includes("tax")) {
    if (lowercaseInput.includes("tax") || lowercaseInput.includes("taxes")) {
      return `${cryptoKnowledge.regulation.taxation} In many countries, cryptocurrency is treated as property for tax purposes, with transactions potentially triggering capital gains tax events. Activities like trading, mining, staking rewards, and even spending crypto can have tax implications. Specialized crypto tax software can help track transactions and calculate obligations, but consulting with a tax professional is advisable for complex situations.`
    } else if (lowercaseInput.includes("cbdc") || lowercaseInput.includes("central bank")) {
      return `${cryptoKnowledge.regulation.cbdc} Unlike decentralized cryptocurrencies, CBDCs would be issued and controlled by central banks. They could offer benefits like faster payments and financial inclusion, but also raise concerns about privacy and government control. Many major economies, including China, the Eurozone, and the United States, are in various stages of CBDC development and testing.`
    } else if (lowercaseInput.includes("license") || lowercaseInput.includes("compliance")) {
      return `${cryptoKnowledge.regulation.licensing} These requirements often include robust Know Your Customer (KYC) and Anti-Money Laundering (AML) procedures, capital reserves, security standards, and regular audits. The regulatory landscape continues to evolve, with some jurisdictions creating crypto-specific frameworks while others apply existing financial regulations to cryptocurrency businesses.`
    } else {
      return `${cryptoKnowledge.regulation.global} ${cryptoKnowledge.regulation.impact} It's important to stay informed about regulations in your jurisdiction and consult with legal professionals when necessary. The regulatory landscape is evolving rapidly as governments and international bodies work to address concerns while balancing innovation. This uncertainty can contribute to market volatility.`
    }
  }

  if (lowercaseInput.includes("market") || lowercaseInput.includes("bull") || lowercaseInput.includes("bear")) {
    return "Cryptocurrency markets are cyclical, with alternating bull markets (periods of rising prices) and bear markets (periods of falling prices). These cycles are influenced by factors including Bitcoin halving events, macroeconomic conditions, regulatory developments, and market sentiment. Bull markets often see rapid price appreciation and increased public interest, while bear markets can involve prolonged downtrends and reduced trading activity. Successful investors often develop strategies that work in both market conditions."
  }

  if (lowercaseInput.includes("altcoin") || lowercaseInput.includes("token")) {
    return "Altcoins are cryptocurrencies other than Bitcoin. They range from established projects like Ethereum to thousands of smaller tokens. When evaluating altcoins, consider factors like the team's experience, technological innovation, real-world use cases, community support, and tokenomics. Be particularly cautious with newly launched tokens, as the space has seen many projects fail or turn out to be scams. It's advisable to research thoroughly and understand a project's fundamentals before investing."
  }

  // If no specific match, provide a general response with follow-up suggestions
  return "I understand you're asking about cryptocurrency. Could you provide more specific details about what you'd like to know? I can help with information about specific cryptocurrencies, trading strategies, security practices, or current market trends. For example, you might ask about Bitcoin's technology, how to secure your crypto assets, or how staking works."
}

// Function to fetch real-time price data for a cryptocurrency
async function fetchCryptoPrice(coinId: string): Promise<string> {
  try {
    const coins = await apiService.getCoins(1, 100)
    const coin = coins.find((c) => c.id === coinId || c.symbol.toLowerCase() === coinId.toLowerCase())

    if (coin) {
      const priceChangeClass = coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
      const priceChangeIcon = coin.price_change_percentage_24h >= 0 ? "↑" : "↓"

      return `The current price of ${coin.name} (${coin.symbol.toUpperCase()}) is $${coin.current_price.toLocaleString()} with a 24h change of <span class="${priceChangeClass}">${priceChangeIcon} ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>. Market cap: $${coin.market_cap.toLocaleString()}.`
    } else {
      return `I couldn't find real-time data for ${coinId}. Please check if the cryptocurrency name or symbol is correct.`
    }
  } catch (error) {
    console.error("Error fetching crypto price:", error)
    return `I'm having trouble accessing real-time price data at the moment. You can check current prices on CoinGecko or CoinMarketCap.`
  }
}

export function AdvancedAiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your advanced crypto assistant powered by AI. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Add a loading message
    const loadingMessageId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        content: "Analyzing your question...",
        role: "assistant",
        timestamp: new Date(),
        isLoading: true,
      },
    ])

    try {
      // Check if the user is asking about crypto prices
      const priceRegex = /price of|how much is|current price|worth|value/i
      const coinRegex = /(bitcoin|btc|ethereum|eth|solana|sol|cardano|ada|ripple|xrp)/i

      let response = ""

      if (priceRegex.test(input.toLowerCase()) && coinRegex.test(input.toLowerCase())) {
        // Extract the coin name from the input
        const match = input.toLowerCase().match(coinRegex)
        if (match && match[0]) {
          const coinId = match[0]
            .replace("btc", "bitcoin")
            .replace("eth", "ethereum")
            .replace("sol", "solana")
            .replace("ada", "cardano")
            .replace("xrp", "ripple")

          // Fetch real-time price data
          response = await fetchCryptoPrice(coinId)
        }
      }

      // If we didn't get a price response, generate a standard response
      if (!response) {
        response = generateAdvancedResponse(input)
      }

      // Remove the loading message and add the real response
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== loadingMessageId)
          .concat({
            id: Date.now().toString(),
            content: response,
            role: "assistant",
            timestamp: new Date(),
          }),
      )
    } catch (error) {
      console.error("Error generating response:", error)

      // Remove the loading message and add an error message
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== loadingMessageId)
          .concat({
            id: Date.now().toString(),
            content: "I'm sorry, I encountered an error while processing your request. Please try again.",
            role: "assistant",
            timestamp: new Date(),
            isError: true,
          }),
      )
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      return
    }

    setIsRecording(true)
    toast({
      title: "Voice recording started",
      description: "Speak clearly into your microphone...",
    })

    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false)

      // Randomly select a voice query
      const voiceQueries = [
        "What's the current price of Bitcoin?",
        "How does Ethereum staking work?",
        "Can you explain what DeFi is?",
        "What are the best security practices for crypto?",
        "How do I analyze a cryptocurrency before investing?",
      ]

      const randomQuery = voiceQueries[Math.floor(Math.random() * voiceQueries.length)]
      setInput(randomQuery)

      toast({
        title: "Voice recording completed",
        description: "Your question has been transcribed.",
      })
    }, 3000)
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file for analysis.",
          variant: "destructive",
        })
        return
      }

      // Simulate image analysis
      setIsProcessingImage(true)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "I've uploaded a chart image for analysis.",
          role: "user",
          timestamp: new Date(),
        },
      ])

      setTimeout(() => {
        setIsProcessingImage(false)

        // Generate a detailed chart analysis response
        const chartAnalysisResponses = [
          "Based on the chart you've uploaded, I can see a classic bullish flag pattern forming. The price consolidated after a strong upward movement, which often precedes another leg up. The volume profile supports this analysis, showing decreasing volume during consolidation. Key resistance levels are visible at $45,200 and $48,600, with support at $42,800. Consider waiting for a breakout confirmation before making trading decisions.",

          "The chart shows a descending triangle pattern, which is typically bearish. Price has been making lower highs while finding support at a consistent level. Volume has been declining, suggesting a potential breakdown. Key levels to watch are the support at $28,300 and resistance at $30,500. If support breaks, we could see acceleration to the downside. Risk management is crucial in this scenario.",

          "I'm seeing a double bottom pattern on this chart, which is a bullish reversal signal. The price has tested the same support level twice and bounced, with the second bounce showing stronger momentum. The RSI indicator shows positive divergence, confirming the potential reversal. Watch for a break above the neckline at $3,450, which would confirm the pattern with a potential target of $3,850.",

          "This chart displays a head and shoulders pattern, typically considered bearish. The left shoulder, head, and right shoulder are clearly visible, with the neckline around $1,820. Volume pattern aligns with the formation, showing higher volume on the left shoulder and head, with decreasing volume on the right shoulder. If price breaks below the neckline, the measured move suggests a target of approximately $1,650.",

          "The chart shows a strong uptrend with a series of higher highs and higher lows. The 50-day moving average is providing dynamic support, and price recently bounced off this level. MACD shows bullish momentum with the signal line crossing above the baseline. Key resistance is at the previous high of $58,400, with support at the recent low of $52,700. The overall trend remains bullish as long as price stays above the 50-day MA.",
        ]

        const randomAnalysis = chartAnalysisResponses[Math.floor(Math.random() * chartAnalysisResponses.length)]

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: randomAnalysis,
            role: "assistant",
            timestamp: new Date(),
          },
        ])
      }, 3000)
    }
  }

  const clearConversation = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your advanced crypto assistant powered by AI. How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])

    toast({
      title: "Conversation cleared",
      description: "Starting a fresh conversation.",
    })
  }

  const getSuggestedQuestions = () => {
    const suggestions = [
      "What's the current price of Bitcoin?",
      "How does staking work?",
      "What are the risks of DeFi?",
      "How do I secure my crypto wallet?",
      "What's the difference between Bitcoin and Ethereum?",
      "How do hardware wallets work?",
      "What should I know about NFTs?",
      "How do I analyze a crypto project?",
    ]

    // Return 3 random suggestions
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, 3)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 shadow-2xl max-w-[calc(100vw-2rem)]"
          >
            <Card className="border-2 border-teal-500/20 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-gradient-to-r from-teal-500 to-emerald-500">
                      <AvatarImage src="/ai-assistant.png" alt="AI Assistant" />
                      <AvatarFallback className="bg-teal-500 text-white">AI</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">Crypto Assistant</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={clearConversation} title="Clear conversation">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} title="Close">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 space-y-4 overflow-x-hidden">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex flex-col max-w-[80%] rounded-lg p-3",
                        message.role === "user"
                          ? "ml-auto bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                          : message.isError
                            ? "bg-red-500/10 border border-red-500/20 text-red-500"
                            : "bg-muted",
                      )}
                    >
                      {message.isLoading ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <p className="text-sm">{message.content}</p>
                        </div>
                      ) : (
                        <>
                          <div className="text-sm break-words" dangerouslySetInnerHTML={{ __html: message.content }} />
                          <span className="text-xs opacity-70 mt-1 self-end">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </>
                      )}
                    </div>
                  ))}

                  {messages.length === 1 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-muted-foreground">Try asking:</p>
                      <div className="flex flex-wrap gap-2">
                        {getSuggestedQuestions().map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs border-teal-500/20 hover:bg-teal-500/10"
                            onClick={() => setInput(question)}
                          >
                            <Lightbulb className="h-3 w-3 mr-1 text-teal-500" />
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {isProcessingImage && (
                    <div className="flex flex-col max-w-[80%] rounded-lg p-3 bg-muted">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm">Analyzing chart patterns...</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <div className="flex items-center w-full gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn("rounded-full h-8 w-8", isRecording && "bg-red-500 text-white hover:bg-red-600")}
                    onClick={toggleRecording}
                    title="Voice input"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8"
                    onClick={handleImageUpload}
                    title="Upload chart image"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about crypto..."
                    className="min-h-0 h-9 resize-none text-base"
                    style={{ overflowY: "hidden" }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600"
                    onClick={handleSend}
                    disabled={!input.trim() && !isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping-slow" />
        <div className="relative z-10">{isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}</div>
      </motion.button>
    </>
  )
}
