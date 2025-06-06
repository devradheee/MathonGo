import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { createApiResponse, createErrorResponse, getQueryParams, handleApiError } from "@/lib/api-utils"

export async function PUT(request: NextRequest) {
  try {
    const params = getQueryParams(request)
    const userId = params.userId || "user-1" // Default user for demo
    const body = await request.json()

    const updatedUser = await db.updateUserPreferences(userId, body)

    if (!updatedUser) {
      return createErrorResponse("User not found", 404)
    }

    return createApiResponse(updatedUser.preferences, "User preferences updated successfully")
  } catch (error) {
    return handleApiError(error)
  }
}
