"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Send, Mic, ImageIcon, Loader2, RefreshCw, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

// Crypto knowledge base for the AI assistant
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
  },
  defi: {
    description:
      "Decentralized Finance (DeFi) refers to financial services built on blockchain technology that aim to recreate and improve upon traditional financial systems.",
    components: "DeFi includes lending platforms, decentralized exchanges (DEXs), yield farming, and stablecoins.",
    popular: "Popular DeFi protocols include Uniswap, Aave, Compound, and MakerDAO.",
    risks: "DeFi carries risks including smart contract vulnerabilities, impermanent loss, and regulatory uncertainty.",
  },
  nft: {
    description:
      "Non-Fungible Tokens (NFTs) are unique digital assets that represent ownership of specific items or content on the blockchain.",
    uses: "NFTs are commonly used for digital art, collectibles, gaming items, and virtual real estate.",
    markets: "Major NFT marketplaces include OpenSea, Rarible, and Blur.",
    considerations:
      "When investing in NFTs, consider factors like creator reputation, scarcity, utility, and community support.",
  },
  trading: {
    strategies:
      "Common crypto trading strategies include HODLing (long-term holding), day trading, swing trading, and dollar-cost averaging.",
    analysis:
      "Traders use technical analysis (chart patterns, indicators) and fundamental analysis (project evaluation, team assessment) to make decisions.",
    risk: "Risk management is crucial in crypto trading. Consider using stop-loss orders and never invest more than you can afford to lose.",
    taxes:
      "Cryptocurrency trading may have tax implications. Keep detailed records of all transactions for tax reporting purposes.",
  },
  staking: {
    description: "Staking involves locking up cryptocurrency to support network operations in exchange for rewards.",
    benefits: "Staking can provide passive income through rewards while supporting blockchain security and operations.",
    risks:
      "Staking risks include lockup periods, validator performance, and potential slashing penalties for validator misconduct.",
    popular: "Popular staking cryptocurrencies include Ethereum, Solana, Cardano, and Polkadot.",
  },
  security: {
    wallets:
      "Cryptocurrency wallets can be hot (connected to the internet) or cold (offline). Hardware wallets like Ledger and Trezor offer strong security for long-term storage.",
    practices:
      "Best security practices include using strong passwords, enabling two-factor authentication, and being cautious of phishing attempts.",
    risks:
      "Common security risks include exchange hacks, phishing attacks, and malware targeting cryptocurrency holdings.",
  },
  regulation: {
    global: "Cryptocurrency regulation varies widely by country, from supportive frameworks to outright bans.",
    trends: "Regulatory trends include increased KYC/AML requirements, stablecoin regulation, and tax enforcement.",
    impact: "Regulatory developments can significantly impact cryptocurrency prices and adoption.",
  },
}

// Function to generate a contextual response based on user input
function generateResponse(input: string): string {
  const lowercaseInput = input.toLowerCase()

  // Check for greetings
  if (/^(hi|hello|hey|greetings)/.test(lowercaseInput)) {
    return "Hello! I'm your crypto assistant. How can I help you with cryptocurrency information today?"
  }

  // Check for specific crypto knowledge
  if (lowercaseInput.includes("bitcoin") || lowercaseInput.includes("btc")) {
    if (lowercaseInput.includes("price") || lowercaseInput.includes("worth") || lowercaseInput.includes("value")) {
      return "Bitcoin's price fluctuates based on market conditions. As of the latest data, Bitcoin has been trading in a significant range. For the most current price, I recommend checking a real-time price tracker like CoinGecko or CoinMarketCap."
    } else if (lowercaseInput.includes("invest") || lowercaseInput.includes("buy")) {
      return `${cryptoKnowledge.bitcoin.investment} However, it's important to do your own research and consider your risk tolerance before investing. Bitcoin's price can be highly volatile.`
    } else {
      return `${cryptoKnowledge.bitcoin.description} ${cryptoKnowledge.bitcoin.technology}`
    }
  }

  if (lowercaseInput.includes("ethereum") || lowercaseInput.includes("eth")) {
    if (lowercaseInput.includes("smart contract") || lowercaseInput.includes("dapp")) {
      return `Ethereum pioneered smart contracts, which are self-executing contracts with the terms directly written into code. ${cryptoKnowledge.ethereum.technology} This enables developers to build decentralized applications (dApps) on the Ethereum blockchain.`
    } else {
      return `${cryptoKnowledge.ethereum.description} ${cryptoKnowledge.ethereum.investment}`
    }
  }

  if (lowercaseInput.includes("defi") || lowercaseInput.includes("decentralized finance")) {
    return `${cryptoKnowledge.defi.description} ${cryptoKnowledge.defi.components} Popular protocols include Uniswap, Aave, and Compound. While DeFi offers exciting opportunities, be aware of risks including smart contract vulnerabilities and regulatory uncertainty.`
  }

  if (lowercaseInput.includes("nft") || lowercaseInput.includes("non-fungible")) {
    return `${cryptoKnowledge.nft.description} ${cryptoKnowledge.nft.uses} The NFT market has seen significant volatility, with periods of extreme growth followed by contractions. If you're interested in NFTs, research thoroughly and consider both artistic value and potential utility.`
  }

  if (lowercaseInput.includes("stake") || lowercaseInput.includes("staking")) {
    return `${cryptoKnowledge.staking.description} ${cryptoKnowledge.staking.benefits} Popular staking cryptocurrencies include Ethereum, Solana, Cardano, and Polkadot. Each has different mechanisms and reward rates.`
  }

  if (lowercaseInput.includes("wallet") || lowercaseInput.includes("storage") || lowercaseInput.includes("secure")) {
    return `${cryptoKnowledge.security.wallets} For maximum security, consider using a hardware wallet for long-term storage and only keep small amounts in exchange wallets for trading. Always backup your seed phrases in a secure, offline location.`
  }

  if (lowercaseInput.includes("trade") || lowercaseInput.includes("trading") || lowercaseInput.includes("strategy")) {
    return `${cryptoKnowledge.trading.strategies} ${cryptoKnowledge.trading.risk} Many successful traders emphasize the importance of emotional discipline and having a clear strategy before entering positions.`
  }

  if (lowercaseInput.includes("regulation") || lowercaseInput.includes("legal") || lowercaseInput.includes("tax")) {
    return `${cryptoKnowledge.regulation.global} ${cryptoKnowledge.regulation.impact} It's important to stay informed about regulations in your jurisdiction and consult with a tax professional for guidance on crypto-related tax obligations.`
  }

  if (lowercaseInput.includes("market") || lowercaseInput.includes("bull") || lowercaseInput.includes("bear")) {
    return "Cryptocurrency markets are cyclical, with alternating bull markets (periods of rising prices) and bear markets (periods of falling prices). These cycles are influenced by factors including Bitcoin halving events, macroeconomic conditions, regulatory developments, and market sentiment. Successful investors often develop strategies that work in both market conditions."
  }

  if (lowercaseInput.includes("altcoin") || lowercaseInput.includes("token")) {
    return "Altcoins are cryptocurrencies other than Bitcoin. They range from established projects like Ethereum to thousands of smaller tokens. When evaluating altcoins, consider factors like the team's experience, technological innovation, real-world use cases, community support, and tokenomics. Be particularly cautious with newly launched tokens, as the space has seen many projects fail or turn out to be scams."
  }

  if (
    lowercaseInput.includes("chart") ||
    lowercaseInput.includes("technical analysis") ||
    lowercaseInput.includes("ta")
  ) {
    return "Technical analysis in cryptocurrency involves studying price charts and using indicators to identify patterns and potential market movements. Common indicators include Moving Averages, RSI, MACD, and Fibonacci retracements. While technical analysis can be valuable, it's often combined with fundamental analysis for a more comprehensive approach to trading decisions."
  }

  // If no specific match, provide a general response
  return "I understand you're asking about cryptocurrency. Could you provide more specific details about what you'd like to know? I can help with information about specific cryptocurrencies, trading strategies, security practices, or current market trends."
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your crypto assistant powered by AI. How can I help you today?",
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
    setIsLoading(true)

    // Generate AI response with a slight delay to simulate processing
    setTimeout(
      () => {
        const aiResponse = generateResponse(input)

        const aiMessage: Message = {
          id: Date.now().toString(),
          content: aiResponse,
          role: "assistant",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds for realism
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
        "What's the current market sentiment for Bitcoin?",
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
        content: "Hello! I'm your crypto assistant powered by AI. How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])

    toast({
      title: "Conversation cleared",
      description: "Starting a fresh conversation.",
    })
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 shadow-2xl"
          >
            <Card className="border-2 border-teal-500/20">
              <CardHeader className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-gradient-to-r from-teal-500 to-emerald-500">
                      <AvatarImage src="/ai-assistant.png" />
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
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex flex-col max-w-[80%] rounded-lg p-3",
                        message.role === "user"
                          ? "ml-auto bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                          : "bg-muted",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 self-end">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex flex-col max-w-[80%] rounded-lg p-3 bg-muted">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm">Analyzing your question...</p>
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
                    className="min-h-0 h-9 resize-none"
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

