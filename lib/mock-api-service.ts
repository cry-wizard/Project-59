// This is a mock API service that simulates fetching data from an external API
// We'll use this instead of the CoinGecko API

export interface CryptoData {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: number
  volume: number
  image: string
}

// Mock data for cryptocurrencies
const mockCryptoData: CryptoData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 65432.21,
    change24h: 2.34,
    marketCap: 1250000000000,
    volume: 28500000000,
    image: "/coin-images/bitcoin.png",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3456.78,
    change24h: 1.56,
    marketCap: 420000000000,
    volume: 15600000000,
    image: "/coin-images/ethereum.png",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 148.32,
    change24h: 3.78,
    marketCap: 65000000000,
    volume: 3200000000,
    image: "/coin-images/solana.png",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.45,
    change24h: -0.82,
    marketCap: 15800000000,
    volume: 520000000,
    image: "/coin-images/cardano.png",
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    price: 6.78,
    change24h: 1.23,
    marketCap: 8700000000,
    volume: 370000000,
    image: "/coin-images/polkadot.png",
  },
]

// Function to simulate API delay
const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

// Function to get all cryptocurrencies
export async function fetchAllCryptos(): Promise<CryptoData[]> {
  await simulateApiDelay()
  return [...mockCryptoData]
}

// Function to get a specific cryptocurrency by ID
export async function fetchCryptoById(id: string): Promise<CryptoData | null> {
  await simulateApiDelay()
  const crypto = mockCryptoData.find((c) => c.id === id)
  return crypto || null
}

// Function to search cryptocurrencies by name or symbol
export async function searchCryptos(query: string): Promise<CryptoData[]> {
  await simulateApiDelay()
  if (!query) return [...mockCryptoData]

  const lowercaseQuery = query.toLowerCase()
  return mockCryptoData.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(lowercaseQuery) || crypto.symbol.toLowerCase().includes(lowercaseQuery),
  )
}

