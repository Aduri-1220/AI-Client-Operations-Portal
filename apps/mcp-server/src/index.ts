import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001';
const API_TOKEN = process.env.API_TOKEN || '';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
});

const server = new Server(
  { name: 'ai-ops-portal', version: '1.0.0' },
  { capabilities: { tools: {}, resources: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_clients',
      description: 'Retrieve all clients from the portal, optionally filtered by status',
      inputSchema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'PROSPECT'], description: 'Filter by client status' },
        },
      },
    },
    {
      name: 'get_client_by_id',
      description: 'Get detailed information about a specific client',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', description: 'Client UUID' } },
      },
    },
    {
      name: 'get_projects',
      description: 'Retrieve all projects, optionally filtered by client or status',
      inputSchema: {
        type: 'object',
        properties: {
          clientId: { type: 'string', description: 'Filter by client ID' },
          status: { type: 'string', enum: ['PLANNING', 'IN_PROGRESS', 'UAT', 'COMPLETED', 'ON_HOLD'] },
        },
      },
    },
    {
      name: 'get_project_status',
      description: 'Get the current status and details of a specific project',
      inputSchema: {
        type: 'object',
        required: ['projectId'],
        properties: { projectId: { type: 'string', description: 'Project UUID' } },
      },
    },
    {
      name: 'create_task',
      description: 'Create a new task in a project with title, priority, and story points',
      inputSchema: {
        type: 'object',
        required: ['title', 'projectId'],
        properties: {
          title: { type: 'string' },
          projectId: { type: 'string' },
          description: { type: 'string' },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
          storyPoints: { type: 'number', enum: [1, 2, 3, 5, 8, 13] },
          status: { type: 'string', enum: ['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] },
        },
      },
    },
    {
      name: 'summarize_project',
      description: 'Generate an AI-powered summary of a project including task status and risks',
      inputSchema: {
        type: 'object',
        required: ['projectId'],
        properties: { projectId: { type: 'string' } },
      },
    },
    {
      name: 'get_overdue_tasks',
      description: 'Get all tasks that are past their due date across all projects',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'generate_client_report',
      description: 'Generate a status report for a client covering all their projects',
      inputSchema: {
        type: 'object',
        required: ['clientId'],
        properties: { clientId: { type: 'string' } },
      },
    },
    {
      name: 'get_dashboard_stats',
      description: 'Get high-level dashboard statistics: total clients, active projects, overdue tasks, pending approvals',
      inputSchema: { type: 'object', properties: {} },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: unknown;

    switch (name) {
      case 'get_clients': {
        const params = (args?.status) ? `?status=${args.status}` : '';
        const res = await apiClient.get(`/clients${params}`);
        result = res.data;
        break;
      }
      case 'get_client_by_id': {
        const res = await apiClient.get(`/clients/${args?.id}`);
        result = res.data;
        break;
      }
      case 'get_projects': {
        const params = new URLSearchParams();
        if (args?.clientId) params.set('clientId', args.clientId as string);
        if (args?.status) params.set('status', args.status as string);
        const res = await apiClient.get(`/projects?${params}`);
        result = res.data;
        break;
      }
      case 'get_project_status': {
        const res = await apiClient.get(`/projects/${args?.projectId}`);
        result = res.data;
        break;
      }
      case 'create_task': {
        const res = await apiClient.post('/tasks', args);
        result = res.data;
        break;
      }
      case 'summarize_project': {
        const res = await apiClient.post('/ai/summarize-project', { projectId: args?.projectId });
        result = res.data;
        break;
      }
      case 'get_overdue_tasks': {
        const res = await apiClient.get('/tasks/overdue');
        result = res.data;
        break;
      }
      case 'generate_client_report': {
        const [clientRes, projectsRes] = await Promise.all([
          apiClient.get(`/clients/${args?.clientId}`),
          apiClient.get(`/projects?clientId=${args?.clientId}`),
        ]);
        result = {
          client: clientRes.data,
          projects: projectsRes.data,
          generatedAt: new Date().toISOString(),
        };
        break;
      }
      case 'get_dashboard_stats': {
        const res = await apiClient.get('/dashboard/stats');
        result = res.data;
        break;
      }
      default:
        return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
  }
});

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    { uri: 'portal://clients', name: 'All Clients', description: 'Active client records', mimeType: 'application/json' },
    { uri: 'portal://projects', name: 'All Projects', description: 'All project records', mimeType: 'application/json' },
    { uri: 'portal://dashboard', name: 'Dashboard Stats', description: 'Portal KPIs and stats', mimeType: 'application/json' },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  let data: unknown;

  if (uri === 'portal://clients') data = (await apiClient.get('/clients')).data;
  else if (uri === 'portal://projects') data = (await apiClient.get('/projects')).data;
  else if (uri === 'portal://dashboard') data = (await apiClient.get('/dashboard/stats')).data;
  else return { contents: [{ uri, mimeType: 'text/plain', text: 'Resource not found' }] };

  return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(data, null, 2) }] };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('AI Ops Portal MCP Server running on stdio');
}

main().catch(console.error);
