import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { createApiResponse, createErrorResponse, validateRequired, handleApiError } from "@/lib/api-utils"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validate required fields for progress update
    const validationError = validateRequired(body, ["progress"])
    if (validationError) {
      return createErrorResponse(validationError, 400)
    }

    // Validate progress value
    if (body.progress < 0 || body.progress > 100) {
      return createErrorResponse("Progress must be between 0 and 100", 400)
    }

    // Update status based on progress
    let status = body.status
    if (!status) {
      if (body.progress === 0) {
        status = "Not Started"
      } else if (body.progress === 100) {
        status = "Completed"
      } else {
        status = "In Progress"
      }
    }

    const updateData = {
      progress: body.progress,
      status,
      ...(body.accuracy !== undefined && { accuracy: body.accuracy }),
      ...(body.speed !== undefined && { speed: body.speed }),
      ...(body.score !== undefined && { score: body.score }),
    }

    const updatedChapter = await db.updateChapterProgress(params.id, updateData)

    if (!updatedChapter) {
      return createErrorResponse("Chapter not found", 404)
    }

    return createApiResponse(updatedChapter, "Chapter progress updated successfully")
  } catch (error) {
    return handleApiError(error)
  }
}
