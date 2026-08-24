"use client"

import { lazy, Suspense } from "react"

const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((m) => ({
    default: m.ReactQueryDevtools,
  }))
)

type QueryDevtoolsProps = {
  initialIsOpen?: boolean
  buttonPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

export function QueryDevtools(props: QueryDevtoolsProps) {
  return (
    <Suspense fallback={null}>
      <ReactQueryDevtools {...props} />
    </Suspense>
  )
}
