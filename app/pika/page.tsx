"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Search } from "lucide-react"
import { motion } from "framer-motion"

export default function PikaPage() {
  const [query, setQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Intentionally throw an error to show the error handling
      throw new Error("This is a demonstration error. Please check the following instructions:")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <Card className="border-teal-500/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Pika Search</CardTitle>
            <CardDescription>Enter your search query and submit to see the results</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 border-teal-500/20 focus-visible:ring-teal-500"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error}
                    <ul className="mt-2 list-disc list-inside">
                      <li>Make sure your query is specific</li>
                      <li>Try using different keywords</li>
                      <li>Check your network connection</li>
                      <li>Contact support if the issue persists</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Searching...</span>
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">Powered by TradeXis Search Engine</p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

