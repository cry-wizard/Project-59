"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export interface User {
  id: string
  email: string
  name?: string
  image?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  googleLogin: () => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUserProfile: (data: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>("tradexis-user", null)
  const [users, setUsers] = useLocalStorage<Record<string, { password: string; user: User }>>("tradexis-users", {})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading auth state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Check if MetaMask is available but don't connect automatically
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      // MetaMask is available, but we won't auto-connect
      console.log("MetaMask is available")
    }

    return () => clearTimeout(timer)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const userRecord = users[email]

    if (userRecord && userRecord.password === password) {
      setUser(userRecord.user)
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const googleLogin = async (): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create a fake Google user
    const googleUser: User = {
      id: `google-${Date.now()}`,
      email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
      name: `Google User ${Math.floor(Math.random() * 100)}`,
      image: "/placeholder-user.jpg",
    }

    // Save the user
    const updatedUsers = { ...users }
    updatedUsers[googleUser.email] = {
      password: "google-auth", // Not used for Google login
      user: googleUser,
    }

    setUsers(updatedUsers)
    setUser(googleUser)
    setIsLoading(false)
    return true
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if user already exists
    if (users[email]) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
    }

    // Save the user
    const updatedUsers = { ...users }
    updatedUsers[email] = {
      password,
      user: newUser,
    }

    setUsers(updatedUsers)
    setUser(newUser)
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)

    // Also update in the users store
    if (users[user.email]) {
      const updatedUsers = { ...users }
      updatedUsers[user.email] = {
        ...updatedUsers[user.email],
        user: updatedUser,
      }
      setUsers(updatedUsers)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        googleLogin,
        signup,
        logout,
        updateUserProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

