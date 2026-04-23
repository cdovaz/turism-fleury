export type TaskStatus = 'LOCKED' | 'ACTIVE' | 'COMPLETED' | 'SKIPPED';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: string;
  ctaText?: string;
  ctaLink?: string;
}