import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { createApiResponse, getQueryParams, handleApiError } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request)
    const timeframe = params.timeframe || "7d" // 7d, 30d, 90d, 1y

    // Get all chapters for stats calculation
    const allChapters = await db.getChapters()

    // Calculate various statistics
    const stats = {
      overview: {
        totalChapters: allChapters.length,
        completedChapters: allChapters.filter((c) => c.status === "Completed").length,
        averageProgress: Math.round(allChapters.reduce((sum, c) => sum + c.progress, 0) / allChapters.length),
        weakChapters: allChapters.filter((c) => c.isWeak).length,
      },
      performance: {
        averageAccuracy: Math.round(allChapters.reduce((sum, c) => sum + c.accuracy, 0) / allChapters.length),
        averageSpeed: Math.round(allChapters.reduce((sum, c) => sum + c.speed, 0) / allChapters.length),
        averageScore: Math.round((allChapters.reduce((sum, c) => sum + c.score, 0) / allChapters.length) * 10) / 10,
      },
      subjects: {
        physics: getSubjectPerformance(allChapters, "physics"),
        chemistry: getSubjectPerformance(allChapters, "chemistry"),
        mathematics: getSubjectPerformance(allChapters, "mathematics"),
      },
      trends: {
        accuracyTrend: calculateTrend(allChapters, "accuracyChange"),
        speedTrend: calculateTrend(allChapters, "speedChange"),
        scoreTrend: calculateTrend(allChapters, "scoreChange"),
      },
      timeframe,
    }

    return createApiResponse(stats, "Statistics retrieved successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

function getSubjectPerformance(chapters: any[], subject: string) {
  const subjectChapters = chapters.filter((c) => c.subject === subject)

  return {
    total: subjectChapters.length,
    completed: subjectChapters.filter((c) => c.status === "Completed").length,
    averageProgress: Math.round(subjectChapters.reduce((sum, c) => sum + c.progress, 0) / subjectChapters.length),
    averageAccuracy: Math.round(subjectChapters.reduce((sum, c) => sum + c.accuracy, 0) / subjectChapters.length),
    weakChapters: subjectChapters.filter((c) => c.isWeak).length,
  }
}

function calculateTrend(chapters: any[], field: string): "up" | "down" | "stable" {
  const changes = chapters.map((c) => c[field]).filter((change) => change !== 0)

  if (changes.length === 0) return "stable"

  const positiveChanges = changes.filter((change) => change > 0).length
  const negativeChanges = changes.filter((change) => change < 0).length

  if (positiveChanges > negativeChanges) return "up"
  if (negativeChanges > positiveChanges) return "down"
  return "stable"
}
