import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  Atom,
  BookOpen,
  Brain,
  Calculator,
  BarChartIcon as ChartBar,
  CircleOff,
  Compass,
  Dna,
  FlaskConical,
  Gauge,
  Lightbulb,
  Microscope,
  Orbit,
  Ruler,
  Sigma,
  Waves,
  Zap,
} from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to get a random icon for a chapter based on its ID
export function getChapterIcon(chapterId: string) {
  // Use the chapter ID to deterministically select an icon
  const icons = [
    Atom,
    BookOpen,
    Brain,
    Calculator,
    ChartBar,
    CircleOff,
    Compass,
    Dna,
    FlaskConical,
    Gauge,
    Lightbulb,
    Microscope,
    Orbit,
    Ruler,
    Sigma,
    Waves,
    Zap,
  ]

  // Use the sum of character codes in the ID to select an icon
  const charSum = chapterId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)

  return icons[charSum % icons.length]
}
