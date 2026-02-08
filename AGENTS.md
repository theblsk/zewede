# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js App Router project with TypeScript and Tailwind.

- `src/app/`: route tree, locale-aware layouts, public pages, dashboard pages, and server actions.
- `src/components/`: shared UI components and dashboard-specific forms/tables.
- `src/utils/`: utility modules (auth, uploads, menu helpers, Supabase clients).
- `src/utils/supabase/migrations/` and `src/utils/supabase/storage/`: SQL migrations and storage setup scripts.
- `src/validators/`, `src/hooks/`, `src/types/`: validation schemas, custom hooks, and shared types.
- `messages/`: i18n message catalogs (`en.json`, `ar.json`).
- `public/`: static assets (images/icons).

Use the `@/*` path alias for imports from `src`.

## Build, Test, and Development Commands
- `bun run dev` (or `npm run dev`): start the local dev server on `http://localhost:3000`.
- `bun run build` (or `npm run build`): create a production build.
- `bun run start` (or `npm run start`): run the production server.
- `bun run lint` (or `npm run lint`): run ESLint with Next.js + TypeScript rules.

Use Bun by default in this repo (`bun.lock` is present).

## Coding Style & Naming Conventions
- Language: TypeScript (`strict: true` in `tsconfig.json`).
- Indentation: 2 spaces; keep code consistently formatted.
- Components: `PascalCase.tsx` (for example, `CreateMenuItemForm.tsx`).
- Hooks: `useXxx.ts` naming (for example, `useMenuItemForm.ts`).
- Utilities/validators: kebab-case filenames (for example, `image-upload.ts`).
- Run lint before opening a PR; fix warnings/errors instead of suppressing them.

## Testing Guidelines
There is currently no dedicated test runner configured in `package.json`. For now:
- treat `bun run lint` as the required quality gate,
- manually verify critical flows (auth, onboarding, dashboard CRUD, locale switching),
- add tests with new feature work when introducing non-trivial logic.

## Commit & Pull Request Guidelines
Recent history uses a short prefix style such as `[FEAT]: ...`.

- Commit format: `[TYPE]: imperative summary` (example: `[FIX]: Prevent duplicate category order`).
- Keep commits focused and atomic.
- PRs should include: purpose, scope, screenshots for UI changes, migration notes (if SQL changed), and linked issue/task.
- Call out environment/config changes explicitly (for example, Supabase or `.env.local` requirements).
