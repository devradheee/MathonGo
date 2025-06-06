import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { createApiResponse, createErrorResponse, validateRequired, handleApiError } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationError = validateRequired(body, ["email", "password"])
    if (validationError) {
      return createErrorResponse(validationError, 400)
    }

    // Simple authentication for demo (in production, use proper password hashing)
    const user = await db.getUserByEmail(body.email)

    if (!user || body.password !== "demo123") {
      return createErrorResponse("Invalid credentials", 401)
    }

    // Generate a simple token (in production, use JWT)
    const token = `demo-token-${user.id}-${Date.now()}`

    return createApiResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          preferences: user.preferences,
        },
        token,
      },
      "Login successful",
    )
  } catch (error) {
    return handleApiError(error)
  }
}
