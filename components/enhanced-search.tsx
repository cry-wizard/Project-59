"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Loader2, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { apiService } from "@/lib/api-service"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchResult {
  id: string
  name: string
  symbol: string
  market_cap_rank: number
  large?: string
  thumb: string
}

export function EnhancedSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [trendingCoins, setTrendingCoins] = useState<SearchResult[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  // Fetch trending coins on mount
  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        const coins = await apiService.getCoins(1, 5)
        setTrendingCoins(
          coins.map((coin) => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            market_cap_rank: coin.market_cap_rank || 0,
            thumb: coin.image,
          })),
        )
      } catch (error) {
        console.error("Error fetching trending coins:", error)
      }
    }

    fetchTrendingCoins()
  }, [])

  // Search when query changes
  useEffect(() => {
    const searchCoins = async () => {
      if (!debouncedQuery.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const searchResults = await apiService.searchCoins(debouncedQuery)
        setResults(searchResults.slice(0, 8)) // Limit to 8 results
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    }

    searchCoins()
  }, [debouncedQuery])

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleFocus = () => {
    setShowResults(true)
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            placeholder="Search for cryptocurrencies, tokens, NFTs..."
            className="pl-10 pr-10 h-12 bg-black/30 backdrop-blur-md border-teal-500/20 focus-visible:ring-teal-500 rounded-full"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      <AnimatePresence>
        {showResults && (query.trim() || trendingCoins.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-black/80 backdrop-blur-md border border-teal-500/20 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
                  <span className="ml-2 text-muted-foreground">Searching...</span>
                </div>
              ) : query.trim() && results.length > 0 ? (
                <>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Search Results</h3>
                  <div className="space-y-2">
                    {results.map((coin) => (
                      <Link
                        key={coin.id}
                        href={`/coin/${coin.id}`}
                        onClick={() => setShowResults(false)}
                        className="flex items-center p-2 hover:bg-teal-500/10 rounded-lg transition-colors"
                      >
                        <div className="relative h-8 w-8 mr-3">
                          <Image
                            src={coin.large || coin.thumb || "/coin-images/placeholder.png"}
                            alt={coin.name}
                            fill
                            className="rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/coin-images/placeholder.png"
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{coin.name}</span>
                            <span className="text-xs text-muted-foreground">#{coin.market_cap_rank || "N/A"}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{coin.symbol.toUpperCase()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : query.trim() ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No results found for "{query}"</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-4 w-4 text-teal-500 mr-2" />
                    <h3 className="text-sm font-medium text-muted-foreground">Trending Coins</h3>
                  </div>
                  <div className="space-y-2">
                    {trendingCoins.map((coin) => (
                      <Link
                        key={coin.id}
                        href={`/coin/${coin.id}`}
                        onClick={() => setShowResults(false)}
                        className="flex items-center p-2 hover:bg-teal-500/10 rounded-lg transition-colors"
                      >
                        <div className="relative h-8 w-8 mr-3">
                          <Image
                            src={coin.thumb || "/coin-images/placeholder.png"}
                            alt={coin.name}
                            fill
                            className="rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/coin-images/placeholder.png"
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{coin.name}</span>
                            <span className="text-xs text-muted-foreground">#{coin.market_cap_rank || "N/A"}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{coin.symbol.toUpperCase()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="border-t border-teal-500/10 p-2 text-center">
              <Link
                href="/dashboard"
                className="text-xs text-teal-500 hover:text-teal-400 transition-colors"
                onClick={() => setShowResults(false)}
              >
                View all cryptocurrencies
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
