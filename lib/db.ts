import type { Chapter, Subject, User, UserProgress, Analytics } from "@/types/api"
import { mockChaptersData } from "@/data/mock-chapters"

// Simulated database using JSON files
// In production, replace with actual database (PostgreSQL, MongoDB, etc.)

export class Database {
  private static instance: Database
  private chapters: Chapter[] = mockChaptersData
  private users: User[] = [
    {
      id: "user-1",
      email: "student@mathongo.com",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      preferences: {
        theme: "system",
        notifications: true,
        defaultSubject: "physics",
      },
      createdAt: new Date("2024-01-01"),
      lastLogin: new Date(),
    },
  ]
  private userProgress: UserProgress[] = []

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  // Chapter operations
  async getChapters(filters?: {
    subject?: Subject
    class?: string
    unit?: string
    status?: string
    isWeak?: boolean
    search?: string
  }): Promise<Chapter[]> {
    let result = [...this.chapters]

    if (filters) {
      if (filters.subject) {
        result = result.filter((chapter) => chapter.subject === filters.subject)
      }
      if (filters.class) {
        result = result.filter((chapter) => chapter.class === filters.class)
      }
      if (filters.unit) {
        result = result.filter((chapter) => chapter.unit === filters.unit)
      }
      if (filters.status) {
        result = result.filter((chapter) => chapter.status === filters.status)
      }
      if (filters.isWeak !== undefined) {
        result = result.filter((chapter) => chapter.isWeak === filters.isWeak)
      }
      if (filters.search) {
        result = result.filter((chapter) => chapter.name.toLowerCase().includes(filters.search!.toLowerCase()))
      }
    }

    return result
  }

  async getChapterById(id: string): Promise<Chapter | null> {
    return this.chapters.find((chapter) => chapter.id === id) || null
  }

  async updateChapterProgress(id: string, progress: Partial<Chapter>): Promise<Chapter | null> {
    const chapterIndex = this.chapters.findIndex((chapter) => chapter.id === id)
    if (chapterIndex === -1) return null

    this.chapters[chapterIndex] = { ...this.chapters[chapterIndex], ...progress }
    return this.chapters[chapterIndex]
  }

  // User operations
  async getUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async updateUserPreferences(userId: string, preferences: Partial<User["preferences"]>): Promise<User | null> {
    const userIndex = this.users.findIndex((user) => user.id === userId)
    if (userIndex === -1) return null

    this.users[userIndex].preferences = { ...this.users[userIndex].preferences, ...preferences }
    return this.users[userIndex]
  }

  // Analytics operations
  async getAnalytics(userId: string, subject?: Subject): Promise<Analytics> {
    const chapters = subject ? this.chapters.filter((c) => c.subject === subject) : this.chapters

    const totalChapters = chapters.length
    const completedChapters = chapters.filter((c) => c.status === "Completed").length
    const inProgressChapters = chapters.filter((c) => c.status === "In Progress").length
    const notStartedChapters = chapters.filter((c) => c.status === "Not Started").length
    const weakChapters = chapters.filter((c) => c.isWeak).length

    const averageAccuracy = chapters.reduce((sum, c) => sum + c.accuracy, 0) / totalChapters
    const averageSpeed = chapters.reduce((sum, c) => sum + c.speed, 0) / totalChapters
    const averageScore = chapters.reduce((sum, c) => sum + c.score, 0) / totalChapters
    const totalProgress = chapters.reduce((sum, c) => sum + c.progress, 0) / totalChapters

    return {
      totalChapters,
      completedChapters,
      inProgressChapters,
      notStartedChapters,
      weakChapters,
      averageAccuracy: Math.round(averageAccuracy),
      averageSpeed: Math.round(averageSpeed),
      averageScore: Math.round(averageScore * 10) / 10,
      totalProgress: Math.round(totalProgress),
      subjectBreakdown: {
        physics: this.getSubjectStats("physics"),
        chemistry: this.getSubjectStats("chemistry"),
        mathematics: this.getSubjectStats("mathematics"),
      },
    }
  }

  private getSubjectStats(subject: Subject) {
    const subjectChapters = this.chapters.filter((c) => c.subject === subject)
    return {
      total: subjectChapters.length,
      completed: subjectChapters.filter((c) => c.status === "Completed").length,
      inProgress: subjectChapters.filter((c) => c.status === "In Progress").length,
      weak: subjectChapters.filter((c) => c.isWeak).length,
      averageProgress: Math.round(subjectChapters.reduce((sum, c) => sum + c.progress, 0) / subjectChapters.length),
    }
  }
}

export const db = Database.getInstance()
