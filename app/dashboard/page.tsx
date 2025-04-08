"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Star, StarOff, TrendingDown, TrendingUp, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { fetchCoins, type Coin } from "@/lib/coin-service"
import { ThreeScene } from "@/components/three-scene"

export default function Dashboard() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [usingFallbackData, setUsingFallbackData] = useState(false)
  const coinsPerPage = 10

  // Fallback coins data
  const fallbackCoins = Array(coinsPerPage)
    .fill(0)
    .map((_, i) => ({
      id: `fallback-${i}`,
      name: `Coin ${i + 1}`,
      symbol: `C${i + 1}`,
      image: "/coin-images/placeholder.png",
      current_price: Math.random() * 1000,
      price_change_percentage_24h: Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1),
      market_cap: Math.random() * 10000000000,
      total_volume: Math.random() * 1000000000,
    }))

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem("watchlist")
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist))
      } catch (e) {
        console.error("Error parsing watchlist:", e)
        localStorage.removeItem("watchlist")
      }
    }

    loadCoins(1)
  }, [])

  useEffect(() => {
    if (search) {
      const filtered = coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase()),
      )
      setFilteredCoins(filtered)
    } else {
      setFilteredCoins(coins)
    }
  }, [search, coins])

  const loadCoins = async (pageNum: number) => {
    setLoading(true)
    try {
      console.log("Loading coins for page:", pageNum)

      // Fetch coins with built-in fallback to mock data
      const result = await fetchCoins(pageNum, coinsPerPage)

      if (result.coins.length > 0) {
        setCoins(result.coins)
        setFilteredCoins(result.coins)
        setHasMore(result.hasMore)
        setPage(pageNum)

        // Check if we're using mock data
        const isMockData = result.coins.some(
          (coin) => coin.id.includes("fallback") || !coin.image || coin.image.includes("placeholder"),
        )

        setUsingFallbackData(isMockData)

        toast({
          title: isMockData ? "Using simulated data" : "Coins loaded",
          description: isMockData
            ? "We're using simulated cryptocurrency data due to API limitations."
            : `Showing page ${pageNum} of cryptocurrency data`,
          variant: "default",
        })
      } else {
        // If no coins returned, use fallback data
        setCoins(fallbackCoins)
        setFilteredCoins(fallbackCoins)
        setUsingFallbackData(true)

        toast({
          title: "Using fallback data",
          description: "We're using cached data due to API limitations.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error in loadCoins:", error)
      // Use fallback data on error
      setCoins(fallbackCoins)
      setFilteredCoins(fallbackCoins)
      setUsingFallbackData(true)

      toast({
        title: "Using fallback data",
        description: "We're using cached data due to API limitations.",
        variant: "default",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNextPage = () => {
    if (hasMore) {
      loadCoins(page + 1)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      loadCoins(page - 1)
    }
  }

  const toggleWatchlist = (e: React.MouseEvent, coinId: string) => {
    e.preventDefault()
    e.stopPropagation()

    let newWatchlist: string[]

    if (watchlist.includes(coinId)) {
      newWatchlist = watchlist.filter((id) => id !== coinId)
      toast({
        title: "Removed from watchlist",
        description: "Coin has been removed from your watchlist",
      })
    } else {
      newWatchlist = [...watchlist, coinId]
      toast({
        title: "Added to watchlist",
        description: "Coin has been added to your watchlist",
      })
    }

    setWatchlist(newWatchlist)
    localStorage.setItem("watchlist", JSON.stringify(newWatchlist))
  }

  return (
    <div className="relative">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <ThreeScene type="particles" color="#b405f4" className="w-full h-full" />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      </div>

      <div className="container py-24 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <motion.h1
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Cryptocurrency Dashboard
          </motion.h1>
          <motion.p
            className="text-muted-foreground mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Track real-time prices, market caps, and trading volumes
          </motion.p>

          {usingFallbackData && (
            <Alert className="mb-6 max-w-3xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Using simulated data</AlertTitle>
              <AlertDescription>
                We're currently using simulated cryptocurrency data. Real-time API data will be available soon.
              </AlertDescription>
            </Alert>
          )}

          <motion.div
            className="w-full max-w-md mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search coins..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-black/50 border-teal-500/20"
              />
            </div>
          </motion.div>

          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-6">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="w-full">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array(8)
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCoins.map((coin) => (
                    <Link href={`/coin/${coin.id}`} key={coin.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card className="coin-card h-full border border-border hover:border-teal-500/50 bg-black/50 backdrop-blur-md shadow-lg hover:shadow-teal-500/10">
                          <CardContent className="p-6 relative">
                            <button
                              onClick={(e) => toggleWatchlist(e, coin.id)}
                              className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
                            >
                              {watchlist.includes(coin.id) ? (
                                <Star className="h-5 w-5 fill-primary text-primary" />
                              ) : (
                                <StarOff className="h-5 w-5" />
                              )}
                            </button>

                            <div className="flex items-center space-x-4 mb-4">
                              <div className="relative h-12 w-12 coin-icon bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full p-0.5">
                                <Image
                                  src={coin.image || "/coin-images/placeholder.png"}
                                  alt={coin.name}
                                  fill
                                  className="rounded-full p-1"
                                  onError={(e) => {
                                    // Fallback to placeholder if image fails to load
                                    const target = e.target as HTMLImageElement
                                    target.src = "/coin-images/placeholder.png"
                                  }}
                                />
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
                                <span className="font-medium">
                                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>Market Cap: ${coin.market_cap.toLocaleString()}</p>
                              <p>Volume: ${coin.total_volume.toLocaleString()}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="w-full">
              {loading ? (
                <div className="space-y-4">
                  {Array(8)
                    .fill(0)
                    .map((_, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-[100px]" />
                              <Skeleton className="h-4 w-[60px]" />
                            </div>
                            <Skeleton className="h-6 w-[100px]" />
                            <Skeleton className="h-6 w-[80px]" />
                            <Skeleton className="h-6 w-[120px]" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-6 gap-4 px-4 py-2 font-medium text-sm text-muted-foreground">
                    <div className="col-span-2">Coin</div>
                    <div className="text-right">Price</div>
                    <div className="text-right">24h Change</div>
                    <div className="text-right">Market Cap</div>
                    <div className="text-right">Actions</div>
                  </div>

                  {filteredCoins.map((coin) => (
                    <Link href={`/coin/${coin.id}`} key={coin.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-border hover:border-teal-500/50 bg-black/50 backdrop-blur-md">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-6 gap-4 items-center">
                              <div className="col-span-2 flex items-center space-x-3">
                                <div className="relative h-8 w-8 coin-icon">
                                  <Image
                                    src={coin.image || "/coin-images/placeholder.png"}
                                    alt={coin.name}
                                    fill
                                    className="rounded-full"
                                    onError={(e) => {
                                      // Fallback to placeholder if image fails to load
                                      const target = e.target as HTMLImageElement
                                      target.src = "/coin-images/placeholder.png"
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{coin.name}</p>
                                  <p className="text-muted-foreground text-xs">{coin.symbol.toUpperCase()}</p>
                                </div>
                              </div>

                              <div className="text-right font-medium">${coin.current_price.toLocaleString()}</div>

                              <div
                                className={`text-right font-medium ${coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
                              >
                                <div className="flex items-center justify-end">
                                  {coin.price_change_percentage_24h >= 0 ? (
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                  )}
                                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                </div>
                              </div>

                              <div className="text-right text-muted-foreground">
                                ${coin.market_cap.toLocaleString()}
                              </div>

                              <div className="text-right">
                                <Button variant="ghost" size="icon" onClick={(e) => toggleWatchlist(e, coin.id)}>
                                  {watchlist.includes(coin.id) ? (
                                    <Star className="h-5 w-5 fill-primary text-primary" />
                                  ) : (
                                    <StarOff className="h-5 w-5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center w-full max-w-md mt-8">
            <Button
              onClick={handlePrevPage}
              disabled={page === 1 || loading}
              variant="outline"
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {page}</span>
            <Button
              onClick={handleNextPage}
              disabled={!hasMore || loading}
              variant="outline"
              className="flex items-center gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
