"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, Star, TrendingDown, TrendingUp } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import Link from "next/link"

interface Coin {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
}

// Fallback data for when API calls fail
const fallbackCoins: Record<string, Coin> = {
  bitcoin: {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    image: "/placeholder.svg?height=100&width=100",
    current_price: 65000,
    price_change_percentage_24h: 2.5,
    market_cap: 1250000000000,
    total_volume: 25000000000,
  },
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    image: "/placeholder.svg?height=100&width=100",
    current_price: 3500,
    price_change_percentage_24h: 1.8,
    market_cap: 420000000000,
    total_volume: 15000000000,
  },
  solana: {
    id: "solana",
    name: "Solana",
    symbol: "sol",
    image: "/placeholder.svg?height=100&width=100",
    current_price: 150,
    price_change_percentage_24h: 3.2,
    market_cap: 65000000000,
    total_volume: 3000000000,
  },
  cardano: {
    id: "cardano",
    name: "Cardano",
    symbol: "ada",
    image: "/placeholder.svg?height=100&width=100",
    current_price: 0.45,
    price_change_percentage_24h: -0.8,
    market_cap: 15000000000,
    total_volume: 500000000,
  },
  polkadot: {
    id: "polkadot",
    name: "Polkadot",
    symbol: "dot",
    image: "/placeholder.svg?height=100&width=100",
    current_price: 6.5,
    price_change_percentage_24h: 1.2,
    market_cap: 8500000000,
    total_volume: 350000000,
  },
  ripple: {
    id: "ripple",
    name: "XRP",
    symbol: "xrp",
    image: "/placeholder.svg?height=100&width=100",
    current_price: 0.55,
    price_change_percentage_24h: -0.5,
    market_cap: 30000000000,
    total_volume: 1200000000,
  },
}

export default function Watchlist() {
  const [watchlistCoins, setWatchlistCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [retryCount, setRetryCount] = useState(0)
  const [usingFallbackData, setUsingFallbackData] = useState(false)

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem("watchlist")
    if (savedWatchlist) {
      const parsedWatchlist = JSON.parse(savedWatchlist)
      setWatchlist(parsedWatchlist)

      if (parsedWatchlist.length > 0) {
        fetchWatchlistCoins(parsedWatchlist)
      } else {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Retry fetching if needed and we haven't exceeded retry attempts
    if (retryCount > 0 && retryCount <= 3 && watchlist.length > 0) {
      fetchWatchlistCoins(watchlist)
    }
  }, [retryCount, watchlist])

  // Update the fetchWatchlistCoins function to ensure data is always available
  const fetchWatchlistCoins = async (coinIds: string[]) => {
    if (coinIds.length === 0) {
      setWatchlistCoins([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Always set fallback data first to ensure we have something to display
      const fallbackWatchlistCoins = coinIds.map((id) => fallbackCoins[id]).filter((coin) => coin !== undefined)

      if (fallbackWatchlistCoins.length > 0) {
        setWatchlistCoins(fallbackWatchlistCoins)
        setUsingFallbackData(true)
      }

      // Try to fetch from API in the background
      try {
        const idsParam = coinIds.join(",")
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
          {
            cache: "no-cache",
            headers: {
              Accept: "application/json",
            },
          },
        )

        if (response.ok) {
          const data = await response.json()
          setWatchlistCoins(data)
          setUsingFallbackData(false)
        }
      } catch (error) {
        console.error("Error fetching watchlist coins:", error)
        // We already have fallback data, so just show a toast
        toast({
          title: "Using cached data",
          description: "We're using cached data due to API limitations. Some information may not be up-to-date.",
          variant: "default",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const removeFromWatchlist = (coinId: string) => {
    const newWatchlist = watchlist.filter((id) => id !== coinId)
    setWatchlist(newWatchlist)
    localStorage.setItem("watchlist", JSON.stringify(newWatchlist))

    // Update displayed coins
    setWatchlistCoins((prev) => prev.filter((coin) => coin.id !== coinId))

    toast({
      title: "Removed from watchlist",
      description: "Coin has been removed from your watchlist",
    })
  }

  const refreshWatchlist = () => {
    if (watchlist.length > 0) {
      setRetryCount(0) // Reset retry count
      fetchWatchlistCoins(watchlist)
    }
  }

  return (
    <div className="container py-24">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Watchlist</h1>
        <p className="text-muted-foreground mb-6">Track your favorite cryptocurrencies</p>

        {watchlist.length > 0 && (
          <Button variant="outline" onClick={refreshWatchlist} disabled={loading} className="mb-6">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        )}

        {usingFallbackData && watchlist.length > 0 && (
          <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 p-3 rounded-md mb-6 text-sm max-w-2xl text-center">
            Showing cached data due to API limitations. Click refresh to try again.
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[60px]" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-[120px] mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
        </div>
      ) : watchlistCoins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlistCoins.map((coin) => (
            <Card key={coin.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 relative">
                <button
                  onClick={() => removeFromWatchlist(coin.id)}
                  className="absolute top-4 right-4 text-primary hover:text-primary/80"
                >
                  <Star className="h-5 w-5 fill-primary" />
                </button>

                <Link href={`/coin/${coin.id}`} className="block">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative h-12 w-12">
                      <Image src={coin.image || "/placeholder.svg"} alt={coin.name} fill className="rounded-full" />
                    </div>
                    <div>
                      <h3 className="font-bold">{coin.name}</h3>
                      <p className="text-muted-foreground text-sm">{coin.symbol.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xl font-bold">${coin.current_price.toLocaleString()}</p>
                    <div
                      className={`flex items-center ${coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span className="font-medium">{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Market Cap: ${coin.market_cap.toLocaleString()}</p>
                    <p>Volume: ${coin.total_volume.toLocaleString()}</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Your watchlist is empty</h2>
          <p className="text-muted-foreground mb-6">Add cryptocurrencies to your watchlist to track them here</p>
          <Link href="/dashboard">
            <Button size="lg">Browse Cryptocurrencies</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

