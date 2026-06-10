# AI Workflow Documentation

## AI Assistant — Tool Use Architecture

The AI assistant uses the Anthropic API with structured tool use rather than simple text generation.

### Available Tools

| Tool | Description |
|------|-------------|
| `searchClients` | Query client records by status |
| `getProjectDetails` | Fetch project data and status |
| `createTask` | Create a new task programmatically |
| `getOverdueTasks` | Find all past-due tasks |

### MCP Server Tools

The MCP server wraps the portal REST API and exposes tools for AI agents (Claude, Cursor):

| MCP Tool | API Call |
|----------|---------|
| `get_clients` | `GET /clients` |
| `get_client_by_id` | `GET /clients/:id` |
| `get_projects` | `GET /projects` |
| `get_project_status` | `GET /projects/:id` |
| `create_task` | `POST /tasks` |
| `summarize_project` | `POST /ai/summarize-project` |
| `get_overdue_tasks` | `GET /tasks/overdue` |
| `generate_client_report` | Aggregated client + projects |
| `get_dashboard_stats` | `GET /dashboard/stats` |

### Interview Explanation

> "The MCP server wraps my internal REST APIs and exposes them as structured tools. This allows an AI agent to safely retrieve project data, create tasks, and generate reports — instead of only generating text responses."

## n8n Automation vs AI Agent

| Aspect | n8n Workflow | AI Agent (Claude) |
|--------|-------------|------------------|
| Type | Deterministic | Reasoning-based |
| Trigger | Webhook / Cron | User prompt |
| Best for | Notifications, approvals, reminders | Summaries, planning, drafting |
| Predictability | 100% | Variable |
