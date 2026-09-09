# tmpl_blank

Blank starter template. Single page, ready to build on.

## Stack

- **Frontend**: React 19, Vite 8, TypeScript
- **Routing**: TanStack Router (code-based, defined in `src/main.tsx`)
- **State**: Zustand (stores), TanStack Query (server state)
- **Styling**: Tailwind CSS 4 (CSS-first config in `src/index.css`), shadcn/ui (Radix primitives)
- **Linting**: Biome (`biome.json`)
- **API server**: Hono + bun:sqlite (`server.ts`)
- **Runtime**: Bun

## File Structure

```
src/
  main.tsx          -- App entry + route definitions
  index.css         -- Tailwind 4 theme + design tokens
  pages/            -- Page components (one per route)
  components/       -- Reusable components
  components/ui/    -- shadcn/ui primitives
  hooks/            -- Custom hooks
  lib/              -- Utilities (utils.ts, db.ts)
server.ts           -- Hono API server (bun:sqlite backend)
vite.config.ts      -- Vite config + Tailwind plugin
biome.json          -- Linter/formatter config
tsconfig.json       -- TypeScript config
```

## Routing

Routes are defined in `src/main.tsx` using code-based TanStack Router:
- `/` - `src/pages/Index.tsx`
- `*` (404) - `src/pages/NotFound.tsx`

Add new routes by creating a page in `src/pages/`, then adding a `createRoute()` call in `main.tsx`.

For navigation, use `<Link to="...">` from `@tanstack/react-router`. Never use `<a href>` for internal links.

## Design System

Colors and theme tokens are CSS custom properties in `src/index.css`. The `@theme inline` block maps them to Tailwind utilities (`bg-background`, `text-foreground`, etc.). Edit the `:root` block to change colors.

## API

`server.ts` runs a Hono server on PORT+1000. Vite proxies `/api/*` to it in dev. In production, the Hono server serves both the API and the built static files.

Add API routes in `server.ts`. The SQLite database (`data.db`) is available via `bun:sqlite`.

## Commands

- `bun run dev` -- Start frontend + API (concurrent)
- `bun run build` -- Production build
- `bun run serve` -- Production server
- `bun run check` -- Lint + format check (Biome)
- `bun run check:fix` -- Auto-fix lint/format issues

## Reproducible dependencies

Keep React and React DOM at the same exact version. Use `bun add react@<version> react-dom@<version>` and commit both `package.json` and `bun.lock` together. Daemon setup uses a frozen install and runs `bun run check:runtime` before starting Vite; editing a dependency without updating the lock must fail startup.

Run `bun run check`, `bun run type-check`, `bun run test`, `bun run check:runtime`, and `bun run build` before publishing a template change. The CI matrix covers the deployed Bun 1.2.12 runtime and Bun 1.3.11.
