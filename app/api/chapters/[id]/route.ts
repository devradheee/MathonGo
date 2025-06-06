import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { createApiResponse, createErrorResponse, handleApiError } from "@/lib/api-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const chapter = await db.getChapterById(params.id)

    if (!chapter) {
      return createErrorResponse("Chapter not found", 404)
    }

    return createApiResponse(chapter, "Chapter retrieved successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const updatedChapter = await db.updateChapterProgress(params.id, body)

    if (!updatedChapter) {
      return createErrorResponse("Chapter not found", 404)
    }

    return createApiResponse(updatedChapter, "Chapter updated successfully")
  } catch (error) {
    return handleApiError(error)
  }
}
