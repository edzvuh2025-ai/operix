# Operix — The Operating System for Roblox Groups

A full-stack SaaS platform for managing Roblox group staff operations. Premium dark SaaS aesthetic inspired by Stripe/Linear.

## Architecture

### Stack
- **Frontend**: React + Vite (artifact: `operix`, path `/`)
- **Backend**: Express 5 API server (artifact: `api-server`, path `/api`)
- **Database**: PostgreSQL + Drizzle ORM (lib: `@workspace/db`)
- **Auth**: Clerk (`@clerk/react` client, `@clerk/express` server)
- **AI**: OpenAI via Replit AI Integrations (`@workspace/integrations-openai-ai-server`)
- **API Contract**: OpenAPI spec → Orval codegen → React Query hooks + Zod schemas

### Monorepo Structure
```
artifacts/
  operix/          # React + Vite frontend (port via $PORT, base path /)
  api-server/      # Express 5 backend (port 8080, /api)
  mockup-sandbox/  # Design canvas (unused in prod)
lib/
  api-spec/        # OpenAPI spec + Orval config
  api-client-react/ # Generated React Query hooks
  api-zod/         # Generated Zod validation schemas
  db/              # Drizzle ORM schema + migrations
  integrations-openai-ai-server/  # OpenAI server client
  integrations-openai-ai-react/   # OpenAI react helpers
```

## Database Schema

Tables in PostgreSQL:
- `groups` — user's Roblox groups (owned via clerkUserId)
- `staff_members` — staff roster per group
- `sessions` — activity sessions per staff member
- `cases` — moderation/HR case management
- `case_evidence` — evidence attached to cases
- `automation_rules` — trigger-action rules
- `activity_log` — audit feed
- `alerts` — notification items (read/unread)
- `ai_insights` — AI-generated observations

## API Routes

All under `/api`, protected by Clerk auth:
- `GET/POST /api/groups` — group management
- `GET/PATCH/DELETE /api/groups/:groupId` — single group
- `GET/POST /api/groups/:groupId/staff` — staff directory
- `GET/PATCH/DELETE /api/groups/:groupId/staff/:staffId` — staff member
- `GET/POST /api/groups/:groupId/sessions` — sessions
- `POST /api/groups/:groupId/sessions/:sessionId/end` — end session
- `GET/POST /api/groups/:groupId/cases` — case management
- `GET/PATCH /api/groups/:groupId/cases/:caseId` — case detail
- `POST /api/groups/:groupId/cases/:caseId/evidence` — add evidence
- `GET/POST /api/groups/:groupId/automation` — automation rules
- `PATCH/DELETE /api/groups/:groupId/automation/:ruleId` — single rule
- `GET /api/groups/:groupId/dashboard` — dashboard stats
- `GET /api/groups/:groupId/activity` — activity feed
- `GET /api/groups/:groupId/alerts` — alerts list
- `POST /api/groups/:groupId/alerts/:alertId/read` — mark alert read
- `GET /api/groups/:groupId/ai/insights` — AI insights
- `POST /api/groups/:groupId/staff/:staffId/ai/summary` — AI staff summary
- `POST /api/groups/:groupId/cases/:caseId/ai/summarize` — AI case summary

## Frontend Pages

- `/` — Landing page (marketing, public)
- `/sign-in`, `/sign-up` — Clerk auth pages
- `/dashboard` — Live stats, charts, alerts
- `/staff` — Staff directory (search/filter)
- `/staff/:staffId` — Staff profile with AI summary
- `/sessions` — Live and historical sessions
- `/cases` — Case management list
- `/cases/:caseId` — Case detail with AI summary + evidence
- `/automation` — Automation rule builder
- `/settings` — Group settings

## Key Files

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/api-client-react/src/generated/api.ts` — Generated hooks
- `lib/api-zod/src/generated/api.ts` — Generated Zod schemas
- `artifacts/api-server/src/app.ts` — Express app setup (Clerk middleware)
- `artifacts/operix/src/App.tsx` — Frontend router
- `artifacts/operix/src/lib/group-context.tsx` — Multi-group state
- `lib/db/src/schema/` — Drizzle schema files

## Regenerating API Code

```bash
pnpm --filter @workspace/api-spec run codegen
```

## Database Migrations

```bash
pnpm --filter @workspace/db run push
```

## Environment Variables / Secrets

- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — Session secret
- `CLERK_PUBLISHABLE_KEY` / `VITE_CLERK_PUBLISHABLE_KEY` — Clerk public key
- `CLERK_SECRET_KEY` — Clerk secret key
- `VITE_CLERK_PROXY_URL` — Clerk proxy URL for development
- `OPENAI_API_KEY` — OpenAI key (via Replit AI Integrations proxy)
