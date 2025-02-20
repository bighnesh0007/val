"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Calendar, Star, Mic, MicOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { ActionItem, MeetingDetails } from "@/lib/types"
import { ActionItemList } from "@/components/ActionItemList"
import { MeetingSummary } from "@/components/MeetingSummary"
import { KeyDiscussionPoints } from "@/components/KeyDiscussionPoints"

export default function Home() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<{
    meetingDetails: MeetingDetails
    actionItems: ActionItem[]
    keyDiscussionPoints: string[]
    meetingSummary: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<"All" | "High" | "Medium" | "Low">("All")
  const [isListening, setIsListening] = useState(false)

  const handleVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput((prev) => prev + " " + transcript)
      setIsListening(false)
    }

    recognition.onerror = () => setIsListening(false)

    recognition.start()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return setError("Please enter meeting notes.")

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })

      if (!response.ok) throw new Error("Failed to process notes.")
      const data = await response.json()
      setResult({
        ...data,
        actionItems: data.actionItems.map((item: any) => ({
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          comments: [],
        })),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const sendEmail = async () => {
    if (!result) return

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingSummary: result.meetingSummary,
          actionItems: result.actionItems,
          keyDiscussionPoints: result.keyDiscussionPoints,
        }),
      })

      if (!response.ok) throw new Error("Failed to send email.")
      const data = await response.json()
      alert(data.message || "Email sent successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email.")
    }
  }

  const handleCreateCalendarEvent = (meetingDetails: MeetingDetails) => {
    const { date, time, duration = "1", title = "Meeting", location = "" } = meetingDetails

    const formattedDate = formatDate(date)
    const formattedTime = formatTime(time)

    const startDateTime = `${formattedDate}T${formattedTime}00`
    const endDateTime = `${formattedDate}T${(Number.parseInt(formattedTime) + 100).toString().padStart(4, "0")}00`

    const eventDetails = {
      text: encodeURIComponent(title),
      dates: `${startDateTime}/${endDateTime}`,
      details: encodeURIComponent(result?.meetingSummary || ""),
      location: encodeURIComponent(location),
    }

    const calendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=${eventDetails.text}&dates=${eventDetails.dates}&details=${eventDetails.details}&location=${eventDetails.location}`

    window.open(calendarUrl, "_blank")
  }

  const formatDate = (date: string) => date.replace(/-/g, "")
  const formatTime = (time: string) => time.replace(/:/g, "")

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto max-w-4xl"
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        >
          <Star className="inline-block w-10 h-10 mr-3 text-orange-500" />
          Meeting Notes Pro
        </motion.h1>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-red-500 text-white text-center rounded-lg shadow-md mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          onSubmit={handleSubmit}
          className="mb-8 bg-white p-6 rounded-xl shadow-lg"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-4 bg-gray-100 text-gray-900 border border-orange-300 rounded-lg focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 transition mb-4"
            placeholder="Paste your meeting notes here..."
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              onClick={handleVoiceInput}
              className="flex-1 flex justify-center items-center bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg border border-orange-700 shadow-md transition transform hover:scale-105"
            >
              {isListening ? <Mic className="animate-pulse mr-2" /> : <MicOff className="mr-2" />}
              {isListening ? "Listening..." : "Use Voice Input"}
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center items-center bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg border border-orange-800 shadow-md transition transform hover:scale-105"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Processing..." : "Process Notes"}
            </Button>
          </div>
        </motion.form>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => handleCreateCalendarEvent(result.meetingDetails)}
                  className="flex-1 flex items-center justify-center bg-orange-400 hover:bg-orange-500 text-white py-3 px-6 rounded-lg border border-orange-600 shadow-md transition transform hover:scale-105"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Create Calendar Event
                </Button>
                <Button
                  onClick={sendEmail}
                  className="flex-1 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg border border-orange-700 shadow-md transition transform hover:scale-105"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Share via Email
                </Button>
              </div>

              <MeetingSummary summary={result.meetingSummary} />

              <ActionItemList
                actionItems={result.actionItems}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                setResult={setResult}
              />

              <KeyDiscussionPoints points={result.keyDiscussionPoints} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}

