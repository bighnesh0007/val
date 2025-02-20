import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, FileText } from "lucide-react"

interface MeetingSummaryProps {
  summary: string
}

export function MeetingSummary({ summary }: MeetingSummaryProps) {
  return (
    <Card className="bg-white text-gray-900 border-orange-300 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <MessageCircle className="w-6 h-6 mr-2 text-orange-500" />
          <span className="flex items-center gap-1">
            Meeting Summary
            <FileText className="w-5 h-5 text-orange-400" />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed bg-orange-100 p-4 rounded-lg border border-orange-300 shadow-inner">
          {summary}
        </p>
      </CardContent>
    </Card>
  )
}
