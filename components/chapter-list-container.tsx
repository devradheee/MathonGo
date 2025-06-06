"use client"

import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ArrowUpDown, Search, Filter, X } from "lucide-react"
import ChapterCard from "./chapter-card"
import type { RootState } from "@/store/store"
import {
  setActiveSubject,
  toggleWeakChapters,
  toggleSorting,
  setStatusFilter,
  toggleClassFilter,
  toggleUnitFilter,
  resetFilters,
  setSearchQuery,
} from "@/store/slices/filtersSlice"
import type { Subject } from "@/types/chapter"
import { mockChaptersData } from "@/data/mock-chapters"

export default function ChapterListContainer() {
  const dispatch = useDispatch()
  const { activeSubject, showWeakChapters, sortAscending, statusFilter, classFilters, unitFilters, searchQuery } =
    useSelector((state: RootState) => state.filters)

  // Get chapters for active subject
  const subjectChapters = useMemo(() => {
    return mockChaptersData.filter((chapter) => chapter.subject === activeSubject)
  }, [activeSubject])

  // Get unique classes and units for the active subject
  const { uniqueClasses, uniqueUnits } = useMemo(() => {
    const classes = Array.from(new Set(subjectChapters.map((chapter) => chapter.class))).sort()
    const units = Array.from(new Set(subjectChapters.map((chapter) => chapter.unit))).sort()
    return { uniqueClasses: classes, uniqueUnits: units }
  }, [subjectChapters])

  // Apply all filters and sorting
  const filteredChapters = useMemo(() => {
    let result = [...subjectChapters]

    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter((chapter) => chapter.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply class filters
    if (classFilters.length > 0) {
      result = result.filter((chapter) => classFilters.includes(chapter.class))
    }

    // Apply unit filters
    if (unitFilters.length > 0) {
      result = result.filter((chapter) => unitFilters.includes(chapter.unit))
    }

    // Apply status filter
    if (statusFilter === "not-started") {
      result = result.filter((chapter) => chapter.status === "Not Started")
    }

    // Apply weak chapters filter
    if (showWeakChapters) {
      result = result.filter((chapter) => chapter.isWeak)
    }

    // Apply sorting
    result.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name)
      return sortAscending ? comparison : -comparison
    })

    return result
  }, [subjectChapters, searchQuery, classFilters, unitFilters, statusFilter, showWeakChapters, sortAscending])

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (classFilters.length > 0) count++
    if (unitFilters.length > 0) count++
    if (statusFilter !== "all") count++
    if (showWeakChapters) count++
    if (searchQuery.trim()) count++
    return count
  }, [classFilters, unitFilters, statusFilter, showWeakChapters, searchQuery])

  const handleSubjectChange = (subject: Subject) => {
    dispatch(setActiveSubject(subject))
  }

  const handleResetFilters = () => {
    dispatch(resetFilters())
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chapters</h2>
          <p className="text-muted-foreground">Manage and track your learning progress across subjects</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search chapters..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => dispatch(setSearchQuery(""))}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeSubject} onValueChange={handleSubjectChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="physics" className="flex items-center gap-2">
            <span className="text-lg">⚛️</span>
            Physics
          </TabsTrigger>
          <TabsTrigger value="chemistry" className="flex items-center gap-2">
            <span className="text-lg">🧪</span>
            Chemistry
          </TabsTrigger>
          <TabsTrigger value="mathematics" className="flex items-center gap-2">
            <span className="text-lg">📐</span>
            Mathematics
          </TabsTrigger>
        </TabsList>

        {(["physics", "chemistry", "mathematics"] as Subject[]).map((subject) => (
          <TabsContent key={subject} value={subject} className="space-y-6">
            {/* Filters Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex flex-wrap gap-3">
                {/* Class Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      Class
                      {classFilters.length > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                          {classFilters.length}
                        </Badge>
                      )}
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
                      {unitFilters.length > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                          {unitFilters.length}
                        </Badge>
                      )}
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
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" onClick={handleResetFilters} className="text-destructive">
                    <Filter className="h-4 w-4 mr-2" />
                    Reset ({activeFiltersCount})
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
                  <Label htmlFor="weak-chapters" className="text-sm font-medium">
                    Weak Chapters
                  </Label>
                </div>

                {/* Sort Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(toggleSorting())}
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown className={`h-4 w-4 ${sortAscending ? "" : "rotate-180"}`} />
                  Sort {sortAscending ? "A-Z" : "Z-A"}
                </Button>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {filteredChapters.length} of {subjectChapters.length} chapters
                </Badge>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} applied
                  </Badge>
                )}
              </div>
            </div>

            {/* Chapter Grid */}
            {filteredChapters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredChapters.map((chapter) => (
                  <ChapterCard key={chapter.id} chapter={chapter} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No chapters found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                {activeFiltersCount > 0 && (
                  <Button variant="outline" onClick={handleResetFilters}>
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
