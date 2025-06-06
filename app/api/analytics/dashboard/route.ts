import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { createApiResponse, getQueryParams, handleApiError } from "@/lib/api-utils"
import type { Subject } from "@/types/api"

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request)
    const userId = params.userId || "user-1" // Default user for demo
    const subject = params.subject as Subject

    const analytics = await db.getAnalytics(userId, subject)

    return createApiResponse(analytics, "Analytics retrieved successfully")
  } catch (error) {
    return handleApiError(error)
  }
}
