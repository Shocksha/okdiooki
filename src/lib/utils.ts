import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateInput(date: string | Date | null | undefined): string {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `INV-${year}-${rand}`
}

export const STATUS_COLORS: Record<string, string> = {
  // Project & Task statuses
  PLANNING: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  REVIEW: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-green-100 text-green-700',
  ON_HOLD: 'bg-orange-100 text-orange-700',
  CANCELLED: 'bg-red-100 text-red-700',
  TODO: 'bg-gray-100 text-gray-700',
  DONE: 'bg-green-100 text-green-700',
  // Client statuses
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-gray-100 text-gray-700',
  PROSPECT: 'bg-purple-100 text-purple-700',
  // Invoice statuses
  DRAFT: 'bg-gray-100 text-gray-700',
  SENT: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
}

export const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-600',
  URGENT: 'bg-red-100 text-red-600',
}

export const STATUS_LABELS: Record<string, string> = {
  PLANNING: 'Pianificazione',
  IN_PROGRESS: 'In Corso',
  REVIEW: 'Revisione',
  COMPLETED: 'Completato',
  ON_HOLD: 'Sospeso',
  CANCELLED: 'Annullato',
  TODO: 'Da Fare',
  DONE: 'Fatto',
  ACTIVE: 'Attivo',
  INACTIVE: 'Inattivo',
  PROSPECT: 'Prospect',
  DRAFT: 'Bozza',
  SENT: 'Inviata',
  PAID: 'Pagata',
  OVERDUE: 'Scaduta',
}

export const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Bassa',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  URGENT: 'Urgente',
}

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Amministratore',
  MANAGER: 'Manager',
  EMPLOYEE: 'Collaboratore',
}
