"use client"

import { getQueryClient } from "@/shared/lib/tanstack-query/get-query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { QueryDevtools } from "./query-devtools"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <QueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  )
}
