import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { createApiResponse, getQueryParams, handleApiError } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request)
    const query = params.q || ""
    const subject = params.subject

    if (!query.trim()) {
      return createApiResponse([], "Empty search query")
    }

    const filters = {
      search: query,
      ...(subject && { subject: subject as any }),
    }

    const chapters = await db.getChapters(filters)

    // Add search relevance scoring
    const scoredResults = chapters
      .map((chapter) => ({
        ...chapter,
        relevanceScore: calculateRelevance(chapter.name, query),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)

    return createApiResponse(scoredResults, `Found ${scoredResults.length} results`)
  } catch (error) {
    return handleApiError(error)
  }
}

function calculateRelevance(text: string, query: string): number {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()

  if (lowerText === lowerQuery) return 100
  if (lowerText.startsWith(lowerQuery)) return 80
  if (lowerText.includes(lowerQuery)) return 60

  // Word matching
  const textWords = lowerText.split(" ")
  const queryWords = lowerQuery.split(" ")
  const matchingWords = queryWords.filter((word) => textWords.some((textWord) => textWord.includes(word)))

  return (matchingWords.length / queryWords.length) * 40
}
