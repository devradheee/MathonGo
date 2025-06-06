import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { Chapter } from "@/types/chapter"
import { getChapterIcon } from "@/utils/chapter-icons"
import { ArrowUp, ArrowDown, Play, CheckCircle, Clock } from "lucide-react"

interface ChapterCardProps {
  chapter: Chapter
}

export default function ChapterCard({ chapter }: ChapterCardProps) {
  const ChapterIcon = getChapterIcon(chapter.id)

  const getStatusConfig = () => {
    switch (chapter.status) {
      case "Completed":
        return {
          color: "bg-green-500",
          textColor: "text-green-700 dark:text-green-400",
          icon: CheckCircle,
          bgColor: "bg-green-50 dark:bg-green-950",
        }
      case "In Progress":
        return {
          color: "bg-amber-500",
          textColor: "text-amber-700 dark:text-amber-400",
          icon: Clock,
          bgColor: "bg-amber-50 dark:bg-amber-950",
        }
      case "Not Started":
        return {
          color: "bg-gray-500",
          textColor: "text-gray-700 dark:text-gray-400",
          icon: Play,
          bgColor: "bg-gray-50 dark:bg-gray-950",
        }
      default:
        return {
          color: "bg-gray-500",
          textColor: "text-gray-700 dark:text-gray-400",
          icon: Play,
          bgColor: "bg-gray-50 dark:bg-gray-950",
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  const getChangeIndicator = (value: number) => {
    if (value > 0) {
      return <ArrowUp className="h-3 w-3 text-green-500" />
    } else if (value < 0) {
      return <ArrowDown className="h-3 w-3 text-red-500" />
    }
    return null
  }

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-200 ${
        chapter.isWeak ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <ChapterIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {chapter.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <span>{chapter.class}</span>
                <span>•</span>
                <span className="truncate">{chapter.unit}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {chapter.isWeak && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                Weak
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status and Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${statusConfig.bgColor}`}>
              <StatusIcon className={`h-3 w-3 ${statusConfig.textColor}`} />
              <span className={`text-xs font-medium ${statusConfig.textColor}`}>{chapter.status}</span>
            </div>
            <span className="text-xs text-muted-foreground">{chapter.questionsCount} Questions</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{chapter.progress}%</span>
            </div>
            <Progress value={chapter.progress} className="h-1.5" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-center space-y-1">
            <div className="text-muted-foreground">Accuracy</div>
            <div className="flex items-center justify-center gap-1">
              <span className="font-semibold">{chapter.accuracy}%</span>
              {getChangeIndicator(chapter.accuracyChange)}
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-muted-foreground">Speed</div>
            <div className="flex items-center justify-center gap-1">
              <span className="font-semibold">{chapter.speed}%</span>
              {getChangeIndicator(chapter.speedChange)}
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-muted-foreground">Score</div>
            <div className="flex items-center justify-center gap-1">
              <span className="font-semibold">{chapter.score}/10</span>
              {getChangeIndicator(chapter.scoreChange)}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button variant={chapter.status === "Not Started" ? "default" : "outline"} size="sm" className="w-full text-xs">
          {chapter.status === "Not Started"
            ? "Start Chapter"
            : chapter.status === "In Progress"
              ? "Continue"
              : "Review"}
        </Button>
      </CardContent>
    </Card>
  )
}
