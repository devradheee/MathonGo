import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Subject } from "@/types/chapter"

interface FiltersState {
  activeSubject: Subject
  showWeakChapters: boolean
  sortAscending: boolean
  statusFilter: "all" | "not-started"
  classFilters: string[]
  unitFilters: string[]
  searchQuery: string
}

const initialState: FiltersState = {
  activeSubject: "physics",
  showWeakChapters: false,
  sortAscending: true,
  statusFilter: "all",
  classFilters: [],
  unitFilters: [],
  searchQuery: "",
}

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setActiveSubject: (state, action: PayloadAction<Subject>) => {
      state.activeSubject = action.payload
      // Reset filters when changing subject
      state.classFilters = []
      state.unitFilters = []
      state.statusFilter = "all"
      state.showWeakChapters = false
      state.searchQuery = ""
    },
    toggleWeakChapters: (state) => {
      state.showWeakChapters = !state.showWeakChapters
    },
    toggleSorting: (state) => {
      state.sortAscending = !state.sortAscending
    },
    setStatusFilter: (state, action: PayloadAction<"all" | "not-started">) => {
      state.statusFilter = action.payload
    },
    toggleClassFilter: (state, action: PayloadAction<string>) => {
      const classValue = action.payload
      if (state.classFilters.includes(classValue)) {
        state.classFilters = state.classFilters.filter((c) => c !== classValue)
      } else {
        state.classFilters.push(classValue)
      }
    },
    toggleUnitFilter: (state, action: PayloadAction<string>) => {
      const unitValue = action.payload
      if (state.unitFilters.includes(unitValue)) {
        state.unitFilters = state.unitFilters.filter((u) => u !== unitValue)
      } else {
        state.unitFilters.push(unitValue)
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    resetFilters: (state) => {
      state.classFilters = []
      state.unitFilters = []
      state.statusFilter = "all"
      state.showWeakChapters = false
      state.searchQuery = ""
    },
  },
})

export const {
  setActiveSubject,
  toggleWeakChapters,
  toggleSorting,
  setStatusFilter,
  toggleClassFilter,
  toggleUnitFilter,
  setSearchQuery,
  resetFilters,
} = filtersSlice.actions

export default filtersSlice.reducer
