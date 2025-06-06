import {
  Atom,
  Calculator,
  BarChart3,
  Compass,
  Dna,
  FlaskConical,
  Gauge,
  Microscope,
  Orbit,
  Ruler,
  Sigma,
  Waves,
  Zap,
  Triangle,
  PieChart,
  TrendingUp,
  Target,
  Layers,
  Grid3X3,
  Infinity,
  RotateCcw,
  Magnet,
  Eye,
  Thermometer,
  Beaker,
  Flame,
  Droplets,
  Sparkles,
  Hexagon,
  MicroscopeIcon as Molecule,
} from "lucide-react"

// Function to get a deterministic icon for a chapter based on its ID
export function getChapterIcon(chapterId: string) {
  // Physics icons
  const physicsIcons = [
    Atom, // Atomic/Nuclear physics
    Zap, // Electricity
    Magnet, // Magnetism
    Waves, // Wave physics
    Orbit, // Mechanics/Motion
    Thermometer, // Heat/Thermodynamics
    Eye, // Optics
    Gauge, // Measurements
    RotateCcw, // Rotational motion
    Target, // Forces
  ]

  // Chemistry icons
  const chemistryIcons = [
    FlaskConical, // General chemistry
    Beaker, // Solutions/Reactions
    Flame, // Thermochemistry
    Droplets, // States of matter
    Sparkles, // Chemical reactions
    Hexagon, // Organic chemistry
    Molecule, // Molecular structure
    Layers, // Periodic table
    Dna, // Biochemistry
    Microscope, // Analysis
  ]

  // Mathematics icons
  const mathIcons = [
    Calculator, // General math
    Sigma, // Summation/Series
    Triangle, // Trigonometry
    PieChart, // Statistics
    TrendingUp, // Calculus/Derivatives
    Grid3X3, // Matrices/Algebra
    Infinity, // Limits/Infinity
    Compass, // Geometry
    BarChart3, // Data/Probability
    Ruler, // Measurements
  ]

  // Determine which icon set to use based on chapter ID prefix
  let iconSet = physicsIcons
  if (chapterId.startsWith("chem")) {
    iconSet = chemistryIcons
  } else if (chapterId.startsWith("math")) {
    iconSet = mathIcons
  }

  // Use the sum of character codes in the ID to select an icon deterministically
  const charSum = chapterId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)

  return iconSet[charSum % iconSet.length]
}
