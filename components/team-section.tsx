"use client"

import Image from "next/image"
import { Github, Linkedin, Twitter } from "lucide-react"
import { motion } from "framer-motion"

const teamMembers = [
  {
    name: "Siddharth Raj",
    role: "Project Leader",
    image: "https://i.postimg.cc/htmzgx8g/1743762910471-photoaidcom-cropped.png",
    bio: "BlockChain Expert and Team Leader",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Shyam Kumar",
    role: "Junior Developer",
    image: "https://i.postimg.cc/8s0h3SVH/1743762714362-photoaidcom-cropped.png",
    bio: "Coder & Workerholic",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Shashikant Yadav",
    role: "Mid-level Developer",
    image: "https://i.postimg.cc/QM5p6wYQ/1743762625691-photoaidcom-cropped.png",
    bio: "UX/UI specialist",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Ashish",
    role: "Junior Developer",
    image: "https://i.postimg.cc/652TLRmR/IMG-20250404-WA0004-photoaidcom-cropped.png",
    bio: "Coding enthusiast",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
]

export function TeamSection() {
  return (
    <section className="py-16 bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">The passionate experts behind TradeXis Pro</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-card rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-all">
                <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder-user.jpg"
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-center">{member.name}</h3>
                <p className="text-primary text-center mb-2">{member.role}</p>
                <p className="text-muted-foreground text-center mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  <a
                    href={member.social.twitter}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Twitter size={18} />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a href={member.social.github} className="text-muted-foreground hover:text-primary transition-colors">
                    <Github size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

