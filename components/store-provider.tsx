"use client"

import type React from "react"

import { store } from "@/lib/store"
import { Provider } from "react-redux"

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
