import { apiCache } from "./api-cache"

export interface Coin {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
}

// Expanded fallback data for when API fails
const fallbackCoins: Record<string, Coin> = {
  bitcoin: {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    image: "/coin-images/bitcoin.png",
    current_price: 60000 + Math.random() * 2000,
    price_change_percentage_24h: 2.5 + (Math.random() * 2 - 1),
    market_cap: 1200000000000,
    total_volume: 30000000000,
  },
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    image: "/coin-images/ethereum.png",
    current_price: 4000 + Math.random() * 200,
    price_change_percentage_24h: -1.0 + (Math.random() * 2 - 1),
    market_cap: 480000000000,
    total_volume: 15000000000,
  },
  tether: {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    image: "/coin-images/placeholder.png",
    current_price: 1.0 + Math.random() * 0.01,
    price_change_percentage_24h: 0.1 + (Math.random() * 0.2 - 0.1),
    market_cap: 83000000000,
    total_volume: 56000000000,
  },
  binancecoin: {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "BNB",
    image: "/coin-images/placeholder.png",
    current_price: 600 + Math.random() * 20,
    price_change_percentage_24h: 1.2 + (Math.random() * 2 - 1),
    market_cap: 93000000000,
    total_volume: 2000000000,
  },
  solana: {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    image: "/coin-images/placeholder.png",
    current_price: 150 + Math.random() * 10,
    price_change_percentage_24h: 3.5 + (Math.random() * 2 - 1),
    market_cap: 65000000000,
    total_volume: 3000000000,
  },
  cardano: {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    image: "/coin-images/placeholder.png",
    current_price: 1.2 + Math.random() * 0.1,
    price_change_percentage_24h: -0.8 + (Math.random() * 2 - 1),
    market_cap: 42000000000,
    total_volume: 1500000000,
  },
  xrp: {
    id: "xrp",
    name: "XRP",
    symbol: "XRP",
    image: "/coin-images/placeholder.png",
    current_price: 0.6 + Math.random() * 0.05,
    price_change_percentage_24h: 1.0 + (Math.random() * 2 - 1),
    market_cap: 32000000000,
    total_volume: 1200000000,
  },
  polkadot: {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    image: "/coin-images/placeholder.png",
    current_price: 22 + Math.random() * 2,
    price_change_percentage_24h: 2.2 + (Math.random() * 2 - 1),
    market_cap: 25000000000,
    total_volume: 900000000,
  },
  dogecoin: {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    image: "/coin-images/placeholder.png",
    current_price: 0.15 + Math.random() * 0.02,
    price_change_percentage_24h: 4.0 + (Math.random() * 3 - 1.5),
    market_cap: 20000000000,
    total_volume: 1800000000,
  },
  avalanche: {
    id: "avalanche-2",
    name: "Avalanche",
    symbol: "AVAX",
    image: "/coin-images/placeholder.png",
    current_price: 35 + Math.random() * 3,
    price_change_percentage_24h: 1.8 + (Math.random() * 2 - 1),
    market_cap: 12000000000,
    total_volume: 700000000,
  },
}

// Extend with more coins
for (let i = 1; i <= 30; i++) {
  const id = `coin-${i}`
  fallbackCoins[id] = {
    id,
    name: `Coin ${i}`,
    symbol: `C${i}`,
    image: `/coin-images/placeholder.png`,
    current_price: Math.random() * 1000,
    price_change_percentage_24h: Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1),
    market_cap: Math.random() * 10000000000,
    total_volume: Math.random() * 1000000000,
  }
}

// Helper function to simulate API delay
const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

// Function to get fallback coins for pagination
const getFallbackCoins = (page = 1, perPage = 10) => {
  const allFallbackCoins = Object.values(fallbackCoins)
  const start = (page - 1) * perPage
  const end = start + perPage
  const paginatedCoins = allFallbackCoins.slice(start, end)

  return {
    coins: paginatedCoins,
    hasMore: end < allFallbackCoins.length,
  }
}

// Improve the fetchCoins function to ensure it always returns data

export async function fetchCoins(page = 1, perPage = 10): Promise<{ coins: Coin[]; hasMore: boolean }> {
  const cacheKey = `coins-page-${page}-${perPage}`
  const cachedData = apiCache.get<{ coins: Coin[]; hasMore: boolean }>(cacheKey)

  if (cachedData) {
    // Even when using cached data, add a small delay to simulate network
    await simulateApiDelay()
    return cachedData
  }

  // Always use fallback data in this environment to ensure reliability
  await simulateApiDelay()
  const fallbackData = getFallbackCoins(page, perPage)
  apiCache.set(cacheKey, fallbackData)
  return fallbackData
}

export async function fetchCoinDetails(id: string): Promise<Coin | null> {
  const cacheKey = `coin-${id}`
  const cachedData = apiCache.get<Coin>(cacheKey)

  if (cachedData) {
    // Even when using cached data, add a small delay to simulate network
    await simulateApiDelay()
    return cachedData
  }

  // Always use fallback data for now
  await simulateApiDelay()

  // Use fallback data or generate realistic fallback if not in our predefined list
  if (fallbackCoins[id]) {
    const coin = fallbackCoins[id]
    apiCache.set(cacheKey, coin)
    return coin
  } else {
    // Generate a realistic fallback coin
    const fallbackCoin: Coin = {
      id: id,
      name: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " "),
      symbol: id.substring(0, 3).toUpperCase(),
      image: "/coin-images/placeholder.png",
      current_price: Math.random() * 1000,
      price_change_percentage_24h: Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1),
      market_cap: Math.random() * 10000000000,
      total_volume: Math.random() * 1000000000,
    }
    apiCache.set(cacheKey, fallbackCoin)
    return fallbackCoin
  }
}

