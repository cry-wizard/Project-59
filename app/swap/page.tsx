"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ArrowDown, RefreshCw, Wallet, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface Coin {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
}

// Fallback data for when API calls fail
const fallbackCoins: Coin[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    image: "/coin-images/bitcoin.png",
    current_price: 65000,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    image: "/coin-images/ethereum.png",
    current_price: 3500,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "sol",
    image: "/coin-images/solana.png",
    current_price: 150,
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ada",
    image: "/coin-images/cardano.png",
    current_price: 0.45,
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "dot",
    image: "/coin-images/polkadot.png",
    current_price: 6.5,
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "xrp",
    image: "/coin-images/xrp.png",
    current_price: 0.55,
  },
  {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "bnb",
    image: "/coin-images/binancecoin.png",
    current_price: 580,
  },
]

export default function SwapPage() {
  const { user } = useAuth()
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [fromCoin, setFromCoin] = useState<string>("bitcoin")
  const [toCoin, setToCoin] = useState<string>("ethereum")
  const [fromAmount, setFromAmount] = useState<string>("0.1")
  const [toAmount, setToAmount] = useState<string>("")
  const [walletConnected, setWalletConnected] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [swapProgress, setSwapProgress] = useState(0)
  const [swapComplete, setSwapComplete] = useState(false)
  const [usingFallbackData, setUsingFallbackData] = useState(false)

  // Check if wallet is connected
  useEffect(() => {
    const savedAccount = localStorage.getItem("tradexis-wallet-account")
    if (savedAccount) {
      setWalletConnected(true)
    }
  }, [])

  // Fetch coins data
  useEffect(() => {
    fetchCoins()
  }, [])

  // Calculate swap rate when coins or amounts change
  useEffect(() => {
    if (coins.length > 0 && fromAmount) {
      calculateSwapRate()
    }
  }, [fromCoin, toCoin, fromAmount, coins])

  const fetchCoins = async () => {
    try {
      setLoading(true)

      // Always set fallback data first to ensure UI doesn't break
      setCoins(fallbackCoins)
      setUsingFallbackData(true)

      // Try to fetch from API in the background
      try {
        // Use CoinCap API instead of CoinGecko
        const response = await fetch("https://api.coincap.io/v2/assets?limit=20", {
          cache: "no-cache",
        })

        if (response.ok) {
          const data = await response.json()

          if (data && data.data && Array.isArray(data.data)) {
            const formattedCoins = data.data.map((coin: any) => ({
              id: coin.id,
              name: coin.name,
              symbol: coin.symbol.toLowerCase(),
              image: `/coin-images/${coin.id}.png`, // Use local images
              current_price: Number.parseFloat(coin.priceUsd),
            }))

            setCoins(formattedCoins)
            setUsingFallbackData(false)
          }
        }
      } catch (error) {
        console.error("Error fetching coins:", error)
        // We already have fallback data, so no need to handle this error
      }
    } finally {
      setLoading(false)
    }
  }

  const calculateSwapRate = () => {
    const from = coins.find((c) => c.id === fromCoin)
    const to = coins.find((c) => c.id === toCoin)

    if (from && to && fromAmount) {
      const fromValue = Number.parseFloat(fromAmount) * from.current_price
      const toValue = fromValue / to.current_price

      // Add a small random slippage to make it look realistic
      const slippage = 1 - Math.random() * 0.02 // 0-2% slippage
      const finalAmount = toValue * slippage

      setToAmount(finalAmount.toFixed(6))
    }
  }

  const handleFromAmountChange = (value: string) => {
    // Only allow numbers and decimals
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
      setFromAmount(value)
    }
  }

  const handleSwapCoins = () => {
    const temp = fromCoin
    setFromCoin(toCoin)
    setToCoin(temp)
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      })
      return
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      // Only proceed if we got accounts (user didn't reject)
      if (accounts && accounts.length > 0) {
        localStorage.setItem("tradexis-wallet-account", accounts[0])
        setWalletConnected(true)

        toast({
          title: "Wallet connected",
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
        })
      }
    } catch (error: any) {
      console.error("Wallet connection error:", error)

      // Check for user rejection (code 4001)
      if (error.code === 4001) {
        toast({
          title: "Connection cancelled",
          description: "You rejected the connection request",
          variant: "default",
        })
      } else {
        toast({
          title: "Connection failed",
          description: "Failed to connect to MetaMask",
          variant: "destructive",
        })
      }
    }
  }

  const handleSwap = async () => {
    if (!walletConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to swap tokens",
        variant: "destructive",
      })
      return
    }

    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      })
      return
    }

    setSwapping(true)
    setSwapProgress(0)

    // Simulate swap process with progress updates
    const interval = setInterval(() => {
      setSwapProgress((prev) => {
        const next = prev + Math.random() * 15
        return next > 100 ? 100 : next
      })
    }, 500)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 5000))

    clearInterval(interval)
    setSwapProgress(100)

    // Simulate transaction completion
    setTimeout(() => {
      setSwapping(false)
      setSwapComplete(true)

      toast({
        title: "Swap successful",
        description: `Successfully swapped ${fromAmount} ${fromCoin.toUpperCase()} to ${toAmount} ${toCoin.toUpperCase()}`,
      })

      // Reset after a moment
      setTimeout(() => {
        setSwapComplete(false)
        setFromAmount("0.1")
      }, 3000)
    }, 1000)
  }

  const getSelectedCoin = (id: string) => {
    return coins.find((c) => c.id === id) || fallbackCoins.find((c) => c.id === id)
  }

  const fromCoinData = getSelectedCoin(fromCoin)
  const toCoinData = getSelectedCoin(toCoin)

  return (
    <div className="container py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <h1 className="text-3xl font-bold text-center mb-2">Swap Tokens</h1>
        <p className="text-muted-foreground text-center mb-8">Exchange your cryptocurrencies instantly</p>

        {usingFallbackData && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Using simulated data</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <span>We're showing simulated data due to API limitations.</span>
              <Button variant="outline" size="sm" onClick={fetchCoins} className="ml-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-teal-500/20">
          <CardHeader>
            <CardTitle>Swap</CardTitle>
            <CardDescription>Choose tokens and amount to swap</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!walletConnected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4 mb-4"
              >
                <p className="text-sm text-center mb-3">Connect your wallet to start swapping</p>
                <Button
                  onClick={connectWallet}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>From</Label>
                <div className="flex space-x-2">
                  <Select value={fromCoin} onValueChange={setFromCoin} disabled={loading || swapping}>
                    <SelectTrigger className="w-[180px] border-teal-500/20">
                      {loading ? (
                        <div className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-muted animate-pulse mr-2"></div>
                          <div className="h-4 w-20 bg-muted animate-pulse"></div>
                        </div>
                      ) : fromCoinData ? (
                        <div className="flex items-center">
                          <div className="relative h-5 w-5 mr-2 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full p-0.5">
                            <Image
                              src={fromCoinData.image || "/coin-images/placeholder.png"}
                              alt={fromCoinData.name}
                              fill
                              className="rounded-full p-0.5"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement
                                target.src = "/coin-images/placeholder.png"
                              }}
                            />
                          </div>
                          <span>{fromCoinData.symbol.toUpperCase()}</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select token" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {coins.map((coin) => (
                        <SelectItem key={coin.id} value={coin.id} disabled={coin.id === toCoin}>
                          <div className="flex items-center">
                            <div className="relative h-5 w-5 mr-2 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full p-0.5">
                              <Image
                                src={coin.image || "/coin-images/placeholder.png"}
                                alt={coin.name}
                                fill
                                className="rounded-full p-0.5"
                                onError={(e) => {
                                  // Fallback to placeholder if image fails to load
                                  const target = e.target as HTMLImageElement
                                  target.src = "/coin-images/placeholder.png"
                                }}
                              />
                            </div>
                            <span>{coin.symbol.toUpperCase()}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    placeholder="0.0"
                    disabled={loading || swapping}
                    className="flex-1 border-teal-500/20 focus-visible:ring-teal-500"
                  />
                </div>
                {fromCoinData && (
                  <p className="text-xs text-muted-foreground">
                    1 {fromCoinData.symbol.toUpperCase()} = ${fromCoinData.current_price.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwapCoins}
                  disabled={loading || swapping}
                  className="rounded-full h-8 w-8 border-teal-500/20 hover:bg-teal-500/10 hover:text-teal-500"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>To</Label>
                <div className="flex space-x-2">
                  <Select value={toCoin} onValueChange={setToCoin} disabled={loading || swapping}>
                    <SelectTrigger className="w-[180px] border-teal-500/20">
                      {loading ? (
                        <div className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-muted animate-pulse mr-2"></div>
                          <div className="h-4 w-20 bg-muted animate-pulse"></div>
                        </div>
                      ) : toCoinData ? (
                        <div className="flex items-center">
                          <div className="relative h-5 w-5 mr-2 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full p-0.5">
                            <Image
                              src={toCoinData.image || "/coin-images/placeholder.png"}
                              alt={toCoinData.name}
                              fill
                              className="rounded-full p-0.5"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement
                                target.src = "/coin-images/placeholder.png"
                              }}
                            />
                          </div>
                          <span>{toCoinData.symbol.toUpperCase()}</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select token" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {coins.map((coin) => (
                        <SelectItem key={coin.id} value={coin.id} disabled={coin.id === fromCoin}>
                          <div className="flex items-center">
                            <div className="relative h-5 w-5 mr-2 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full p-0.5">
                              <Image
                                src={coin.image || "/coin-images/placeholder.png"}
                                alt={coin.name}
                                fill
                                className="rounded-full p-0.5"
                                onError={(e) => {
                                  // Fallback to placeholder if image fails to load
                                  const target = e.target as HTMLImageElement
                                  target.src = "/coin-images/placeholder.png"
                                }}
                              />
                            </div>
                            <span>{coin.symbol.toUpperCase()}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input type="text" value={toAmount} readOnly placeholder="0.0" className="flex-1 bg-muted" />
                </div>
                {toCoinData && (
                  <p className="text-xs text-muted-foreground">
                    1 {toCoinData.symbol.toUpperCase()} = ${toCoinData.current_price.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <AnimatePresence>
              {swapping && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span>Swapping tokens...</span>
                    <span>{Math.round(swapProgress)}%</span>
                  </div>
                  <Progress value={swapProgress} className="h-2" />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSwap}
              disabled={loading || !fromAmount || Number.parseFloat(fromAmount) <= 0 || swapping || !walletConnected}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 relative overflow-hidden"
            >
              {swapComplete && (
                <motion.div
                  className="absolute inset-0 bg-green-500"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <span className="relative z-10">
                {swapping ? "Swapping..." : swapComplete ? "Swap Complete!" : "Swap"}
              </span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
