"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingDown, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { fetchCoinDetails } from "@/lib/coin-service"
import { imageCacheService } from "@/lib/image-cache"

interface TrackedCoinProps {
  coinId: string
}

export function TrackedCoin({ coinId }: TrackedCoinProps) {
  const [coin, setCoin] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    // First check if we already have the image cached
    const cachedImage = imageCacheService.getImage(coinId)
    if (cachedImage) {
      setImageUrl(cachedImage)
    }

    const loadCoin = async () => {
      try {
        setLoading(true)
        const data = await fetchCoinDetails(coinId)
        setCoin(data)

        // If we got data and it has an image, update our image URL
        if (data && data.image) {
          setImageUrl(data.image)
          // Store in global cache
          imageCacheService.setImage(coinId, data.image)
        }
      } catch (error) {
        console.error("Error loading coin:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCoin()
  }, [coinId])

  // Default placeholder image
  const placeholderImage = "/coin-images/placeholder.png"

  // Handle successful image load
  const handleImageLoad = () => {
    if (imageUrl && coinId) {
      // Ensure the successful image URL is stored in our cache
      imageCacheService.setImage(coinId, imageUrl)
    }
  }

  // Handle image error
  const handleImageError = () => {
    setImageError(true)
    // If image fails to load, use placeholder
    setImageUrl(placeholderImage)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        {loading ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
          </div>
        ) : coin ? (
          <Link href={`/coin/${coin.id}`}>
            <div className="flex items-center space-x-4">
              <div className="relative h-10 w-10 bg-black/30 rounded-full overflow-hidden">
                <Image
                  src={imageError ? placeholderImage : imageUrl || coin.image || placeholderImage}
                  alt={coin.name}
                  fill
                  className="object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
              <div>
                <h3 className="font-medium">{coin.name}</h3>
                <p className="text-sm text-muted-foreground">{coin.symbol.toUpperCase()}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="font-bold">${coin.current_price.toLocaleString()}</p>
              <div
                className={`flex items-center ${
                  coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_24h >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex items-center justify-center h-20">
            <p className="text-muted-foreground">Coin not found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
