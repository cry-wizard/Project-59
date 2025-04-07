"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface Item {
  title: string
  thumbnail: string
  link: string
}

export function HeroParallax({ items }: { items: Item[] }) {
  const firstRow = items.slice(0, 3)
  const secondRow = items.slice(3, 6)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300])

  return (
    <div
      ref={ref}
      className="h-[140vh] md:h-[120vh] w-full bg-gradient-to-b from-background via-purple-950/10 to-background overflow-hidden"
    >
      <div className="container mx-auto px-4 pt-20 md:pt-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The Next Generation <br />
            Crypto Trading Platform
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Real-time data, advanced analytics, and powerful tools to help you make informed trading decisions.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="rounded-full px-8 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-teal-500/20 hover:bg-teal-500/10">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute top-[30%] md:top-[40%] w-full">
        <motion.div style={{ y: y1 }} className="flex gap-4 md:gap-8 px-4 md:px-10 w-full">
          {firstRow.map((item, idx) => (
            <Link
              href={item.link}
              key={`first-row-${idx}`}
              className="group relative h-40 md:h-80 w-full rounded-xl overflow-hidden shadow-lg"
            >
              <Image
                src={item.thumbnail || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 w-full p-4">
                <h3 className="text-white text-xl font-bold">{item.title}</h3>
              </div>
            </Link>
          ))}
        </motion.div>
        <motion.div style={{ y: y2 }} className="flex gap-4 md:gap-8 px-4 md:px-10 mt-4 md:mt-8 w-full">
          {secondRow.map((item, idx) => (
            <Link
              href={item.link}
              key={`second-row-${idx}`}
              className="group relative h-40 md:h-80 w-full rounded-xl overflow-hidden shadow-lg"
            >
              <Image
                src={item.thumbnail || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 w-full p-4">
                <h3 className="text-white text-xl font-bold">{item.title}</h3>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

