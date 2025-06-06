import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse } from "@/types/api"

export function createApiResponse<T>(data?: T, message?: string, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: status < 400,
      data,
      message,
    },
    { status },
  )
}

export function createErrorResponse(error: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status },
  )
}

export function getQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  return Object.fromEntries(searchParams.entries())
}

export function validateRequired(data: Record<string, any>, required: string[]): string | null {
  for (const field of required) {
    if (!data[field]) {
      return `Missing required field: ${field}`
    }
  }
  return null
}

export async function handleApiError(error: unknown): Promise<NextResponse<ApiResponse>> {
  console.error("API Error:", error)

  if (error instanceof Error) {
    return createErrorResponse(error.message, 500)
  }

  return createErrorResponse("Internal server error", 500)
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}
