import axios from "axios"
import { apiCache } from "./api-cache"

// Types for our API responses
export interface CoinMarketData {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
}

export interface CoinDetailData {
  id: string
  name: string
  symbol: string
  image: {
    thumb: string
    small: string
    large: string
  }
  market_data: {
    current_price: Record<string, number>
    market_cap: Record<string, number>
    total_volume: Record<string, number>
    high_24h: Record<string, number>
    low_24h: Record<string, number>
    price_change_24h: number
    price_change_percentage_24h: number
    price_change_percentage_7d: number
    price_change_percentage_30d: number
    market_cap_change_24h: number
    market_cap_change_percentage_24h: number
    circulating_supply: number
    total_supply: number | null
    max_supply: number | null
    ath: Record<string, number>
    ath_change_percentage: Record<string, number>
    ath_date: Record<string, string>
    atl: Record<string, number>
    atl_change_percentage: Record<string, number>
    atl_date: Record<string, string>
  }
  description: Record<string, string>
  links: {
    homepage: string[]
    blockchain_site: string[]
    official_forum_url: string[]
    chat_url: string[]
    announcement_url: string[]
    twitter_screen_name: string
    facebook_username: string
    telegram_channel_identifier: string
    subreddit_url: string
  }
}

export interface ChartData {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

// Fallback data for when API calls fail
const fallbackCoins: Record<string, Partial<CoinMarketData>> = {
  bitcoin: {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    image: "/coin-images/bitcoin.png",
    current_price: 65000,
    price_change_percentage_24h: 2.5,
    market_cap: 1250000000000,
    total_volume: 25000000000,
    high_24h: 66500,
    low_24h: 64200,
    market_cap_rank: 1,
  },
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    image: "/coin-images/ethereum.png",
    current_price: 3500,
    price_change_percentage_24h: 1.8,
    market_cap: 420000000000,
    total_volume: 15000000000,
    high_24h: 3550,
    low_24h: 3450,
    market_cap_rank: 2,
  },
  // Add more fallback coins as needed
}

// API service with caching
class ApiService {
  private baseUrl = "https://api.coingecko.com/api/v3"
  private defaultCacheTTL = 5 * 60 * 1000 // 5 minutes in milliseconds

  // Fetch all coins with market data
  async getCoins(page = 1, perPage = 100, currency = "usd"): Promise<CoinMarketData[]> {
    const cacheKey = `coins-page-${page}-${perPage}-${currency}`
    const cachedData = apiCache.get<CoinMarketData[]>(cacheKey)

    if (cachedData) {
      console.log("Using cached coin data")
      return cachedData
    }

    try {
      console.log("Fetching fresh coin data from API")
      const response = await axios.get(
        `${this.baseUrl}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`,
      )

      // Cache the response data
      apiCache.set(cacheKey, response.data, this.defaultCacheTTL)
      return response.data
    } catch (error) {
      console.error("Error fetching coins:", error)

      // Return fallback data if API call fails
      const fallbackData = Object.values(fallbackCoins) as CoinMarketData[]
      return fallbackData
    }
  }

  // Fetch detailed data for a specific coin
  async getCoinDetails(coinId: string): Promise<CoinDetailData | null> {
    const cacheKey = `coin-detail-${coinId}`
    const cachedData = apiCache.get<CoinDetailData>(cacheKey)

    if (cachedData) {
      console.log(`Using cached data for ${coinId}`)
      return cachedData
    }

    try {
      console.log(`Fetching fresh data for ${coinId}`)
      const response = await axios.get(`${this.baseUrl}/coins/${coinId}`)

      // Cache the response data
      apiCache.set(cacheKey, response.data, this.defaultCacheTTL)
      return response.data
    } catch (error) {
      console.error(`Error fetching coin details for ${coinId}:`, error)
      return null
    }
  }

  // Fetch chart data for a specific coin
  async getCoinChartData(coinId: string, days = 30, currency = "usd"): Promise<ChartData | null> {
    const cacheKey = `coin-chart-${coinId}-${days}-${currency}`
    const cachedData = apiCache.get<ChartData>(cacheKey)

    if (cachedData) {
      console.log(`Using cached chart data for ${coinId}`)
      return cachedData
    }

    try {
      console.log(`Fetching fresh chart data for ${coinId}`)
      const response = await axios.get(
        `${this.baseUrl}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`,
      )

      // Cache the response data
      apiCache.set(cacheKey, response.data, this.defaultCacheTTL)
      return response.data
    } catch (error) {
      console.error(`Error fetching chart data for ${coinId}:`, error)
      return null
    }
  }

  // Search for coins
  async searchCoins(query: string): Promise<any[]> {
    const cacheKey = `search-${query}`
    const cachedData = apiCache.get<any[]>(cacheKey)

    if (cachedData) {
      console.log(`Using cached search results for "${query}"`)
      return cachedData
    }

    try {
      console.log(`Searching for "${query}"`)
      const response = await axios.get(`${this.baseUrl}/search?query=${query}`)

      // Cache the response data
      apiCache.set(cacheKey, response.data.coins, this.defaultCacheTTL)
      return response.data.coins
    } catch (error) {
      console.error(`Error searching for "${query}":`, error)
      return []
    }
  }

  // Clear all cached data
  clearCache(): void {
    apiCache.invalidateAll()
  }
}

// Export a singleton instance
export const apiService = new ApiService()
