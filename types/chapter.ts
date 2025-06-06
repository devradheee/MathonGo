export type Subject = "physics" | "chemistry" | "mathematics"

export type ChapterStatus = "Completed" | "In Progress" | "Not Started"

export interface Chapter {
  id: string
  name: string
  subject: Subject
  class: string
  unit: string
  status: ChapterStatus
  progress: number
  questionsCount: number
  accuracy: number
  accuracyChange: number
  speed: number
  speedChange: number
  score: number
  scoreChange: number
  isWeak: boolean
}
