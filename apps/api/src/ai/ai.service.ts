import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ClientsService } from '../clients/clients.service';
import { ProjectsService } from '../projects/projects.service';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class AiService {
  private readonly client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  constructor(
    private readonly clientsService: ClientsService,
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  private readonly tools: Anthropic.Tool[] = [
    {
      name: 'searchClients',
      description: 'Search and retrieve client records from the portal',
      input_schema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'PROSPECT'], description: 'Filter by status' },
        },
      },
    },
    {
      name: 'getProjectDetails',
      description: 'Get detailed information about a specific project or all projects',
      input_schema: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project ID (omit for all projects)' },
          status: { type: 'string', description: 'Filter by status' },
        },
      },
    },
    {
      name: 'createTask',
      description: 'Create a new task in a project',
      input_schema: {
        type: 'object',
        required: ['title', 'projectId'],
        properties: {
          title: { type: 'string' },
          projectId: { type: 'string' },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
          storyPoints: { type: 'number', enum: [1, 2, 3, 5, 8, 13] },
          description: { type: 'string' },
        },
      },
    },
    {
      name: 'getOverdueTasks',
      description: 'Get all overdue tasks across all projects',
      input_schema: { type: 'object', properties: {} },
    },
  ];

  private async runTool(name: string, input: Record<string, unknown>) {
    if (name === 'searchClients') return this.clientsService.findAll(input.status as string);
    if (name === 'getProjectDetails') {
      if (input.projectId) return this.projectsService.findOne(input.projectId as string);
      return this.projectsService.findAll(undefined, input.status as string);
    }
    if (name === 'createTask') return this.tasksService.create(input as any);
    if (name === 'getOverdueTasks') return this.tasksService.getOverdue();
    return null;
  }

  async chat(messages: { role: 'user' | 'assistant'; content: string }[]) {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: 'You are an AI assistant for an AI Client Operations Portal. You help manage clients, projects, tasks, and workflows. Use the available tools to retrieve real data when answering questions. Be concise, structured, and actionable.',
      tools: this.tools,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    if (response.stop_reason === 'tool_use') {
      const toolResults: Anthropic.MessageParam[] = [
        { role: 'assistant', content: response.content },
      ];

      for (const block of response.content) {
        if (block.type === 'tool_use') {
          const result = await this.runTool(block.name, block.input as Record<string, unknown>);
          toolResults.push({
            role: 'user',
            content: [{ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result) }],
          });
        }
      }

      const finalResponse = await this.client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: 'You are an AI assistant for an AI Client Operations Portal.',
        tools: this.tools,
        messages: [...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })), ...toolResults],
      });

      const textBlock = finalResponse.content.find(b => b.type === 'text');
      return { message: textBlock?.type === 'text' ? textBlock.text : '' };
    }

    const textBlock = response.content.find(b => b.type === 'text');
    return { message: textBlock?.type === 'text' ? textBlock.text : '' };
  }

  async summarizeProject(projectId: string) {
    const project = await this.projectsService.findOne(projectId);
    const tasks = await this.tasksService.findAll(projectId);
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date());

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Summarize this project concisely for a status report:\n\nProject: ${JSON.stringify(project, null, 2)}\n\nTasks: ${JSON.stringify(tasks, null, 2)}\n\nOverdue tasks count: ${overdueTasks.length}`,
      }],
    });

    const text = response.content.find(b => b.type === 'text');
    return { summary: text?.type === 'text' ? text.text : '' };
  }

  async generateUserStories(feature: string, projectId?: string) {
    const context = projectId ? await this.projectsService.findOne(projectId).catch(() => null) : null;

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Generate 5 Agile user stories for this feature: "${feature}". ${context ? `Project context: ${context.name} — ${context.description || ''}` : ''}\n\nFormat each as: "As a [role], I want to [action] so that [benefit]." Include story point estimates using Fibonacci (1,2,3,5,8,13).`,
      }],
    });

    const text = response.content.find(b => b.type === 'text');
    const stories = text?.type === 'text'
      ? text.text.split('\n').filter(l => l.trim().match(/^\d+\./))
      : [];
    return { stories };
  }

  async draftEmail(context: { clientId: string; subject: string; tone?: string }) {
    const client = await this.clientsService.findOne(context.clientId);
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Draft a ${context.tone || 'professional'} email to ${client.contactPerson} at ${client.company} about: "${context.subject}". Sign off as "The Operations Team".`,
      }],
    });
    const text = response.content.find(b => b.type === 'text');
    return { email: text?.type === 'text' ? text.text : '' };
  }

  async generateSprintPlan(projectId: string, velocity = 40) {
    const tasks = await this.tasksService.findAll(projectId, undefined, undefined);
    const backlog = tasks.filter(t => ['BACKLOG', 'TODO'].includes(t.status));

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Create a 2-week sprint plan from this backlog. Team velocity: ${velocity} points.\n\nBacklog: ${JSON.stringify(backlog, null, 2)}`,
      }],
    });
    const text = response.content.find(b => b.type === 'text');
    return { plan: text?.type === 'text' ? text.text : '' };
  }
}
