import api from '@/lib/api';
import type { ChatMessage } from '@/types';

export const aiService = {
  chat: (messages: Pick<ChatMessage, 'role' | 'content'>[]) =>
    api.post<{ message: string }>('/ai/chat', { messages }).then((r) => r.data),

  summarizeProject: (projectId: string) =>
    api.post<{ summary: string }>('/ai/summarize-project', { projectId }).then((r) => r.data),

  generateUserStories: (feature: string, projectId?: string) =>
    api.post<{ stories: string[] }>('/ai/generate-user-stories', { feature, projectId }).then((r) => r.data),

  draftEmail: (context: { clientId: string; subject: string; tone?: string }) =>
    api.post<{ email: string }>('/ai/draft-email', context).then((r) => r.data),

  generateSprintPlan: (projectId: string, velocity?: number) =>
    api.post<{ plan: string }>('/ai/generate-sprint-plan', { projectId, velocity }).then((r) => r.data),
};
