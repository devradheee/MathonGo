import type { Subject } from "@/types/chapter"

export interface User {
  id: string
  email: string
  name: string
  avatar: string
  preferences: {
    theme: "light" | "dark" | "system"
    notifications: boolean
    defaultSubject: Subject
  }
  createdAt: Date
  lastLogin: Date
}

export interface UserProgress {
  id: string
  userId: string
  chapterId: string
  progress: number
  timeSpent: number
  lastAccessed: Date
  questionsAttempted: number
  questionsCorrect: number
}

export interface Analytics {
  totalChapters: number
  completedChapters: number
  inProgressChapters: number
  notStartedChapters: number
  weakChapters: number
  averageAccuracy: number
  averageSpeed: number
  averageScore: number
  totalProgress: number
  subjectBreakdown: {
    physics: SubjectStats
    chemistry: SubjectStats
    mathematics: SubjectStats
  }
}

export interface SubjectStats {
  total: number
  completed: number
  inProgress: number
  weak: number
  averageProgress: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Re-export existing types
export type { Chapter, ChapterStatus } from "@/types/chapter"
