export type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'CLIENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PROSPECT';

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  company: string;
  status: ClientStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'UAT' | 'COMPLETED' | 'ON_HOLD';

export interface Project {
  id: string;
  name: string;
  clientId: string;
  client?: Client;
  startDate: string;
  deadline: string;
  budget: number;
  status: ProjectStatus;
  assignedTeam: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type StoryPoints = 1 | 2 | 3 | 5 | 8 | 13;

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  project?: Project;
  assigneeId?: string;
  assignee?: User;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints?: StoryPoints;
  dueDate?: string;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  author?: User;
  content: string;
  createdAt: string;
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Approval {
  id: string;
  title: string;
  documentId: string;
  requestedBy: string;
  reviewerId?: string;
  status: ApprovalStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  projectId: string;
  uploadedBy: string;
  fileUrl: string;
  fileType: string;
  size: number;
  createdAt: string;
}

export interface DashboardStats {
  totalClients: number;
  activeProjects: number;
  overdueTasks: number;
  pendingApprovals: number;
  sprintVelocity: number;
  openRisks: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
