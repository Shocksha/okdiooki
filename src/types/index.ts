import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    id: string
  }
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PROSPECT'
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  position?: string | null
  phone?: string | null
  createdAt: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  address?: string | null
  website?: string | null
  status: ClientStatus
  notes?: string | null
  createdAt: string
  _count?: { projects: number; invoices: number }
}

export interface Project {
  id: string
  name: string
  description?: string | null
  status: ProjectStatus
  priority: Priority
  startDate?: string | null
  endDate?: string | null
  budget?: number | null
  spent: number
  clientId: string
  client: { id: string; name: string; company?: string | null }
  createdById: string
  createdAt: string
  _count?: { tasks: number }
}

export interface Task {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: Priority
  dueDate?: string | null
  estimatedHours?: number | null
  projectId: string
  project: { id: string; name: string }
  assigneeId?: string | null
  assignee?: { id: string; name: string } | null
  createdAt: string
}

export interface TimeEntry {
  id: string
  description?: string | null
  hours: number
  date: string
  projectId: string
  project: { id: string; name: string }
  taskId?: string | null
  task?: { id: string; title: string } | null
  userId: string
  user: { id: string; name: string }
  createdAt: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  number: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  subtotal: number
  tax: number
  total: number
  notes?: string | null
  clientId: string
  client: { id: string; name: string; company?: string | null; email: string; address?: string | null }
  projectId?: string | null
  project?: { id: string; name: string } | null
  items: InvoiceItem[]
  createdAt: string
}

export interface DashboardStats {
  totalClients: number
  activeProjects: number
  pendingTasks: number
  monthlyRevenue: number
  totalRevenue: number
  overdueInvoices: number
  revenueByMonth: { month: string; revenue: number }[]
  projectsByStatus: { status: string; count: number }[]
  recentActivity: {
    type: string
    title: string
    subtitle: string
    date: string
  }[]
}
