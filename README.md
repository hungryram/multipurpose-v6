# Multipurpose v6

Simple monorepo for client websites.

- `packages/web`: Next.js frontend (App Router)
- `packages/cms`: Sanity Studio (content + page builder)

## What This Project Is

This starter lets non-dev users build pages in Sanity while developers keep a shared codebase.

- Global site settings live in `Appearance` and `Profile`
- Pages are built from reusable `blocks[]`
- Blog is supported (`/blog` and `/blog/[slug]`)

## Project Structure

```text
packages/
	web/
		src/app/                 # Next.js routes
		src/components/          # Header, Footer, PageBuilder, UI components
		src/components/pagebuilder/
														 # Block renderers (hero, content, accordion, blog posts, etc.)
		src/lib/sanity/          # Sanity client, image helpers, GROQ queries

	cms/
		schemaTypes/documents/   # Top-level docs (home, page, blogPost, profile, appearance)
		schemaTypes/pagebuilder/ # Block schemas used by pages
		sanity.config.ts         # Studio config and desk structure
```

## Day 1 Setup

1. Install dependencies

```bash
pnpm install
```

2. Configure environment variables (`.env.local`)

Required for web:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION` (optional, has default)

Required for CMS:

- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`

3. Run apps

```bash
pnpm dev:web
pnpm dev:cms
```

## Common Commands

```bash
pnpm dev:web      # Run Next.js app
pnpm dev:cms      # Run Sanity Studio
pnpm build:web    # Production build for web
pnpm build:cms    # Production build for studio
pnpm lint         # Lint/typecheck all packages
```

## How Content Flows

1. Editors create/update content in Sanity.
2. Web app fetches content with GROQ queries in `packages/web/src/lib/sanity/queries.ts`.
3. `PageBuilder` maps block `_type` to renderer components.
4. Layout renders global header/footer from `Appearance`.

## Current Block Types

In page builder (`home.blocks[]` and `page.blocks[]`):

- `heroBlock`
- `contentBlock`
- `featureGridBlock`
- `blogPostsBlock`
- `accordionBlock`
- `contactFormBlock`
- `imageBlock`

## If You Add a New Block

Keep this sequence:

1. Add schema in `packages/cms/schemaTypes/pagebuilder/`
2. Register schema in `packages/cms/schemaTypes/index.ts`
3. Add block type to `homeType.ts` and `pageType.ts`
4. Add GROQ projection in `packages/web/src/lib/sanity/queries.ts`
5. Add TypeScript fields in `packages/web/src/components/pagebuilder/types.ts`
6. Create renderer in `packages/web/src/components/pagebuilder/`
7. Wire renderer in `packages/web/src/components/page-builder.tsx`

## Notes For New Developers

- Keep changes simple and composable.
- Prefer small reusable blocks over page-specific hardcoded sections.
- Run `pnpm lint` and `pnpm build:web` before opening PRs.
- Avoid refactoring architecture unless a real problem requires it.
