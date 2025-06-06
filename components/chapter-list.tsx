"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ArrowUpDown } from "lucide-react"
import ChapterCard from "./chapter-card"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  setActiveSubject,
  toggleWeakChapters,
  toggleSorting,
  setStatusFilter,
  toggleClassFilter,
  toggleUnitFilter,
  resetFilters,
} from "@/lib/features/filters/filtersSlice"
import type { Chapter, Subject } from "@/lib/types"
import { mockChapters } from "@/lib/mock-data"

export default function ChapterList() {
  const dispatch = useAppDispatch()
  const { activeSubject, showWeakChapters, sortAscending, statusFilter, classFilters, unitFilters } = useAppSelector(
    (state) => state.filters,
  )

  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([])
  const [uniqueClasses, setUniqueClasses] = useState<string[]>([])
  const [uniqueUnits, setUniqueUnits] = useState<string[]>([])

  // Get unique classes and units for the active subject
  useEffect(() => {
    const subjectChapters = mockChapters.filter((chapter) => chapter.subject === activeSubject)

    const classes = Array.from(new Set(subjectChapters.map((chapter) => chapter.class)))
    setUniqueClasses(classes)

    const units = Array.from(new Set(subjectChapters.map((chapter) => chapter.unit)))
    setUniqueUnits(units)
  }, [activeSubject])

  // Apply filters and sorting
  useEffect(() => {
    let result = mockChapters.filter((chapter) => chapter.subject === activeSubject)

    // Apply class filters if any are selected
    if (classFilters.length > 0) {
      result = result.filter((chapter) => classFilters.includes(chapter.class))
    }

    // Apply unit filters if any are selected
    if (unitFilters.length > 0) {
      result = result.filter((chapter) => unitFilters.includes(chapter.unit))
    }

    // Apply status filter if selected
    if (statusFilter === "not-started") {
      result = result.filter((chapter) => chapter.status === "Not Started")
    }

    // Apply weak chapters filter if enabled
    if (showWeakChapters) {
      result = result.filter((chapter) => chapter.isWeak)
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortAscending) {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })

    setFilteredChapters(result)
  }, [activeSubject, showWeakChapters, sortAscending, statusFilter, classFilters, unitFilters])

  const handleResetFilters = () => {
    dispatch(resetFilters())
  }

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="physics"
        value={activeSubject}
        onValueChange={(value) => dispatch(setActiveSubject(value as Subject))}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="physics">Physics</TabsTrigger>
          <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
          <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
        </TabsList>

        {["physics", "chemistry", "mathematics"].map((subject) => (
          <TabsContent key={subject} value={subject} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                {/* Class Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      Class
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Select Classes</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {uniqueClasses.map((cls) => (
                      <DropdownMenuCheckboxItem
                        key={cls}
                        checked={classFilters.includes(cls)}
                        onCheckedChange={() => dispatch(toggleClassFilter(cls))}
                      >
                        {cls}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Unit Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      Units
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Select Units</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {uniqueUnits.map((unit) => (
                      <DropdownMenuCheckboxItem
                        key={unit}
                        checked={unitFilters.includes(unit)}
                        onCheckedChange={() => dispatch(toggleUnitFilter(unit))}
                      >
                        {unit}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Status Filter */}
                <Button
                  variant={statusFilter === "not-started" ? "default" : "outline"}
                  onClick={() => dispatch(setStatusFilter(statusFilter === "not-started" ? "all" : "not-started"))}
                >
                  Not Started
                </Button>

                {/* Reset Filters */}
                {(classFilters.length > 0 || unitFilters.length > 0 || statusFilter !== "all" || showWeakChapters) && (
                  <Button variant="ghost" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Weak Chapters Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="weak-chapters"
                    checked={showWeakChapters}
                    onCheckedChange={() => dispatch(toggleWeakChapters())}
                  />
                  <Label htmlFor="weak-chapters">Weak Chapters</Label>
                </div>

                {/* Sort Toggle */}
                <Button variant="outline" size="icon" onClick={() => dispatch(toggleSorting())}>
                  <ArrowUpDown className={`h-4 w-4 ${sortAscending ? "" : "rotate-180"}`} />
                </Button>
              </div>
            </div>

            {/* Chapter Count */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-sm">
                {filteredChapters.length} Chapters
              </Badge>
            </div>

            {/* Chapter List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChapters.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))}
            </div>

            {filteredChapters.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No chapters found with the selected filters.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
