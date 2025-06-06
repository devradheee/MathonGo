import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { createApiResponse, getQueryParams, handleApiError } from "@/lib/api-utils"
import type { Subject } from "@/types/api"

export async function GET(request: NextRequest) {
  try {
    const params = getQueryParams(request)

    const filters = {
      subject: params.subject as Subject,
      class: params.class,
      unit: params.unit,
      status: params.status,
      isWeak: params.isWeak === "true",
      search: params.search,
    }

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof typeof filters] === undefined) {
        delete filters[key as keyof typeof filters]
      }
    })

    const chapters = await db.getChapters(filters)

    return createApiResponse(chapters, "Chapters retrieved successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
