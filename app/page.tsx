import ChapterListContainer from "@/components/chapter-list-container"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Code } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">MathonGo</h1>
            <p className="text-sm text-muted-foreground">Chapter Management System</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/api-demo">
              <Button variant="outline" size="sm">
                <Code className="h-4 w-4 mr-2" />
                API Demo
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ChapterListContainer />
      </main>
    </div>
  )
}
