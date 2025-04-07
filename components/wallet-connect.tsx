"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface WalletConnectProps {
  children?: React.ReactNode
  className?: string
}

export function WalletConnect({ children, className }: WalletConnectProps) {
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [account, setAccount] = useState("")

  // Check if wallet was previously connected
  useEffect(() => {
    const savedAccount = localStorage.getItem("tradexis-wallet-account")
    if (savedAccount) {
      setAccount(savedAccount)
      setConnected(true)
    }
  }, [])

  // Update the connectWallet function to better handle errors and user rejections

  const connectWallet = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      })
      return
    }

    try {
      setConnecting(true)

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      // Only proceed if we got accounts (user didn't reject)
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0])
        setConnected(true)

        // Save connected account
        localStorage.setItem("tradexis-wallet-account", accounts[0])

        toast({
          title: "Wallet connected",
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
        })
      }
    } catch (error) {
      console.error("Wallet connection error:", error)

      // Check for user rejection (code 4001)
      if (error.code === 4001) {
        toast({
          title: "Connection cancelled",
          description: "You rejected the connection request",
          variant: "default",
        })
      } else {
        toast({
          title: "Connection failed",
          description: "Failed to connect to MetaMask",
          variant: "destructive",
        })
      }
    } finally {
      setConnecting(false)
    }
  }

  if (children) {
    return (
      <button onClick={connectWallet} className={className} disabled={connecting || connected}>
        {connected ? `Connected: ${account.substring(0, 6)}...${account.substring(38)}` : children}
      </button>
    )
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={connecting || connected}
      className={cn("gap-2 relative overflow-hidden", connected ? "bg-teal-500 hover:bg-teal-600" : "", className)}
    >
      {connected && (
        <motion.span
          className="absolute inset-0 bg-teal-400"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "linear" }}
          style={{ opacity: 0.2 }}
        />
      )}
      <Wallet className="h-4 w-4" />
      {connected
        ? `${account.substring(0, 6)}...${account.substring(38)}`
        : connecting
          ? "Connecting..."
          : "Connect Wallet"}
    </Button>
  )
}

