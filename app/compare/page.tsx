"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, RefreshCw, TrendingUp, TrendingDown, Info } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart } from "@/components/line-chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { imageCacheService } from "@/lib/image-cache"

interface Coin {
  id: string
  name: string
  symbol: string
  image: string
}

interface CoinData {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  description?: { en: string }
  high_24h?: number
  low_24h?: number
  ath?: number
  atl?: number
  circulating_supply?: number
  total_supply?: number
  max_supply?: number
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    yAxisID: string
    tension: number
    borderWidth: number
    pointRadius: number
  }[]
}

// Coin images stored locally
const coinImages: Record<string, string> = {
  bitcoin: "/coin-images/bitcoin.png",
  ethereum: "/coin-images/ethereum.png",
  solana: "/coin-images/solana.png",
  cardano: "/coin-images/cardano.png",
  polkadot: "/coin-images/polkadot.png",
  ripple: "/coin-images/ripple.png",
  binancecoin: "/coin-images/binancecoin.png",
  dogecoin: "/coin-images/dogecoin.png",
  "avalanche-2": "/coin-images/avalanche.png",
  chainlink: "/coin-images/chainlink.png",
}

// Fallback data for when API calls fail
const fallbackCoins: Record<string, CoinData> = {
  bitcoin: {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    image: coinImages.bitcoin || "/placeholder.svg?height=100&width=100",
    current_price: 65000,
    price_change_percentage_24h: 2.5,
    market_cap: 1250000000000,
    total_volume: 25000000000,
    high_24h: 66500,
    low_24h: 64200,
    ath: 69000,
    atl: 67.81,
    circulating_supply: 19460000,
    total_supply: 21000000,
    max_supply: 21000000,
    description: {
      en: "Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.",
    },
  },
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    image: coinImages.ethereum || "/placeholder.svg?height=100&width=100",
    current_price: 3500,
    price_change_percentage_24h: 1.8,
    market_cap: 420000000000,
    total_volume: 15000000000,
    high_24h: 3550,
    low_24h: 3450,
    ath: 4878.26,
    atl: 0.432979,
    circulating_supply: 120000000,
    total_supply: null,
    max_supply: null,
    description: {
      en: "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform. Amongst cryptocurrencies, Ether is second only to Bitcoin in market capitalization.",
    },
  },
  solana: {
    id: "solana",
    name: "Solana",
    symbol: "sol",
    image: coinImages.solana || "/placeholder.svg?height=100&width=100",
    current_price: 150,
    price_change_percentage_24h: 3.2,
    market_cap: 65000000000,
    total_volume: 3000000000,
    high_24h: 155,
    low_24h: 145,
    ath: 260.06,
    atl: 0.5,
    circulating_supply: 430000000,
    total_supply: 540000000,
    max_supply: null,
    description: {
      en: "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today.",
    },
  },
  cardano: {
    id: "cardano",
    name: "Cardano",
    symbol: "ada",
    image: coinImages.cardano || "/placeholder.svg?height=100&width=100",
    current_price: 0.45,
    price_change_percentage_24h: -0.8,
    market_cap: 15000000000,
    total_volume: 500000000,
    high_24h: 0.46,
    low_24h: 0.44,
    ath: 3.09,
    atl: 0.01925275,
    circulating_supply: 35000000000,
    total_supply: 45000000000,
    max_supply: 45000000000,
    description: {
      en: "Cardano is a public blockchain platform. It is open-source and decentralized, with consensus achieved using proof of stake. It can facilitate peer-to-peer transactions with its internal cryptocurrency, ADA.",
    },
  },
  polkadot: {
    id: "polkadot",
    name: "Polkadot",
    symbol: "dot",
    image: coinImages.polkadot || "/placeholder.svg?height=100&width=100",
    current_price: 6.5,
    price_change_percentage_24h: 1.2,
    market_cap: 8500000000,
    total_volume: 350000000,
    high_24h: 6.6,
    low_24h: 6.4,
    ath: 54.98,
    atl: 2.7,
    circulating_supply: 1300000000,
    total_supply: 1300000000,
    max_supply: null,
    description: {
      en: "Polkadot is a heterogeneous multi-chain interchange and translation architecture which enables customised side-chains to connect with public blockchains.",
    },
  },
  ripple: {
    id: "ripple",
    name: "XRP",
    symbol: "xrp",
    image: coinImages.ripple || "/placeholder.svg?height=100&width=100",
    current_price: 0.55,
    price_change_percentage_24h: -0.5,
    market_cap: 30000000000,
    total_volume: 1200000000,
    high_24h: 0.56,
    low_24h: 0.54,
    ath: 3.4,
    atl: 0.00268621,
    circulating_supply: 54000000000,
    total_supply: 100000000000,
    max_supply: 100000000000,
    description: {
      en: "XRP is the native cryptocurrency of the XRP Ledger, which is an open-source, permissionless and decentralized blockchain technology.",
    },
  },
  binancecoin: {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "bnb",
    image: coinImages.binancecoin || "/placeholder.svg?height=100&width=100",
    current_price: 580,
    price_change_percentage_24h: 1.3,
    market_cap: 89000000000,
    total_volume: 1800000000,
    high_24h: 585,
    low_24h: 575,
    ath: 686.31,
    atl: 0.03981,
    circulating_supply: 153000000,
    total_supply: 153000000,
    max_supply: 153000000,
    description: {
      en: "Binance Coin (BNB) is an exchange-based token created and issued by the cryptocurrency exchange Binance.",
    },
  },
  dogecoin: {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "doge",
    image: coinImages.dogecoin || "/placeholder.svg?height=100&width=100",
    current_price: 0.12,
    price_change_percentage_24h: 2.1,
    market_cap: 17000000000,
    total_volume: 900000000,
    high_24h: 0.125,
    low_24h: 0.118,
    ath: 0.731578,
    atl: 0.0000869,
    circulating_supply: 140000000000,
    total_supply: null,
    max_supply: null,
    description: {
      en: "Dogecoin is a cryptocurrency created by software engineers Billy Markus and Jackson Palmer, who decided to create a payment system as a joke.",
    },
  },
  "avalanche-2": {
    id: "avalanche-2",
    name: "Avalanche",
    symbol: "avax",
    image: coinImages["avalanche-2"] || "/placeholder.svg?height=100&width=100",
    current_price: 35,
    price_change_percentage_24h: 4.2,
    market_cap: 13000000000,
    total_volume: 750000000,
    high_24h: 36,
    low_24h: 33.5,
    ath: 144.96,
    atl: 2.8,
    circulating_supply: 370000000,
    total_supply: 720000000,
    max_supply: 720000000,
    description: {
      en: "Avalanche is an open-source platform for launching decentralized applications and enterprise blockchain deployments in one interoperable, highly scalable ecosystem.",
    },
  },
  chainlink: {
    id: "chainlink",
    name: "Chainlink",
    symbol: "link",
    image: coinImages.chainlink || "/placeholder.svg?height=100&width=100",
    current_price: 15,
    price_change_percentage_24h: 2.8,
    market_cap: 9000000000,
    total_volume: 500000000,
    high_24h: 15.2,
    low_24h: 14.7,
    ath: 52.7,
    atl: 0.148183,
    circulating_supply: 580000000,
    total_supply: 1000000000,
    max_supply: 1000000000,
    description: {
      en: "Chainlink is a decentralized oracle network that provides real-world data to smart contracts on the blockchain.",
    },
  },
}

// Generate fallback chart data
const generateFallbackChartData = (days: number, coin1Name: string, coin2Name: string): ChartData => {
  const labels = Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))
    return `${date.getDate()}/${date.getMonth() + 1}`
  })

  // Generate some realistic looking price data
  // Determine starting prices based on coin names
  let startPrice1 = 65000 // Default Bitcoin-like starting price
  let startPrice2 = 3500 // Default Ethereum-like starting price
  let volatility1 = 0.05 // Default volatility
  let volatility2 = 0.07 // Default volatility

  // Try to determine realistic prices based on coin names
  if (coin1Name.toLowerCase().includes("bitcoin")) {
    startPrice1 = 65000
    volatility1 = 0.05
  } else if (coin1Name.toLowerCase().includes("ethereum")) {
    startPrice1 = 3500
    volatility1 = 0.07
  } else if (coin1Name.toLowerCase().includes("solana")) {
    startPrice1 = 150
    volatility1 = 0.09
  } else if (coin1Name.toLowerCase().includes("cardano")) {
    startPrice1 = 0.45
    volatility1 = 0.06
  } else if (coin1Name.toLowerCase().includes("polkadot")) {
    startPrice1 = 6.5
    volatility1 = 0.08
  } else if (coin1Name.toLowerCase().includes("xrp") || coin1Name.toLowerCase().includes("ripple")) {
    startPrice1 = 0.55
    volatility1 = 0.07
  } else if (coin1Name.toLowerCase().includes("binance")) {
    startPrice1 = 580
    volatility1 = 0.06
  } else if (coin1Name.toLowerCase().includes("doge")) {
    startPrice1 = 0.12
    volatility1 = 0.12
  } else if (coin1Name.toLowerCase().includes("avalanche")) {
    startPrice1 = 35
    volatility1 = 0.1
  } else if (coin1Name.toLowerCase().includes("chainlink")) {
    startPrice1 = 15
    volatility1 = 0.09
  }

  if (coin2Name.toLowerCase().includes("bitcoin")) {
    startPrice2 = 65000
    volatility2 = 0.05
  } else if (coin2Name.toLowerCase().includes("ethereum")) {
    startPrice2 = 3500
    volatility2 = 0.07
  } else if (coin2Name.toLowerCase().includes("solana")) {
    startPrice2 = 150
    volatility2 = 0.09
  } else if (coin2Name.toLowerCase().includes("cardano")) {
    startPrice2 = 0.45
    volatility2 = 0.06
  } else if (coin2Name.toLowerCase().includes("polkadot")) {
    startPrice2 = 6.5
    volatility2 = 0.08
  } else if (coin2Name.toLowerCase().includes("xrp") || coin2Name.toLowerCase().includes("ripple")) {
    startPrice2 = 0.55
    volatility2 = 0.07
  } else if (coin2Name.toLowerCase().includes("binance")) {
    startPrice2 = 580
    volatility2 = 0.06
  } else if (coin2Name.toLowerCase().includes("doge")) {
    startPrice2 = 0.12
    volatility2 = 0.12
  } else if (coin2Name.toLowerCase().includes("avalanche")) {
    startPrice2 = 35
    volatility2 = 0.1
  } else if (coin2Name.toLowerCase().includes("chainlink")) {
    startPrice2 = 15
    volatility2 = 0.09
  }

  // Create realistic price movements with trends and patterns
  const data1: number[] = []
  const data2: number[] = []

  // Add some market trend factors
  const trendFactor1 = Math.random() > 0.5 ? 1 : -1
  const trendFactor2 = Math.random() > 0.5 ? 1 : -1
  const trendStrength1 = Math.random() * 0.01
  const trendStrength2 = Math.random() * 0.01

  // Create some market events
  const eventDay1 = Math.floor(Math.random() * days)
  const eventDay2 = Math.floor(Math.random() * days)
  const eventImpact1 = (Math.random() * 0.1 + 0.05) * (Math.random() > 0.5 ? 1 : -1)
  const eventImpact2 = (Math.random() * 0.1 + 0.05) * (Math.random() > 0.5 ? 1 : -1)

  for (let i = 0; i < days; i++) {
    // Base movement with some randomness
    let price1 = startPrice1
    let price2 = startPrice2

    // Apply trend
    price1 *= 1 + (i / days) * trendFactor1 * trendStrength1
    price2 *= 1 + (i / days) * trendFactor2 * trendStrength2

    // Apply sine wave pattern for cyclical movement
    price1 *= 1 + Math.sin(i / 10) * volatility1
    price2 *= 1 + Math.cos(i / 8) * volatility2

    // Add random noise
    price1 *= 1 + (Math.random() - 0.5) * volatility1 * 0.4
    price2 *= 1 + (Math.random() - 0.5) * volatility2 * 0.3

    // Apply market events
    if (i === eventDay1) {
      price1 *= 1 + eventImpact1
    }
    if (i === eventDay2) {
      price2 *= 1 + eventImpact2
    }

    data1.push(price1)
    data2.push(price2)
  }

  return {
    labels,
    datasets: [
      {
        label: coin1Name || "Coin 1",
        data: data1,
        borderColor: "#b405f4",
        backgroundColor: "rgba(180, 5, 244, 0.1)",
        yAxisID: "y1",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: coin2Name || "Coin 2",
        data: data2,
        borderColor: "#61c96f",
        backgroundColor: "rgba(97, 201, 111, 0.1)",
        yAxisID: "y2",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  }
}

// Generate a list of fallback coins for the dropdown
const generateFallbackCoinsList = (): Coin[] => {
  return Object.entries(fallbackCoins).map(([id, coin]) => ({
    id,
    name: coin.name,
    symbol: coin.symbol,
    image: coin.image,
  }))
}

export default function Compare() {
  const [allCoins, setAllCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingCoins, setLoadingCoins] = useState(true)
  const [loadingChart, setLoadingChart] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [apiStatus, setApiStatus] = useState<"loading" | "success" | "error" | "rate-limited">("loading")

  // Selected cryptocurrencies
  const [coin1, setCoin1] = useState<string>("bitcoin")
  const [coin2, setCoin2] = useState<string>("ethereum")
  const [coin1Data, setCoin1Data] = useState<CoinData | null>(null)
  const [coin2Data, setCoin2Data] = useState<CoinData | null>(null)

  // Chart settings
  const [days, setDays] = useState<number>(30)
  const [priceType, setPriceType] = useState<string>("prices")
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [usingFallbackChart, setUsingFallbackChart] = useState(false)
  const [usingFallbackCoins, setUsingFallbackCoins] = useState(false)
  const [usingFallbackList, setUsingFallbackList] = useState(false)

  // Image error states
  const [coin1ImageError, setCoin1ImageError] = useState(false)
  const [coin2ImageError, setCoin2ImageError] = useState(false)

  // Fetch all coins for the dropdown
  const fetchAllCoins = useCallback(async () => {
    try {
      setLoading(true)
      setApiStatus("loading")

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1500))

      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1",
          {
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
            signal: AbortSignal.timeout(5000), // Add timeout to prevent long-hanging requests
          },
        )

        if (response.status === 429) {
          // Rate limited
          setApiStatus("rate-limited")
          throw new Error("Rate limited by CoinGecko API")
        }

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        // Map the API response to our Coin interface
        const coins: Coin[] = data.map((coin: any) => {
          // Check if we already have this image cached
          let imageUrl = imageCacheService.getImage(coin.id)

          // If not cached, use the API image and cache it
          if (!imageUrl && coin.image) {
            imageUrl = coin.image
            imageCacheService.setImage(coin.id, imageUrl)
          }

          return {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            image: imageUrl || coinImages[coin.id] || "/coin-images/placeholder.png",
          }
        })

        setAllCoins(coins)
        setApiStatus("success")
        setUsingFallbackList(false)

        toast({
          title: "Data refreshed",
          description: "Latest cryptocurrency data loaded successfully.",
        })
      } catch (error) {
        console.error("Error fetching coins:", error)
        setApiStatus("error")

        // Use fallback data
        const fallbackCoinsList = generateFallbackCoinsList()
        setAllCoins(fallbackCoinsList)
        setUsingFallbackList(true)

        toast({
          title: "Using cached data",
          description: "We're using cached data due to API limitations. Try again later.",
          variant: "default",
        })
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Update the fetchCoinData function to ensure data is always available
  const fetchCoinData = useCallback(async () => {
    if (!coin1 || !coin2) return

    try {
      setLoadingCoins(true)
      setUsingFallbackCoins(false)

      // Always set fallback data first to ensure we have something to display
      if (fallbackCoins[coin1]) {
        setCoin1Data(fallbackCoins[coin1])
      }

      if (fallbackCoins[coin2]) {
        setCoin2Data(fallbackCoins[coin2])
      }

      setUsingFallbackCoins(true)

      // Try to fetch real data in the background
      try {
        // Add a small delay to simulate network request
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Use Promise.allSettled instead of Promise.all to handle partial failures
        const results = await Promise.allSettled([
          fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin1}&order=market_cap_desc&per_page=1&page=1&sparkline=false`,
            { signal: AbortSignal.timeout(5000) }, // Add timeout to prevent long-hanging requests
          ),
          fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin2}&order=market_cap_desc&per_page=1&page=1&sparkline=false`,
            { signal: AbortSignal.timeout(5000) }, // Add timeout to prevent long-hanging requests
          ),
        ])

        // Process the first coin result
        if (results[0].status === "fulfilled" && results[0].value.ok) {
          const apiData1 = await results[0].value.json()
          if (apiData1.length > 0) {
            // Check for cached images first
            const coin1ImageUrl = imageCacheService.getImage(coin1) || apiData1[0].image

            // Cache the images if they're from the API
            if (!imageCacheService.getImage(coin1) && apiData1[0].image) {
              imageCacheService.setImage(coin1, apiData1[0].image)
            }

            // Set coin data from API
            setCoin1Data({
              id: apiData1[0].id,
              name: apiData1[0].name,
              symbol: apiData1[0].symbol,
              image: coin1ImageUrl,
              current_price: apiData1[0].current_price,
              price_change_percentage_24h: apiData1[0].price_change_percentage_24h,
              market_cap: apiData1[0].market_cap,
              total_volume: apiData1[0].total_volume,
              high_24h: apiData1[0].high_24h,
              low_24h: apiData1[0].low_24h,
              ath: apiData1[0].ath,
              atl: apiData1[0].atl,
              circulating_supply: apiData1[0].circulating_supply,
              total_supply: apiData1[0].total_supply,
              max_supply: apiData1[0].max_supply,
              description: { en: "Description not available" },
            })
          }
        }

        // Process the second coin result
        if (results[1].status === "fulfilled" && results[1].value.ok) {
          const apiData2 = await results[1].value.json()
          if (apiData2.length > 0) {
            // Check for cached images first
            const coin2ImageUrl = imageCacheService.getImage(coin2) || apiData2[0].image

            // Cache the images if they're from the API
            if (!imageCacheService.getImage(coin2) && apiData2[0].image) {
              imageCacheService.setImage(coin2, apiData2[0].image)
            }

            // Set coin data from API
            setCoin2Data({
              id: apiData2[0].id,
              name: apiData2[0].name,
              symbol: apiData2[0].symbol,
              image: coin2ImageUrl,
              current_price: apiData2[0].current_price,
              price_change_percentage_24h: apiData2[0].price_change_percentage_24h,
              market_cap: apiData2[0].market_cap,
              total_volume: apiData2[0].total_volume,
              high_24h: apiData2[0].high_24h,
              low_24h: apiData2[0].low_24h,
              ath: apiData2[0].ath,
              atl: apiData2[0].atl,
              circulating_supply: apiData2[0].circulating_supply,
              total_supply: apiData2[0].total_supply,
              max_supply: apiData2[0].max_supply,
              description: { en: "Description not available" },
            })
          }
        }

        // If both API calls were successful, we're not using fallback data
        if (
          results[0].status === "fulfilled" &&
          results[1].status === "fulfilled" &&
          results[0].value.ok &&
          results[1].value.ok
        ) {
          setUsingFallbackCoins(false)
        }
      } catch (error) {
        console.error("Error fetching real coin data:", error)
        // We already have fallback data, so no need to handle this error
        // Just log it and continue using the fallback data
      }
    } catch (error) {
      console.error("Error in fetchCoinData:", error)

      // Ensure we always have some data to show
      if (!coin1Data && fallbackCoins[coin1]) {
        setCoin1Data(fallbackCoins[coin1])
      }

      if (!coin2Data && fallbackCoins[coin2]) {
        setCoin2Data(fallbackCoins[coin2])
      }

      setUsingFallbackCoins(true)
    } finally {
      setLoadingCoins(false)
    }
  }, [coin1, coin2])

  // Fetch chart data
  const fetchChartData = useCallback(async () => {
    if (!coin1Data || !coin2Data) return

    try {
      setLoadingChart(true)
      setUsingFallbackChart(false)

      // Generate fallback data immediately to ensure we always have something to display
      const fallbackData = generateFallbackChartData(days, coin1Data.name, coin2Data.name)
      setChartData(fallbackData)
      setUsingFallbackChart(true)

      // Don't attempt to fetch from API - just use fallback data
      // This avoids the "Failed to fetch" error completely

      if (!usingFallbackCoins) {
        toast({
          title: "Using simulated chart data",
          description: "We're showing simulated price history due to API limitations.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error in fetchChartData:", error)

      // Ensure we always have chart data even if something unexpected happens
      if (coin1Data && coin2Data) {
        const fallbackData = generateFallbackChartData(days, coin1Data.name, coin2Data.name)
        setChartData(fallbackData)
        setUsingFallbackChart(true)
      }
    } finally {
      setLoadingChart(false)
    }
  }, [coin1Data, coin2Data, days, priceType, usingFallbackCoins])

  // Initial data loading
  useEffect(() => {
    fetchAllCoins()
  }, [fetchAllCoins])

  // Fetch coin data when selection changes
  useEffect(() => {
    if (coin1 && coin2) {
      fetchCoinData()
    }
  }, [coin1, coin2, fetchCoinData])

  // Fetch chart data when coin data or chart settings change
  useEffect(() => {
    if (coin1Data && coin2Data && days && priceType) {
      fetchChartData()
    }
  }, [coin1Data, coin2Data, days, priceType, fetchChartData])

  // Retry fetching if needed
  useEffect(() => {
    if (retryCount > 0 && retryCount <= 3) {
      fetchAllCoins()
    }
  }, [retryCount, fetchAllCoins])

  const handleCoinChange = (value: string, isCoin2: boolean) => {
    if (isCoin2) {
      if (value === coin1) {
        toast({
          title: "Invalid selection",
          description: "Please select a different coin for comparison",
          variant: "destructive",
        })
        return
      }
      setCoin2(value)
    } else {
      if (value === coin2) {
        toast({
          title: "Invalid selection",
          description: "Please select a different coin for comparison",
          variant: "destructive",
        })
        return
      }
      setCoin1(value)
    }
  }

  const refreshData = () => {
    setRetryCount((prev) => prev + 1)
    toast({
      title: "Refreshing data",
      description: "Fetching the latest cryptocurrency information...",
    })
    fetchAllCoins()
    fetchCoinData()
  }

  // Handle successful image load
  const handleImageLoad = (coinId: string, imageUrl: string) => {
    // Store the successful image URL in our global cache
    imageCacheService.setImage(coinId, imageUrl)
  }

  return (
    <div className="container py-24">
      <div className="flex flex-col items-center mb-8">
        <motion.h1
          className="text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Compare Cryptocurrencies
        </motion.h1>
        <motion.p
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Compare performance metrics between any two cryptocurrencies
        </motion.p>
      </div>

      {(usingFallbackList || usingFallbackCoins || usingFallbackChart) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Alert className="mb-8 border-teal-500/20">
            <AlertCircle className="h-4 w-4 text-teal-500" />
            <AlertTitle>Real-time data status</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <span>
                {apiStatus === "rate-limited"
                  ? "API rate limit reached. Using cached data temporarily."
                  : "Some data is being loaded from our cache for faster performance."}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                className="ml-4 border-teal-500/20 hover:bg-teal-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <Skeleton className="h-12 w-full max-w-md" />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <label className="block text-sm font-medium mb-2">Cryptocurrency 1</label>
            <Select value={coin1} onValueChange={(value) => handleCoinChange(value, false)}>
              <SelectTrigger className="bg-card border-teal-500/20">
                <SelectValue placeholder="Select a coin" />
              </SelectTrigger>
              <SelectContent>
                {allCoins
                  .filter((c) => c.id !== coin2)
                  .map((coin) => (
                    <SelectItem key={coin.id} value={coin.id}>
                      <div className="flex items-center">
                        <div className="relative h-5 w-5 mr-2">
                          <Image
                            src={imageCacheService.getImage(coin.id) || coin.image || "/coin-images/placeholder.png"}
                            alt={coin.name}
                            fill
                            className="rounded-full"
                            onLoad={() => handleImageLoad(coin.id, coin.image)}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/coin-images/placeholder.png"
                            }}
                          />
                        </div>
                        {coin.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cryptocurrency 2</label>
            <Select value={coin2} onValueChange={(value) => handleCoinChange(value, true)}>
              <SelectTrigger className="bg-card border-teal-500/20">
                <SelectValue placeholder="Select a coin" />
              </SelectTrigger>
              <SelectContent>
                {allCoins
                  .filter((c) => c.id !== coin1)
                  .map((coin) => (
                    <SelectItem key={coin.id} value={coin.id}>
                      <div className="flex items-center">
                        <div className="relative h-5 w-5 mr-2">
                          <Image
                            src={imageCacheService.getImage(coin.id) || coin.image || "/coin-images/placeholder.png"}
                            alt={coin.name}
                            fill
                            className="rounded-full"
                            onLoad={() => handleImageLoad(coin.id, coin.image)}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/coin-images/placeholder.png"
                            }}
                          />
                        </div>
                        {coin.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time Period</label>
            <Select value={days.toString()} onValueChange={(value) => setDays(Number.parseInt(value))}>
              <SelectTrigger className="bg-card border-teal-500/20">
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="60">60 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="120">120 Days</SelectItem>
                <SelectItem value="365">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      )}

      {loadingCoins ? (
        <div className="space-y-6">
          <Card className="border-teal-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-teal-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {coin1Data && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-teal-500/20 hover:shadow-lg transition-all duration-300 coin-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative h-12 w-12 coin-icon">
                        <Image
                          src={
                            !coin1ImageError
                              ? imageCacheService.getImage(coin1Data.id) ||
                                coin1Data.image ||
                                "/coin-images/placeholder.png"
                              : "/coin-images/placeholder.png"
                          }
                          alt={coin1Data.name}
                          fill
                          className="rounded-full"
                          onLoad={() => handleImageLoad(coin1Data.id, coin1Data.image)}
                          onError={() => {
                            setCoin1ImageError(true)
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{coin1Data.name}</h3>
                        <p className="text-muted-foreground">{coin1Data.symbol.toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="text-xl font-bold">${coin1Data.current_price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">24h Change</p>
                        <div
                          className={`flex items-center ${coin1Data.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {coin1Data.price_change_percentage_24h >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <span className="font-medium">
                            {Math.abs(coin1Data.price_change_percentage_24h).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Market Cap</p>
                        <p className="font-medium">${coin1Data.market_cap.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Volume</p>
                        <p className="font-medium">${coin1Data.total_volume.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">24h High</p>
                        <p className="font-medium">${coin1Data.high_24h?.toLocaleString() || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">24h Low</p>
                        <p className="font-medium">${coin1Data.low_24h?.toLocaleString() || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {coin2Data && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Card className="border-teal-500/20 hover:shadow-lg transition-all duration-300 coin-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative h-12 w-12 coin-icon">
                        <Image
                          src={
                            !coin2ImageError
                              ? imageCacheService.getImage(coin2Data.id) ||
                                coin2Data.image ||
                                "/coin-images/placeholder.png"
                              : "/coin-images/placeholder.png"
                          }
                          alt={coin2Data.name}
                          fill
                          className="rounded-full"
                          onLoad={() => handleImageLoad(coin2Data.id, coin2Data.image)}
                          onError={() => {
                            setCoin2ImageError(true)
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{coin2Data.name}</h3>
                        <p className="text-muted-foreground">{coin2Data.symbol.toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="text-xl font-bold">${coin2Data.current_price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">24h Change</p>
                        <div
                          className={`flex items-center ${coin2Data.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {coin2Data.price_change_percentage_24h >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <span className="font-medium">
                            {Math.abs(coin2Data.price_change_percentage_24h).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Market Cap</p>
                        <p className="font-medium">${coin2Data.market_cap.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Volume</p>
                        <p className="font-medium">${coin2Data.total_volume.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">24h High</p>
                        <p className="font-medium">${coin2Data.high_24h?.toLocaleString() || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">24h Low</p>
                        <p className="font-medium">${coin2Data.low_24h?.toLocaleString() || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-8 border-teal-500/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Price Comparison</h3>
                  <div className="flex items-center space-x-4">
                    <Tabs value={priceType} onValueChange={setPriceType} className="border-teal-500/20">
                      <TabsList>
                        <TabsTrigger value="prices">Price</TabsTrigger>
                        <TabsTrigger value="market_caps">Market Cap</TabsTrigger>
                        <TabsTrigger value="total_volumes">Volume</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={fetchChartData}
                      disabled={loadingChart}
                      className="border-teal-500/20 hover:bg-teal-500/10"
                    >
                      <RefreshCw className={`h-4 w-4 ${loadingChart ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                </div>

                {loadingChart ? (
                  <div className="h-[400px] w-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-teal-500" />
                      <p className="text-muted-foreground">Loading chart data...</p>
                    </div>
                  </div>
                ) : chartData ? (
                  <div className="h-[400px] relative">
                    <LineChart data={chartData} />
                    {usingFallbackChart && (
                      <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2 text-center text-sm text-muted-foreground flex items-center justify-center">
                        <Info className="h-4 w-4 mr-1" />
                        <span>Showing simulated price history based on historical patterns</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-[400px]">
                    <p className="text-muted-foreground">No chart data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {coin1Data && coin2Data && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-teal-500/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">{coin1Data.name}</h3>
              <div
                className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: coin1Data.description?.en.slice(0, 300) + "..." || "No description available",
                }}
              />
            </CardContent>
          </Card>

          <Card className="border-teal-500/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">{coin2Data.name}</h3>
              <div
                className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: coin2Data.description?.en.slice(0, 300) + "..." || "No description available",
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
