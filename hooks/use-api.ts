"use client"

import { useState, useEffect } from "react"
import type { ApiResponse } from "@/types/api"

interface UseApiOptions {
  immediate?: boolean
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: any[]) => Promise<T | null>
  reset: () => void
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {},
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = async (...args: any[]): Promise<T | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiFunction(...args)

      if (response.success && response.data) {
        setData(response.data)
        return response.data
      } else {
        setError(response.error || "An error occurred")
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error"
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  useEffect(() => {
    if (options.immediate) {
      execute()
    }
  }, [])

  return { data, loading, error, execute, reset }
}
