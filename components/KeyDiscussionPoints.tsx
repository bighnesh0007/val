"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Sparkles } from "lucide-react"

interface KeyDiscussionPointsProps {
  points: string[]
}

export function KeyDiscussionPoints({ points }: KeyDiscussionPointsProps) {
  return (
    <Card className="bg-white text-gray-900 border-orange-300 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <MessageCircle className="w-6 h-6 mr-2 text-orange-500" />
          <span className="flex items-center gap-1">
            Key Discussion Points 
            <Sparkles className="w-5 h-5 text-orange-400" />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 pl-6">
          {points.map((point, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              className="relative before:content-['•'] before:absolute before:left-[-12px] before:text-orange-500 before:text-2xl before:top-1/2 before:transform before:-translate-y-1/2 text-gray-700"
            >
              <span className="pl-4">{point}</span>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
