<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

Instructions for AI coding agents working in this repo. `README.md` is the
human-facing doc; this file optimizes for you: exact commands, hard rules,
and gotchas that are not obvious from the code.

## Stack

Next.js 16 (App Router) · React 19 + React Compiler · TypeScript strict ·
Tailwind CSS v4 · shadcn/ui (base-nova, Base UI) · TanStack Query v5 ·
React Hook Form + @hookform/resolvers + zod v4 · next-themes · Vitest 4 +
Testing Library · Playwright. Package manager: **pnpm only**.

## Commands

```bash
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint (flat config)
pnpm build       # production build (also type-checks)
pnpm test        # vitest (passes with no tests found)
pnpm format      # prettier --write "**/*.{ts,tsx}"
pnpm dev         # dev server on :3000
```

Definition of done for any change: `pnpm typecheck && pnpm lint && pnpm build`
exit clean. If typecheck fails with stale generated types after deleting a
route, run `rm -rf .next` and retry.

## Project map

```
app/                  # Routes only. layout.tsx wires fonts + <AppProviders>
shared/
  components/ui/      # shadcn primitives (add via npx shadcn@latest add X)
  components/         # Shared components (e.g. container.tsx)
  lib/tanstack-query/ # get-query-client.ts, prefetch-queries.ts (server-only)
  providers/          # app-providers.tsx composes ALL providers
e2e/                  # Playwright specs only
```

Alias: `@/*` → project root.

## Hard rules

- `cacheComponents` is ON. Any uncached data fetch in a Server Component
  must sit inside a `<Suspense>` boundary or the build fails. For TanStack
  Query SSR use the pattern in README ("Server-side prefetching"):
  `prefetchQueries(...)` + `<HydrationBoundary>`.
- React Compiler is ON. Do not add manual `useMemo` / `useCallback` /
  `React.memo` unless there is a measured problem.
- Never instantiate `QueryClient` in components. Use `getQueryClient()`;
  server-side prefetching goes through `prefetchQueries()` from
  `shared/lib/tanstack-query/prefetch-queries.ts` (`server-only` guarded).
- New global providers go in `shared/providers/app-providers.tsx`, never
  directly in `app/layout.tsx`.
- Tailwind v4 has no config file. Theme tokens live in `app/globals.css`
  (`@theme`). Semantic spacing utilities are available (`p-md`, `gap-lg`,
  `py-xl`, ...). Class order is enforced by prettier-plugin-tailwindcss.
- Routes are typed (`typedRoutes`). `<Link href>` values must match real
  routes.
- pnpm uses strict node_modules: anything you import must be declared in
  `package.json`. Server modules use the `server-only` package as guard.
- Icons come from `@tabler/icons-react` (shadcn registry is configured with
  `iconLibrary: tabler`).

## Conventions

- Prettier: no semicolons, double quotes, width 80, trailing commas es5.
- Do not add comments to code unless asked; the codebase is comment-free.
- Dark mode toggles with the `d` key (handled inside ThemeProvider).
- Dev-only code gates on `process.env.NODE_ENV === "development"` and gets
  dead-code-eliminated at build.

## Testing

- Unit (Vitest): jsdom, globals enabled — `describe/it/expect` need no
  imports; types are wired via `vitest.setup.ts`. Common browser mocks
  (`matchMedia`, `ResizeObserver`, `IntersectionObserver`, scroll) already
  exist there. Co-locate specs as `*.test.tsx` next to the source.
- E2E (Playwright): put specs in `e2e/` only. The config auto-starts the
  server (`pnpm dev` locally, build+start on CI) at `localhost:3000`.
- Coverage is v8, scoped to `app/**` and `shared/**`.

## Reference docs

- Framework behavior: bundled docs at `node_modules/next/dist/docs/`
  (version-specific — trust these over memory).
- TanStack Query SSR: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
