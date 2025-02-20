export interface ActionItem {
    id: string
    task: string
    assignee: string
    deadline: string
    priority: "High" | "Medium" | "Low"
    comments: string[]
  }
  export interface MeetingDetails {
    date: string;
    time: string;
    duration?: string;
    location?: string;
    title?: string;
  }
  
  export const priorityEmojis = {
    High: "🔥",
    Medium: "⚡",
    Low: "🌱",
  }
  
  