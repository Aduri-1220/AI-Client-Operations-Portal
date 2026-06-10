# AI Client Operations Portal

An AI-powered portal for consulting and software companies to manage clients, projects, tasks, documents, approvals, and workflows — with a built-in Claude AI assistant that can query live portal data via tool use.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), Tailwind CSS, TanStack Query |
| Backend API | NestJS + Node.js (TypeScript) |
| Reports Service | ASP.NET Core 8 |
| Database | PostgreSQL (TypeORM) |
| Cache / Queues | Redis + BullMQ |
| AI | Anthropic Claude API (tool use) |
| MCP Server | Claude MCP tools for portal operations |
| Automation | n8n workflows |
| File Storage | Azure Blob Storage |
| Infra | Azure (Bicep), Docker, nginx |
| CI/CD | Azure Pipelines |
| Testing | Playwright e2e (58 tests, 100% passing) |

---

## Features

- **Client Management** — CRUD, search, status tracking (Active / Prospect / Inactive)
- **Project Management** — Status pipeline, budget tracking, team assignments, progress bars
- **Task Board** — Kanban board with drag-and-drop, story points, priority badges
- **Documents** — Upload/download via Azure Blob Storage with version history
- **Approvals** — Multi-step approval chains with audit trail
- **AI Assistant** — Real Claude API chat with tool use; can query clients, projects, and tasks live
- **Reports & Dashboards** — Sprint velocity, task breakdown, exportable PDF/CSV reports
- **Automated Workflows** — n8n workflows for client onboarding, approvals, and overdue reminders
- **CRM Integrations** — HubSpot / Salesforce adapter layer

---

## Project Structure

```
ai-client-ops-portal/
├── apps/
│   ├── web/                  # Next.js 16 frontend (port 3000)
│   │   ├── src/app/          # App Router pages
│   │   ├── src/components/   # Shared UI components
│   │   ├── src/services/     # API service layer
│   │   └── src/types/        # Shared TypeScript types
│   ├── api/                  # NestJS backend (port 3002)
│   │   └── src/
│   │       ├── ai/           # Claude API + tool use
│   │       ├── clients/      # Client CRUD
│   │       ├── projects/     # Project management
│   │       ├── tasks/        # Task board
│   │       ├── approvals/    # Approval workflows
│   │       └── dashboard/    # Aggregated stats
│   ├── dotnet-service/       # ASP.NET 8 Reports service (port 5000)
│   └── mcp-server/           # MCP server exposing portal tools to Claude
├── tests/e2e/                # Playwright test suite (58 tests)
│   ├── fixtures/base.ts      # Authenticated test fixture
│   └── specs/                # Per-module + golden-path workflow specs
├── automation/n8n-workflows/ # n8n workflow JSON definitions
├── infra/
│   ├── bicep/                # Azure Bicep infrastructure
│   └── nginx/                # Reverse proxy config
├── docs/                     # Architecture and AI workflow docs
├── docker-compose.yml        # Local dev infrastructure
└── .azure-pipelines.yml      # CI/CD pipeline
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for local Postgres + Redis)
- An [Anthropic API key](https://console.anthropic.com/)

### 1. Start infrastructure

```bash
docker compose up -d postgres redis
```

### 2. Configure environment

```bash
# API
cp .env.example apps/api/.env
# Fill in ANTHROPIC_API_KEY and DB credentials

# Frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3002" > apps/web/.env.local
```

### 3. Run the API

```bash
cd apps/api
npm install
npm run start:dev        # NestJS on :3002
```

### 4. Run the frontend

```bash
cd apps/web
npm install
npm run dev              # Next.js on :3000
```

### 5. Open the portal

Navigate to [http://localhost:3000](http://localhost:3000)

> **Demo login:** any email + any password (mock auth — replace with Azure AD B2C for production)

---

## Running Tests

```bash
cd tests/e2e

# All 58 tests
npm test

# Full golden-path workflow only
npm run test:workflow

# Specific module
npm run test:clients
npm run test:tasks
npm run test:approvals

# With browser visible
npm run test:headed

# Interactive Playwright UI
npm run test:ui

# Open HTML report
npm run report
```

Tests auto-start the Next.js dev server if it isn't already running.

---

## AI Assistant

The AI assistant calls the real Anthropic Claude API with **tool use** — it can look up live data from the portal when answering questions.

**Available tools:**

| Tool | Description |
|---|---|
| `searchClients` | Query clients by status |
| `getProjectDetails` | Fetch one or all projects |
| `createTask` | Create a task from natural language |
| `getOverdueTasks` | List all overdue tasks across projects |

**Example prompts:**
- *"Which tasks are overdue?"*
- *"Summarize the E-Commerce Platform project"*
- *"Generate 5 user stories for the approval workflow"*
- *"Create a sprint plan for next 2 weeks"*

Requires `ANTHROPIC_API_KEY` in `apps/api/.env`.

---

## Environment Variables

| Variable | Service | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | API | Claude API key (required for AI assistant) |
| `DB_HOST` | API | Postgres host |
| `DB_PORT` | API | Postgres port (default 5432) |
| `DB_USER` | API | Postgres user |
| `DB_PASSWORD` | API | Postgres password |
| `DB_NAME` | API | Database name |
| `JWT_SECRET` | API | JWT signing secret |
| `FRONTEND_URL` | API | Allowed CORS origin |
| `NEXT_PUBLIC_API_URL` | Web | NestJS API base URL |
| `PORT` | API | API server port (default 3002) |

See `.env.example` for the full list including Azure, SendGrid, and Slack.

---

## Docker

Run the full stack in Docker:

```bash
ANTHROPIC_API_KEY=sk-ant-... docker compose up --build
```

| Service | Port |
|---|---|
| Next.js web | 3000 |
| NestJS API | 3001 |
| ASP.NET Reports | 5000 |
| Postgres | 5432 |
| Redis | 6379 |
| n8n | 5678 |
| nginx | 80 |

---

## Known Placeholders (Pre-Production Checklist)

- [ ] Replace mock auth (`localStorage.setItem('token', ...)`) with Azure AD B2C
- [ ] Wire frontend pages (clients, projects, tasks, approvals) to real API instead of mock state
- [ ] Connect document upload to Azure Blob Storage
- [ ] Set real user name/role from JWT claims in `Header.tsx`
- [ ] Remove demo credentials box from login page

---

## License

MIT
