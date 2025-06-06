import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { createApiResponse, createErrorResponse, getQueryParams, handleApiError } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request)
    const userId = params.userId || "user-1" // Default user for demo

    const user = await db.getUserById(userId)

    if (!user) {
      return createErrorResponse("User not found", 404)
    }

    return createApiResponse(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        preferences: user.preferences,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
      "User profile retrieved successfully",
    )
  } catch (error) {
    return handleApiError(error)
  }
}
