import type { ApiResponse, Chapter, User, Analytics, Subject } from "@/types/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}/api${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      return data
    } catch (error) {
      throw new Error(`API request failed: ${error}`)
    }
  }

  // Chapter APIs
  async getChapters(filters?: {
    subject?: Subject
    class?: string
    unit?: string
    status?: string
    isWeak?: boolean
    search?: string
  }): Promise<ApiResponse<Chapter[]>> {
    const params = new URLSearchParams()

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value))
        }
      })
    }

    const query = params.toString()
    return this.request<Chapter[]>(`/chapters${query ? `?${query}` : ""}`)
  }

  async getChapter(id: string): Promise<ApiResponse<Chapter>> {
    return this.request<Chapter>(`/chapters/${id}`)
  }

  async updateChapterProgress(id: string, progress: Partial<Chapter>): Promise<ApiResponse<Chapter>> {
    return this.request<Chapter>(`/chapters/${id}/progress`, {
      method: "PUT",
      body: JSON.stringify(progress),
    })
  }

  // Analytics APIs
  async getDashboardAnalytics(subject?: Subject): Promise<ApiResponse<Analytics>> {
    const params = subject ? `?subject=${subject}` : ""
    return this.request<Analytics>(`/analytics/dashboard${params}`)
  }

  async getSubjectAnalytics(subject: Subject): Promise<ApiResponse<Analytics>> {
    return this.request<Analytics>(`/analytics/subject/${subject}`)
  }

  // User APIs
  async login(
    email: string,
    password: string,
  ): Promise<
    ApiResponse<{
      user: User
      token: string
    }>
  > {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async getUserProfile(userId?: string): Promise<ApiResponse<User>> {
    const params = userId ? `?userId=${userId}` : ""
    return this.request<User>(`/user/profile${params}`)
  }

  async updateUserPreferences(
    preferences: Partial<User["preferences"]>,
    userId?: string,
  ): Promise<ApiResponse<User["preferences"]>> {
    const params = userId ? `?userId=${userId}` : ""
    return this.request<User["preferences"]>(`/user/preferences${params}`, {
      method: "PUT",
      body: JSON.stringify(preferences),
    })
  }

  // Search API
  async searchChapters(query: string, subject?: Subject): Promise<ApiResponse<Chapter[]>> {
    const params = new URLSearchParams({ q: query })
    if (subject) params.append("subject", subject)

    return this.request<Chapter[]>(`/search?${params.toString()}`)
  }

  // Stats API
  async getStats(timeframe?: string): Promise<ApiResponse<any>> {
    const params = timeframe ? `?timeframe=${timeframe}` : ""
    return this.request(`/stats${params}`)
  }
}

export const apiClient = new ApiClient()
