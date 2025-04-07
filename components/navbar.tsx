"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, LogOut, User, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletConnect } from "@/components/wallet-connect"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const { user, logout } = useAuth()
  const { toast } = useToast()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    })
    router.push("/")
  }

  const handleNavigation = (path: string) => {
    setIsSheetOpen(false)
    router.push(path)
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <motion.span className="text-xl font-bold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            TradeXis<span className="text-teal-500"> </span>
          </motion.span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/dashboard"
            className={cn(
              "text-sm font-medium transition-colors hover:text-teal-500 relative group",
              pathname === "/dashboard" ? "text-teal-500" : "text-foreground/60",
            )}
          >
            Dashboard
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="/compare"
            className={cn(
              "text-sm font-medium transition-colors hover:text-teal-500 relative group",
              pathname === "/compare" ? "text-teal-500" : "text-foreground/60",
            )}
          >
            Compare
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="/watchlist"
            className={cn(
              "text-sm font-medium transition-colors hover:text-teal-500 relative group",
              pathname === "/watchlist" ? "text-teal-500" : "text-foreground/60",
            )}
          >
            Watchlist
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="/swap"
            className={cn(
              "text-sm font-medium transition-colors hover:text-teal-500 relative group",
              pathname === "/swap" ? "text-teal-500" : "text-foreground/60",
            )}
          >
            Swap
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <WalletConnect />

            <AnimatePresence>
              {!user ? (
                <motion.div
                  className="flex space-x-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Link href="/auth/signin">
                    <Button variant="ghost" size="sm" className="relative overflow-hidden group">
                      <span className="relative z-10">Sign In</span>
                      <span className="absolute inset-0 bg-teal-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button
                      size="sm"
                      className="relative overflow-hidden group bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                    >
                      <span className="relative z-10">Sign Up</span>
                      <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 p-1 pl-2 pr-2">
                        <Avatar className="h-8 w-8 border-2 border-teal-500">
                          <AvatarImage src={user.image || "/placeholder-user.jpg"} />
                          <AvatarFallback className="bg-teal-500/20 text-teal-700">
                            {user.name?.charAt(0) || user.email?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium hidden sm:inline-block">{user.name || user.email}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-500 focus:text-red-500"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="border-teal-500/20 hover:bg-teal-500/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col border-teal-500/20 bg-black/90 backdrop-blur-lg">
              <div className="flex flex-col space-y-4 mt-8">
                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className={cn(
                    "text-lg font-medium hover:text-teal-500 text-left transition-all duration-200 transform hover:translate-x-1",
                    pathname === "/dashboard" ? "text-teal-500" : "",
                  )}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavigation("/compare")}
                  className={cn(
                    "text-lg font-medium hover:text-teal-500 text-left transition-all duration-200 transform hover:translate-x-1",
                    pathname === "/compare" ? "text-teal-500" : "",
                  )}
                >
                  Compare
                </button>
                <button
                  onClick={() => handleNavigation("/watchlist")}
                  className={cn(
                    "text-lg font-medium hover:text-teal-500 text-left transition-all duration-200 transform hover:translate-x-1",
                    pathname === "/watchlist" ? "text-teal-500" : "",
                  )}
                >
                  Watchlist
                </button>
                <button
                  onClick={() => handleNavigation("/swap")}
                  className={cn(
                    "text-lg font-medium hover:text-teal-500 text-left transition-all duration-200 transform hover:translate-x-1",
                    pathname === "/swap" ? "text-teal-500" : "",
                  )}
                >
                  Swap
                </button>
                <div className="pt-4 border-t border-teal-500/20">
                  <WalletConnect className="w-full mb-4" />
                  {!user ? (
                    <>
                      <button onClick={() => handleNavigation("/auth/signin")} className="block mb-4 w-full">
                        <Button variant="outline" className="w-full border-teal-500/20 hover:bg-teal-500/10">
                          Sign In
                        </Button>
                      </button>
                      <button onClick={() => handleNavigation("/auth/signup")} className="block w-full">
                        <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
                          Sign Up
                        </Button>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 p-2 rounded-md bg-teal-500/10">
                        <Avatar className="h-10 w-10 border-2 border-teal-500">
                          <AvatarImage src={user.image || "/placeholder-user.jpg"} />
                          <AvatarFallback className="bg-teal-500/20 text-teal-700">
                            {user.name?.charAt(0) || user.email?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name || "User"}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-teal-500/20 hover:bg-teal-500/10"
                        onClick={() => {
                          setIsSheetOpen(false)
                          router.push("/profile")
                        }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10 border-red-500/20"
                        onClick={() => {
                          setIsSheetOpen(false)
                          handleLogout()
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-teal-500/20">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

