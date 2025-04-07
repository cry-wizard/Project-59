"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    id: 1,
    content:
      "TradeXis has completely transformed how I trade cryptocurrencies. The real-time data and analytics tools are unmatched in the industry.",
    author: "Sarah Johnson",
    role: "Professional Trader",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    content:
      "I've tried many crypto platforms, but TradeXis stands out with its intuitive interface and powerful comparison tools. It's made my investment decisions so much easier.",
    author: "Michael Chen",
    role: "Crypto Investor",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    content:
      "The token swap feature is a game-changer. Fast, secure, and with minimal fees. I've recommended TradeXis to all my colleagues in the blockchain space.",
    author: "Alex Rodriguez",
    role: "Blockchain Developer",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    id: 4,
    content:
      "As a newcomer to cryptocurrency, TradeXis made it easy for me to understand the market and make informed decisions. Their customer support is exceptional.",
    author: "Emily Parker",
    role: "New Investor",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 5,
    content:
      "The security features on TradeXis give me peace of mind. I can trade confidently knowing my assets are protected by industry-leading security measures.",
    author: "David Wilson",
    role: "Security Analyst",
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const visibleTestimonials = testimonials.slice(activeIndex, activeIndex + 3)

  const nextTestimonials = () => {
    setActiveIndex((prev) => (prev + 1) % (testimonials.length - 2))
  }

  const prevTestimonials = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 3 : prev - 1))
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Trusted by thousands of crypto traders and investors worldwide
          </motion.p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-teal-500/20 hover:border-teal-500/40 transition-colors">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4 text-teal-500">
                      <Quote className="h-8 w-8" />
                    </div>
                    <p className="text-foreground mb-6 flex-grow">{testimonial.content}</p>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {testimonials.length > 3 && (
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.slice(0, testimonials.length - 2).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === activeIndex ? "bg-teal-500" : "bg-teal-500/20"
                  }`}
                  aria-label={`Go to testimonial set ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

