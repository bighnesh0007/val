"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Edit, Trash, User, Clock, Search, CheckSquare, MessageSquare, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { type ActionItem, priorityEmojis } from "@/lib/types"

interface ActionItemListProps {
  actionItems: ActionItem[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterPriority: "All" | "High" | "Medium" | "Low"
  setFilterPriority: (priority: "All" | "High" | "Medium" | "Low") => void
  setResult: React.Dispatch<React.SetStateAction<any>>
}

export function ActionItemList({
  actionItems,
  searchQuery,
  setSearchQuery,
  filterPriority,
  setFilterPriority,
  setResult,
}: ActionItemListProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editedTask, setEditedTask] = useState("")
  const [editedAssignee, setEditedAssignee] = useState("")
  const [editedDeadline, setEditedDeadline] = useState("")
  const [editedPriority, setEditedPriority] = useState<"High" | "Medium" | "Low">("Medium")
  const [newComment, setNewComment] = useState("")

  // Handle editing an action item
  const handleEditActionItem = (item: ActionItem) => {
    setEditingItemId(item.id)
    setEditedTask(item.task)
    setEditedAssignee(item.assignee)
    setEditedDeadline(item.deadline)
    setEditedPriority(item.priority)
  }

  // Save the edited action item
  const saveEditedActionItem = (id: string) => {
    setResult((prevResult: any) => ({
      ...prevResult,
      actionItems: prevResult.actionItems.map((item: ActionItem) =>
        item.id === id
          ? {
              ...item,
              task: editedTask,
              assignee: editedAssignee,
              deadline: editedDeadline,
              priority: editedPriority,
            }
          : item,
      ),
    }))
    setEditingItemId(null)
  }

  // Delete an action item
  const deleteActionItem = (id: string) => {
    setResult((prevResult: any) => ({
      ...prevResult,
      actionItems: prevResult.actionItems.filter((item: ActionItem) => item.id !== id),
    }))
  }

  // Add a comment to an action item
  const handleAddComment = (id: string) => {
    if (!newComment.trim()) return
    setResult((prevResult: any) => ({
      ...prevResult,
      actionItems: prevResult.actionItems.map((item: ActionItem) =>
        item.id === id ? { ...item, comments: [...item.comments, newComment] } : item,
      ),
    }))
    setNewComment("")
  }

  // Filter action items based on search query and priority
  const filteredActionItems = actionItems.filter((item) => {
    const matchesSearch = item.task.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === "All" || item.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  return (
    <Card className="bg-white text-gray-900 border-orange-300 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <CheckSquare className="w-6 h-6 mr-2 text-orange-500" />
          Action Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white text-gray-900 border-orange-300 focus:border-orange-500 focus:ring-orange-500 focus:ring-opacity-50 transition"
            />
          </div>
          <Select
            value={filterPriority}
            onValueChange={(value) => setFilterPriority(value as "All" | "High" | "Medium" | "Low")}
          >
            <SelectTrigger className="w-[180px] bg-white text-gray-900 border-orange-300">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900 border-orange-300">
              <SelectItem value="All">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ul className="space-y-4">
          {filteredActionItems.map((item) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 bg-white border border-orange-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {editingItemId === item.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <Input
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                    placeholder="Task"
                    className="bg-white text-gray-900 border-orange-300"
                  />
                  <Input
                    value={editedAssignee}
                    onChange={(e) => setEditedAssignee(e.target.value)}
                    placeholder="Assignee"
                    className="bg-white text-gray-900 border-orange-300"
                  />
                  <Input
                    type="date"
                    value={editedDeadline}
                    onChange={(e) => setEditedDeadline(e.target.value)}
                    placeholder="Deadline"
                    className="bg-white text-gray-900 border-orange-300"
                  />
                  <Select
                    value={editedPriority}
                    onValueChange={(value) => setEditedPriority(value as "High" | "Medium" | "Low")}
                  >
                    <SelectTrigger className="bg-white text-gray-900 border-orange-300">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900 border-orange-300">
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => saveEditedActionItem(item.id)} className="bg-orange-500 text-white">
                    Save
                  </Button>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-lg flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-orange-500" />
                      {item.task}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-orange-200 text-orange-800 border-orange-300">
                        {priorityEmojis[item.priority]}
                        {item.priority}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleEditActionItem(item)}>
                        <Edit className="w-4 h-4 text-orange-500" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteActionItem(item.id)}>
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4 text-orange-400" /> Assigned to: {item.assignee}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-400" /> Due: {item.deadline}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-orange-500" /> Comments
                    </h4>
                    <ul className="space-y-2 mt-2">
                      {item.comments.map((comment, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {comment}
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-white text-gray-900 border-orange-300"
                      />
                      <Button onClick={() => handleAddComment(item.id)} className="bg-orange-500 text-white">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}