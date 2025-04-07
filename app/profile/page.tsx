"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { X, Upload, Star, ArrowLeftRight, Clock, Save } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, updateUserProfile, logout } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock transaction history
  const transactions = [
    { id: 1, type: "swap", from: "BTC", to: "ETH", amount: "0.05", date: "2023-04-01T10:30:00Z" },
    { id: 2, type: "swap", from: "ETH", to: "SOL", amount: "1.2", date: "2023-03-28T14:15:00Z" },
    { id: 3, type: "swap", from: "SOL", to: "AVAX", amount: "10", date: "2023-03-25T09:45:00Z" },
  ]

  // Mock watchlist
  const watchlist = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 65000, change: 2.5 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3500, change: 1.8 },
    { id: "solana", name: "Solana", symbol: "SOL", price: 150, change: 3.2 },
  ]

  if (!user) {
    router.push("/auth/signin")
    return null
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    updateUserProfile({
      name,
      image: imagePreview || undefined,
    })

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="container py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile information here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-teal-500/20">
                      <AvatarImage src={imagePreview || "/placeholder-user.jpg"} />
                      <AvatarFallback className="text-2xl bg-teal-500/20 text-teal-700">
                        {name?.charAt(0) || email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background border-teal-500/20"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Click the icon to upload a profile picture</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-teal-500/20 focus-visible:ring-teal-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={email} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      logout()
                      router.push("/")
                      toast({
                        title: "Logged out",
                        description: "You have been logged out successfully",
                      })
                    }}
                  >
                    Log out
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="watchlist">
            <Card>
              <CardHeader>
                <CardTitle>Your Watchlist</CardTitle>
                <CardDescription>Cryptocurrencies you're tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {watchlist.length > 0 ? (
                    watchlist.map((coin) => (
                      <motion.div
                        key={coin.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          <div>
                            <p className="font-medium">{coin.name}</p>
                            <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${coin.price.toLocaleString()}</p>
                          <p className={coin.change >= 0 ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                            {coin.change >= 0 ? "+" : ""}
                            {coin.change}%
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">You haven't added any coins to your watchlist yet.</p>
                      <Button onClick={() => router.push("/dashboard")} variant="outline" className="mt-4">
                        Browse Coins
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent swap transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-teal-500/10 p-2 rounded-full">
                            <ArrowLeftRight className="h-5 w-5 text-teal-500" />
                          </div>
                          <div>
                            <p className="font-medium">
                              Swapped {tx.amount} {tx.from} to {tx.to}
                            </p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(tx.date)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">You haven't made any transactions yet.</p>
                      <Button onClick={() => router.push("/swap")} variant="outline" className="mt-4">
                        Try Swapping
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

