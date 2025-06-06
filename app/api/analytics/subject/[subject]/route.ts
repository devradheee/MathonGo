import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { createApiResponse, createErrorResponse, handleApiError } from "@/lib/api-utils"
import type { Subject } from "@/types/api"

export async function GET(request: NextRequest, { params }: { params: { subject: string } }) {
  try {
    const subject = params.subject as Subject

    if (!["physics", "chemistry", "mathematics"].includes(subject)) {
      return createErrorResponse("Invalid subject", 400)
    }

    const analytics = await db.getAnalytics("user-1", subject)

    return createApiResponse(analytics, `${subject} analytics retrieved successfully`)
  } catch (error) {
    return handleApiError(error)
  }
}
