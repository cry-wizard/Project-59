import { imageCacheService } from "./image-cache"

// Define the Coin interface (same as in coin-service.ts)
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

// Mock coin data with realistic values
const mockCoins: Coin[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 60000 + Math.random() * 2000,
    price_change_percentage_24h: 2.5 + (Math.random() * 2 - 1),
    market_cap: 1200000000000,
    total_volume: 30000000000,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 4000 + Math.random() * 200,
    price_change_percentage_24h: -1.0 + (Math.random() * 2 - 1),
    market_cap: 480000000000,
    total_volume: 15000000000,
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "usdt",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1.0 + Math.random() * 0.01,
    price_change_percentage_24h: 0.1 + (Math.random() * 0.2 - 0.1),
    market_cap: 83000000000,
    total_volume: 56000000000,
  },
  {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "bnb",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 600 + Math.random() * 20,
    price_change_percentage_24h: 1.2 + (Math.random() * 2 - 1),
    market_cap: 93000000000,
    total_volume: 2000000000,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "sol",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 150 + Math.random() * 10,
    price_change_percentage_24h: 3.5 + (Math.random() * 2 - 1),
    market_cap: 65000000000,
    total_volume: 3000000000,
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ada",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 1.2 + Math.random() * 0.1,
    price_change_percentage_24h: -0.8 + (Math.random() * 2 - 1),
    market_cap: 42000000000,
    total_volume: 1500000000,
  },
  {
    id: "xrp",
    name: "XRP",
    symbol: "xrp",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.6 + Math.random() * 0.05,
    price_change_percentage_24h: 1.0 + (Math.random() * 2 - 1),
    market_cap: 32000000000,
    total_volume: 1200000000,
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "dot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    current_price: 22 + Math.random() * 2,
    price_change_percentage_24h: 2.2 + (Math.random() * 2 - 1),
    market_cap: 25000000000,
    total_volume: 900000000,
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "doge",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.15 + Math.random() * 0.02,
    price_change_percentage_24h: 4.0 + (Math.random() * 3 - 1.5),
    market_cap: 20000000000,
    total_volume: 1800000000,
  },
  {
    id: "avalanche-2",
    name: "Avalanche",
    symbol: "avax",
    image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    current_price: 35 + Math.random() * 3,
    price_change_percentage_24h: 1.8 + (Math.random() * 2 - 1),
    market_cap: 12000000000,
    total_volume: 700000000,
  },
  {
    id: "chainlink",
    name: "Chainlink",
    symbol: "link",
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    current_price: 15 + Math.random() * 1,
    price_change_percentage_24h: 2.1 + (Math.random() * 2 - 1),
    market_cap: 8500000000,
    total_volume: 650000000,
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "matic",
    image: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    current_price: 1.8 + Math.random() * 0.2,
    price_change_percentage_24h: 3.2 + (Math.random() * 2 - 1),
    market_cap: 9200000000,
    total_volume: 720000000,
  },
  {
    id: "uniswap",
    name: "Uniswap",
    symbol: "uni",
    image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
    current_price: 10 + Math.random() * 1,
    price_change_percentage_24h: -1.5 + (Math.random() * 2 - 1),
    market_cap: 7800000000,
    total_volume: 580000000,
  },
  {
    id: "litecoin",
    name: "Litecoin",
    symbol: "ltc",
    image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
    current_price: 90 + Math.random() * 5,
    price_change_percentage_24h: 0.8 + (Math.random() * 2 - 1),
    market_cap: 6500000000,
    total_volume: 450000000,
  },
  {
    id: "cosmos",
    name: "Cosmos",
    symbol: "atom",
    image: "https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png",
    current_price: 12 + Math.random() * 1,
    price_change_percentage_24h: 1.3 + (Math.random() * 2 - 1),
    market_cap: 4800000000,
    total_volume: 320000000,
  },
  {
    id: "stellar",
    name: "Stellar",
    symbol: "xlm",
    image: "https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png",
    current_price: 0.3 + Math.random() * 0.05,
    price_change_percentage_24h: 0.5 + (Math.random() * 2 - 1),
    market_cap: 8200000000,
    total_volume: 380000000,
  },
  {
    id: "tron",
    name: "TRON",
    symbol: "trx",
    image: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png",
    current_price: 0.12 + Math.random() * 0.01,
    price_change_percentage_24h: 1.7 + (Math.random() * 2 - 1),
    market_cap: 11000000000,
    total_volume: 950000000,
  },
  {
    id: "filecoin",
    name: "Filecoin",
    symbol: "fil",
    image: "https://assets.coingecko.com/coins/images/12817/large/filecoin.png",
    current_price: 5 + Math.random() * 0.5,
    price_change_percentage_24h: -0.9 + (Math.random() * 2 - 1),
    market_cap: 2300000000,
    total_volume: 180000000,
  },
  {
    id: "monero",
    name: "Monero",
    symbol: "xmr",
    image: "https://assets.coingecko.com/coins/images/69/large/monero_logo.png",
    current_price: 170 + Math.random() * 10,
    price_change_percentage_24h: 0.3 + (Math.random() * 2 - 1),
    market_cap: 3100000000,
    total_volume: 120000000,
  },
  {
    id: "aave",
    name: "Aave",
    symbol: "aave",
    image: "https://assets.coingecko.com/coins/images/12645/large/AAVE.png",
    current_price: 95 + Math.random() * 5,
    price_change_percentage_24h: 2.8 + (Math.random() * 2 - 1),
    market_cap: 1400000000,
    total_volume: 210000000,
  },
]

// Helper function to simulate API delay
const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

// Function to get mock coins for pagination
export async function fetchMockCoins(page = 1, perPage = 10): Promise<{ coins: Coin[]; hasMore: boolean }> {
  // Cache images from mock data
  mockCoins.forEach((coin) => {
    if (coin.image && !coin.image.includes("placeholder")) {
      imageCacheService.setImage(coin.id, coin.image)
    }
  })

  // Simulate API delay for realistic behavior
  await simulateApiDelay()

  const start = (page - 1) * perPage
  const end = start + perPage
  const paginatedCoins = mockCoins.slice(start, end)

  // Add some randomness to prices to simulate market changes
  const updatedCoins = paginatedCoins.map((coin) => ({
    ...coin,
    current_price: coin.current_price * (1 + (Math.random() * 0.04 - 0.02)), // +/- 2% random change
    price_change_percentage_24h: coin.price_change_percentage_24h + (Math.random() * 0.6 - 0.3), // +/- 0.3% random change
  }))

  return {
    coins: updatedCoins,
    hasMore: end < mockCoins.length,
  }
}

// Function to get a specific coin by ID
export async function fetchMockCoinDetails(id: string): Promise<Coin | null> {
  // Simulate API delay
  await simulateApiDelay()

  const coin = mockCoins.find((c) => c.id === id)

  if (!coin) {
    return null
  }

  // Cache the image
  if (coin.image && !coin.image.includes("placeholder")) {
    imageCacheService.setImage(coin.id, coin.image)
  }

  // Add some randomness to simulate real-time data
  return {
    ...coin,
    current_price: coin.current_price * (1 + (Math.random() * 0.04 - 0.02)), // +/- 2% random change
    price_change_percentage_24h: coin.price_change_percentage_24h + (Math.random() * 0.6 - 0.3), // +/- 0.3% random change
  }
}
