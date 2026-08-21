# Next.js Template

Opinionated [Next.js](https://nextjs.org) template: App Router, React 19,
Tailwind CSS v4, shadcn/ui, TanStack Query, React Hook Form + zod, and unit /
E2E testing ready out of the box.

## Tech stack

| Area            | Tool                                                              |
| --------------- | ----------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, `cacheComponents`/PPR, typed routes)       |
| UI runtime      | React 19 with React Compiler enabled                               |
| Styling         | Tailwind CSS v4 (CSS-first config) + `tw-animate-css`              |
| Components      | shadcn/ui (`base-nova` style) on top of Base UI                    |
| Icons           | Tabler Icons                                                       |
| Server state    | TanStack Query v5 (+ devtools in development)                      |
| Forms           | React Hook Form + `@hookform/resolvers` validating with zod        |
| Theming         | `next-themes` (class-based dark mode)                              |
| Fonts           | Inter, Noto Serif and JetBrains Mono via `next/font/google`        |
| Language        | TypeScript (strict)                                                |
| Unit testing    | Vitest 4 + Testing Library (jsdom)                                 |
| E2E testing     | Playwright (Chromium)                                              |
| Lint/format     | ESLint 9 flat config + Prettier                                    |
| Package manager | pnpm                                                               |

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/                  # Routes (App Router)
  layout.tsx          #   Root layout: fonts + AppProviders
  page.tsx            #   Home page
  globals.css         #   Tailwind v4 entry + design tokens
shared/
  components/
    ui/               #   shadcn/ui primitives
    container.tsx     #   Polymorphic layout wrapper (Base UI useRender)
  lib/
    utils.ts          #   cn() class merger
    tanstack-query/
      get-query-client.ts    # QueryClient factory (singleton per request/tab)
      prefetch-queries.ts    # Server-only prefetch + dehydrate helper
  providers/
    app-providers.tsx        # Composes all app providers in one component
    query-provider.tsx       # QueryClientProvider + devtools (dev only)
    query-devtools.tsx       # Dynamic import, client-only
    theme-provider.tsx       # next-themes wrapper + dark mode hotkey (d)
e2e/                  # Playwright specs
```

Path alias: `@/*` maps to the project root.

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Start the development server         |
| `pnpm build`        | Production build                     |
| `pnpm start`        | Serve the production build           |
| `pnpm lint`         | ESLint                               |
| `pnpm format`       | Prettier                             |
| `pnpm typecheck`    | `tsc --noEmit`                       |
| `pnpm test`         | Vitest unit tests                    |
| `pnpm test:watch`   | Vitest in watch mode                 |
| `pnpm test:coverage`| Vitest with v8 coverage              |
| `pnpm test:e2e`     | Playwright end-to-end tests          |
| `pnpm test:e2e:ui`  | Playwright UI mode                   |

## Styling & theming

- Tailwind CSS v4 configured CSS-first in `app/globals.css`: no
  `tailwind.config`, theme tokens live in `@theme`.
- shadcn design tokens (colors, radius scale) exposed as CSS variables with a
  `.dark` class variant.
- Semantic spacing utilities from `tw-spacing-semantics-plugin`
  (`p-md`, `gap-lg`, `py-xl`, ...).
- Dark mode managed by `next-themes` (system default). Press <kbd>d</kbd>
  anywhere to toggle it.

## UI components

Add new primitives with the shadcn CLI:

```bash
npx shadcn@latest add button
```

Components are placed in `shared/components/ui` (see the aliases in
`components.json`) and imported as:

```tsx
import { Button } from "@/shared/components/ui/button"
```

For consistent page layouts, use the shared `<Container>` component, which is
polymorphic through its `render` prop:

```tsx
import { Container } from "@/shared/components/container"

<Container render={<section />}>{children}</Container>
```

## Data fetching with TanStack Query

A `QueryClientProvider` is already set up in `shared/providers/query-provider.tsx`
(singleton per request on the server, singleton per tab on the browser).
Global defaults: `staleTime` of 60s and no retries on HTTP 4xx errors.

### Client-side fetching

Use `useQuery`, `useMutation`, etc. from `@tanstack/react-query` directly in
Client Components.

### Server-side prefetching (SSR + hydration)

From a Server Component, prefetch queries with the `prefetchQueries` helper and
pass the dehydrated state to `<HydrationBoundary>`. The content must be wrapped
in a `<Suspense>` boundary because this template enables `cacheComponents`:
uncached data fetching outside of Suspense breaks the build.

```tsx
// app/posts/page.tsx (Server Component)
import { HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"
import { prefetchQueries } from "@/shared/lib/tanstack-query/prefetch-queries"

async function Posts() {
  const state = await prefetchQueries([
    { queryKey: ["posts"], queryFn: getPosts },
  ])

  return (
    <HydrationBoundary state={state}>
      {/* Client Component using useQuery({ queryKey: ["posts"], ... }) */}
    </HydrationBoundary>
  )
}

export default function PostsPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Posts />
    </Suspense>
  )
}
```

The query key must match between the prefetch and the client-side `useQuery`.
With hydrated data present, the client does not refetch on mount.

Reference: [TanStack Query — Advanced SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr).

## Forms

Forms are handled with [React Hook Form](https://react-hook-form.com) +
[@hookform/resolvers](https://github.com/react-hook-form/resolvers) validating
with `zod`.

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  email: z.email(),
})

export function ContactForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  return (
    <form onSubmit={form.handleSubmit((values) => console.log(values))}>
      <input {...form.register("email")} />
      {form.formState.errors.email && <p>Invalid email</p>}
      <button type="submit">Send</button>
    </form>
  )
}
```

## Testing

### Unit tests (Vitest)

- Environment: jsdom, globals enabled, setup in `vitest.setup.ts` with common
  browser mocks (`matchMedia`, `ResizeObserver`, `IntersectionObserver`,
  scrolling).
- Files: `**/*.{test,spec}.{ts,tsx}` anywhere outside `node_modules`, `.next`,
  `e2e`.
- Coverage via v8, scoped to `app/` and `shared/`.

```tsx
import { render, screen } from "@testing-library/react"

test("renders heading", () => {
  render(<h1>Hello</h1>)
  expect(screen.getByRole("heading")).toHaveTextContent("Hello")
})
```

### E2E tests (Playwright)

Specs live in `e2e/`. The Playwright config starts the dev server
automatically (`pnpm build && pnpm start` on CI) against
`http://localhost:3000`, with traces on first retry and screenshots on failure.

```bash
pnpm test:e2e
```

## Code style

- ESLint 9 flat config with `eslint-config-next` (core-web-vitals +
  TypeScript rules).
- Prettier with the Tailwind class sorting plugin; run `pnpm format`.
- Type checking is standalone: `pnpm typecheck`.
