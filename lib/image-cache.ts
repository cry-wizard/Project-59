/**
 * Global image cache service for storing and retrieving coin images
 * This ensures images are loaded only once and reused throughout the application
 */

// Define the interface for the image cache
interface ImageCache {
  [coinId: string]: string
}

class ImageCacheService {
  private static instance: ImageCacheService
  private cache: ImageCache = {}

  // Private constructor to enforce singleton pattern
  private constructor() {
    // Initialize from localStorage if available
    this.loadFromStorage()
  }

  // Get the singleton instance
  public static getInstance(): ImageCacheService {
    if (!ImageCacheService.instance) {
      ImageCacheService.instance = new ImageCacheService()
    }
    return ImageCacheService.instance
  }

  // Get an image URL from the cache
  public getImage(coinId: string): string | undefined {
    return this.cache[coinId]
  }

  // Set an image URL in the cache
  public setImage(coinId: string, imageUrl: string): void {
    if (!coinId || !imageUrl) return

    // Don't cache placeholder images
    if (imageUrl.includes("placeholder")) return

    this.cache[coinId] = imageUrl
    this.saveToStorage()
  }

  // Check if an image exists in the cache
  public hasImage(coinId: string): boolean {
    return !!this.cache[coinId]
  }

  // Clear the entire cache
  public clearCache(): void {
    this.cache = {}
    this.saveToStorage()
  }

  // Save the cache to localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem("coin-image-cache", JSON.stringify(this.cache))
    } catch (error) {
      console.error("Failed to save image cache to localStorage:", error)
    }
  }

  // Load the cache from localStorage
  private loadFromStorage(): void {
    try {
      const storedCache = localStorage.getItem("coin-image-cache")
      if (storedCache) {
        this.cache = JSON.parse(storedCache)
      }
    } catch (error) {
      console.error("Failed to load image cache from localStorage:", error)
      this.cache = {}
    }
  }
}

// Export a singleton instance
export const imageCacheService = ImageCacheService.getInstance()
