# Architecture Overview

## System Architecture

```
Browser
  │
  ▼
Next.js 15 Frontend (port 3000)
  │  React 19 · TypeScript · Tailwind CSS
  │  TanStack Query · React Hook Form · Zod
  │
  ├─► NestJS API (port 3001)
  │     TypeORM · PostgreSQL · Redis
  │     JWT Auth · Swagger /api/docs
  │     Modules: clients, projects, tasks,
  │              ai, dashboard, documents, approvals
  │
  ├─► .NET 8 Reports Service (port 5000)
  │     PDF generation · Swagger /swagger
  │
  └─► MCP Server (stdio)
        Wraps portal REST APIs as MCP tools
        Used by Claude/Cursor IDE integrations

NestJS AI Service
  │
  └─► Anthropic API (claude-sonnet-4-6)
        Tool use: searchClients, getProjectDetails,
                  createTask, getOverdueTasks

n8n Automation (port 5678)
  ├─ Workflow 1: Client Onboarding (webhook trigger)
  ├─ Workflow 2: Daily Overdue Task Reminder (cron)
  └─ Workflow 3: Document Approval (webhook trigger)
```

## Data Flow

1. **User request** → Next.js → NestJS → PostgreSQL
2. **AI request** → NestJS → Anthropic API with tools → NestJS services → PostgreSQL
3. **MCP request** → Claude/Cursor → MCP Server → NestJS REST API
4. **Automation** → n8n → NestJS webhooks → Email/Slack

## Security

- Azure AD B2C for identity
- JWT tokens for API auth
- Azure Key Vault for secrets
- HTTPS in production via Azure / Cloudflare
