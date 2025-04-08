// Simple in-memory cache for API responses
interface CacheItem<T> {
  data: T
  timestamp: number
}

class ApiCache {
  private cache: Map<string, CacheItem<any>> = new Map()
  private readonly DEFAULT_TTL = 3 * 60 * 60 * 1000 // 3 hours in milliseconds

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl,
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    // Check if the item has expired
    if (Date.now() > item.timestamp) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  invalidate(key: string): void {
    this.cache.delete(key)
  }

  invalidateAll(): void {
    this.cache.clear()
  }

  // Invalidate all keys that match a pattern
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern)
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }
}

export const apiCache = new ApiCache()
