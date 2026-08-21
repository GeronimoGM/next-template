"use client"

import dynamic from "next/dynamic"

export const QueryDevtools = dynamic(
  () => import("@tanstack/react-query-devtools").then((m) => m.ReactQueryDevtools),
  { ssr: false }
)
