"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { fetchCoinDetails, type Coin } from "@/lib/coin-service"

interface TrackedCoinProps {
  coinId: string
}

export function TrackedCoin({ coinId }: TrackedCoinProps) {
  const [coin, setCoin] = useState<Coin | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const loadCoin = async () => {
      try {
        setLoading(true)
        const data = await fetchCoinDetails(coinId)
        setCoin(data)
      } catch (error) {
        console.error(`Error loading coin ${coinId}:`, error)
      } finally {
        setLoading(false)
      }
    }

    loadCoin()
  }, [coinId])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <Skeleton className="h-6 w-[80px]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!coin) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-muted-foreground">Failed to load coin data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Link href={`/coin/${coin.id}`}>
      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="coin-card border-border hover:border-teal-500/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative h-10 w-10 coin-icon">
                  <Image
                    src={imageError ? "/coin-images/placeholder.png" : `/coin-images/${coin.id}.png`}
                    alt={coin.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                    onError={() => setImageError(true)}
                  />
                </div>
                <div>
                  <p className="font-medium">{coin.name}</p>
                  <p className="text-muted-foreground text-xs">{coin.symbol.toUpperCase()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">${coin.current_price.toLocaleString()}</p>
                <div
                  className={`flex items-center justify-end text-sm ${
                    coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}

