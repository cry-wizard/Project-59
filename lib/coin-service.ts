import { apiCache } from "./api-cache"
import { imageCacheService } from "./image-cache"
import { fetchMockCoins, fetchMockCoinDetails } from "./mock-coin-service"

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

// Configuration flag to control API behavior
const CONFIG = {
  // Set to true to always use mock data, false to attempt real API first
  ALWAYS_USE_MOCK_DATA: true,
  // Maximum number of retries for API calls
  MAX_API_RETRIES: 2,
  // API request timeout in milliseconds
  API_TIMEOUT: 5000,
}

// Process coin data and handle image caching
const processCoinData = (coin: any): Coin => {
  // Check if we already have a cached image for this coin
  let imageUrl = imageCacheService.getImage(coin.id)

  // If no cached image, use the one from the API response
  if (!imageUrl && coin.image) {
    imageUrl = coin.image
    // Store the image URL in our cache
    imageCacheService.setImage(coin.id, imageUrl)
  }

  // If still no image, use placeholder
  if (!imageUrl) {
    imageUrl = "/coin-images/placeholder.png"
  }

  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    image: imageUrl,
    current_price: coin.current_price,
    price_change_percentage_24h: coin.price_change_percentage_24h,
    market_cap: coin.market_cap,
    total_volume: coin.total_volume,
  }
}

// Updated fetchCoins function with robust error handling and mock data fallback
export async function fetchCoins(page = 1, perPage = 10): Promise<{ coins: Coin[]; hasMore: boolean }> {
  const cacheKey = `coins-page-${page}-${perPage}`
  const cachedData = apiCache.get<{ coins: Coin[]; hasMore: boolean }>(cacheKey)

  if (cachedData) {
    // Update cached data with any new image URLs we might have
    cachedData.coins = cachedData.coins.map((coin) => {
      const cachedImage = imageCacheService.getImage(coin.id)
      if (cachedImage) {
        return { ...coin, image: cachedImage }
      }
      return coin
    })

    return cachedData
  }

  // If configured to always use mock data, don't attempt real API
  if (CONFIG.ALWAYS_USE_MOCK_DATA) {
    console.log("Using mock data as configured")
    const mockData = await fetchMockCoins(page, perPage)

    // Cache the mock result
    apiCache.set(cacheKey, mockData, 5 * 60 * 1000) // Cache for 5 minutes
    return mockData
  }

  // Try to fetch from real API with retries
  for (let attempt = 0; attempt <= CONFIG.MAX_API_RETRIES; attempt++) {
    try {
      // Create an AbortController with timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT)

      console.log(`Attempting to fetch real data (attempt ${attempt + 1}/${CONFIG.MAX_API_RETRIES + 1})`)

      // Use the CoinGecko API to fetch real data
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`,
        {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
        },
      )

      // Clear the timeout
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()

      // Map the API response to our Coin interface and process images
      const coins = data.map(processCoinData)

      const result = {
        coins,
        hasMore: coins.length === perPage, // If we got the full requested amount, there might be more
      }

      // Cache the result
      apiCache.set(cacheKey, result, 5 * 60 * 1000) // Cache for 5 minutes
      return result
    } catch (error) {
      console.error(`Error fetching coins (attempt ${attempt + 1}):`, error)

      // If we've exhausted all retries, fall back to mock data
      if (attempt === CONFIG.MAX_API_RETRIES) {
        console.log("All API attempts failed, using mock data")
        const mockData = await fetchMockCoins(page, perPage)

        // Cache the mock result
        apiCache.set(cacheKey, mockData, 5 * 60 * 1000) // Cache for 5 minutes
        return mockData
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
    }
  }

  // This should never be reached due to the return in the catch block above
  // But TypeScript needs it for type safety
  const fallbackData = await fetchMockCoins(page, perPage)
  return fallbackData
}

// Updated fetchCoinDetails function with better error handling and mock data fallback
export async function fetchCoinDetails(id: string): Promise<Coin | null> {
  const cacheKey = `coin-${id}`
  const cachedData = apiCache.get<Coin>(cacheKey)

  if (cachedData) {
    // Check if we have a newer image in the cache
    const cachedImage = imageCacheService.getImage(id)
    if (cachedImage) {
      return { ...cachedData, image: cachedImage }
    }
    return cachedData
  }

  // If configured to always use mock data, don't attempt real API
  if (CONFIG.ALWAYS_USE_MOCK_DATA) {
    console.log("Using mock data as configured for coin details")
    const mockData = await fetchMockCoinDetails(id)

    if (mockData) {
      // Cache the mock result
      apiCache.set(cacheKey, mockData, 5 * 60 * 1000) // Cache for 5 minutes
    }

    return mockData
  }

  // Try to fetch from real API with retries
  for (let attempt = 0; attempt <= CONFIG.MAX_API_RETRIES; attempt++) {
    try {
      // First check if we already have the image cached
      const cachedImage = imageCacheService.getImage(id)

      // Create an AbortController with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT)

      console.log(`Attempting to fetch real coin details (attempt ${attempt + 1}/${CONFIG.MAX_API_RETRIES + 1})`)

      // Try to get the coin from the markets endpoint
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=1&page=1&sparkline=false`,
        {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
        },
      )

      // Clear the timeout
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()

      if (data && data.length > 0) {
        // Use the cached image if available, otherwise use the one from the API
        const imageUrl = cachedImage || data[0].image

        // If we got a new image from the API, cache it
        if (!cachedImage && data[0].image) {
          imageCacheService.setImage(id, data[0].image)
        }

        const coin = {
          id: data[0].id,
          name: data[0].name,
          symbol: data[0].symbol,
          image: imageUrl, // Use cached or API image
          current_price: data[0].current_price,
          price_change_percentage_24h: data[0].price_change_percentage_24h,
          market_cap: data[0].market_cap,
          total_volume: data[0].total_volume,
        }

        // Cache the result
        apiCache.set(cacheKey, coin, 5 * 60 * 1000) // Cache for 5 minutes
        return coin
      }

      throw new Error("Coin not found in API response")
    } catch (error) {
      console.error(`Error fetching coin details for ${id} (attempt ${attempt + 1}):`, error)

      // If we've exhausted all retries, fall back to mock data
      if (attempt === CONFIG.MAX_API_RETRIES) {
        console.log("All API attempts failed, using mock data for coin details")
        const mockData = await fetchMockCoinDetails(id)

        if (mockData) {
          // Cache the mock result
          apiCache.set(cacheKey, mockData, 5 * 60 * 1000) // Cache for 5 minutes
        }

        return mockData
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
    }
  }

  // This should never be reached due to the return in the catch block above
  // But TypeScript needs it for type safety
  return fetchMockCoinDetails(id)
}
