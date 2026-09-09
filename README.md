# Next.js Template

Opinionated [Next.js](https://nextjs.org) template: App Router, React 19,
Tailwind CSS v4, shadcn/ui, React Hook Form + zod, and unit / E2E testing
ready out of the box.

## Tech stack

| Area            | Tool                                                         |
| --------------- | ------------------------------------------------------------ |
| Framework       | Next.js 16 (App Router, `cacheComponents`/PPR, typed routes) |
| UI runtime      | React 19 with React Compiler enabled                         |
| Styling         | Tailwind CSS v4 (CSS-first config) + `tw-animate-css`        |
| Components      | shadcn/ui (`base-nova` style) on top of Base UI              |
| Icons           | Tabler Icons                                                 |
| Forms           | React Hook Form + `@hookform/resolvers` validating with zod  |
| Theming         | `next-themes` (class-based dark mode)                        |
| Fonts           | Inter, Noto Serif and JetBrains Mono via `next/font/google`  |
| Language        | TypeScript (strict)                                          |
| Unit testing    | Vitest 4 + Testing Library (jsdom)                           |
| E2E testing     | Playwright (Chromium)                                        |
| Lint/format     | ESLint 9 flat config + Prettier                              |
| Package manager | pnpm                                                         |

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/                  # Routes (App Router): compose features, no logic
  layout.tsx          #   Root layout: fonts + AppProviders
  page.tsx            #   Home page
  globals.css         #   Tailwind v4 entry + design tokens
features/             # One folder per domain (see Architecture below)
  <name>/
    components/       #   UI of the domain
    hooks/            #   Hooks of the domain
    lib/              #   Private helpers (never import from another feature)
    schemas/          #   zod schemas (forms and server share them)
    server/           #   One file per server function, descriptive name
    types.ts          #   Types of the domain
shared/               # Code with no feature: innate or promoted on second use
  components/
    ui/               #   shadcn/ui primitives
    container.tsx     #   Polymorphic layout wrapper (Base UI useRender)
  hooks/
  providers/
    app-providers.tsx        # Composes all app providers in one component
    theme-provider.tsx       # next-themes wrapper + dark mode hotkey (d)
  types/                     # Shared/generated types (e.g. Supabase database.ts)
e2e/                  # Playwright specs
```

Path alias: `@/*` maps to the project root.

## Architecture

Screaming architecture: domain code lives in `features/<name>/`, so the
folder tree names what the product does. `app/` only composes routes and
`shared/` only holds code that belongs to no feature.

### Deciding where code goes

1. Belongs to a domain (posts, billing, auth)? → `features/<domain>/...`
2. Used by 2+ features, or a shared/generated type? → `shared/...`
3. Unsure? Start in `features/` and promote to `shared/` when a second
   feature needs it: move the file, never duplicate it.

There is no top-level `lib/`, `utils/` or `helpers/` — generic folders
become junk drawers. `lib/` exists only inside a feature and is private
to it: never import another feature's `lib/`.

### Anatomy of a feature

| Folder        | Holds                                                  |
| ------------- | ------------------------------------------------------ |
| `components/` | UI of the domain                                       |
| `hooks/`      | Hooks of the domain                                    |
| `lib/`        | Private helpers (same feature only)                    |
| `schemas/`    | zod schemas, shared by forms and server functions      |
| `server/`     | Server functions, one per file with a descriptive name |
| `types.ts`    | Interfaces and types of the domain                     |

Tests live next to their source as `*.test.ts(x)`.

### Server functions

Each function (or cohesive piece of logic) gets its own file in
`features/<name>/server/`. Each file imports `server-only` (if it's only
callable from the server) and validates input with `../schemas`.
Read functions use `"use cache"` so they work with `cacheComponents` and
are called from Server Components; writes use `"use server"` and may be
imported directly by Client Components (event handlers, `useActionState`)
or passed down as props. Next.js itself imposes no file organization here
— one-function-per-file is this template's convention to keep `server/`
screaming what it does.

### Shared code and types

`shared/` code arrives two ways: **innate** (never belonged to a feature:
shadcn primitives, `Container`, providers) or
**promoted** (born in a feature, moved when a second one needed it).

Types follow the same split: domain types live in
`features/<name>/types.ts`; shared or generated types live in
`shared/types/` — e.g. a Supabase project's generated `database.ts`
goes there, and features import from it instead of each defining their
own rows.

## Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `pnpm dev`           | Start the development server |
| `pnpm build`         | Production build             |
| `pnpm start`         | Serve the production build   |
| `pnpm lint`          | ESLint                       |
| `pnpm format`        | Prettier                     |
| `pnpm typecheck`     | `tsc --noEmit`               |
| `pnpm test`          | Vitest unit tests            |
| `pnpm test:watch`    | Vitest in watch mode         |
| `pnpm test:coverage` | Vitest with v8 coverage      |
| `pnpm test:e2e`      | Playwright end-to-end tests  |
| `pnpm test:e2e:ui`   | Playwright UI mode           |

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

;<Container render={<section />}>{children}</Container>
```

## Optional features

Not included by default. Add only when you need them:

| Package                                      | What it is                                 | Add it when                                              |
| -------------------------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| TanStack Query                               | Client server-state cache and sync         | You fetch on the client and need caching/dedup/retries   |
| [nuqs](https://nuqs.47ng.com)                | Type-safe URL search params as React state | Filters, pagination or sorting must live in the URL      |
| [date-fns](https://date-fns.org)             | Date parsing, formatting and manipulation  | You display or compute dates beyond `toLocaleDateString` |
| [better-auth](https://www.better-auth.com)   | Authentication with sessions and providers | You need signup, login or session handling               |
| [openapi-typescript](https://openapi-ts.dev) | TypeScript types generated from OpenAPI    | You consume an OpenAPI backend and want typed clients    |
| [motion](https://motion.dev)                 | Animations, transitions and gestures       | You need animation beyond CSS transitions                |

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
- Coverage via v8, scoped to `app/`, `features/` and `shared/`.

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
