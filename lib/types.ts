export type Priority = "urgent" | "high" | "medium" | "low";
export type TaskStatus = "backlog" | "todo" | "in-progress" | "review" | "done";
export type ProjectStatus = "active" | "at-risk" | "completed";
export type MemberStatus = "online" | "away" | "offline";

export interface Member {
  id: string;
  name: string;
  role: string;
  status: MemberStatus;
  gradient: string;
  email: string;
  bio: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface TaskComment {
  id: string;
  authorId: string;
  body: string;
  at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  due: string;
  label?: string;
  points?: number;
  checklist: ChecklistItem[];
  comments: TaskComment[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  gradient: string;
  memberIds: string[];
  start: string;
  due: string;
  lastUpdated: string;
  tag: string;
  sprint: number[];
}

export type ActivityKind =
  | "task-moved"
  | "task-completed"
  | "task-created"
  | "comment"
  | "progress"
  | "member";

export interface Activity {
  id: string;
  kind: ActivityKind;
  actorId: string;
  text: string;
  at: string;
  projectId: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  desc?: string;
  variant: "success" | "info" | "danger";
}