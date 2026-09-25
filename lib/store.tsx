"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  activities as seedActivities,
  members,
  projects,
  tasks as tasksSeed,
  getMember,
} from "@/lib/data";
import type {
  Activity,
  Member,
  Project,
  Task,
  TaskStatus,
  ToastMessage,
} from "@/lib/types";

export interface NewTaskDraft {
  projectId: string;
  status: TaskStatus;
}

interface AppStore {
  tasks: Task[];
  members: Member[];
  projects: Project[];
  activities: Activity[];
  updateProfile: (patch: Partial<Member>) => void;
  toasts: ToastMessage[];
  pushToast: (title: string, opts?: { desc?: string; variant?: ToastMessage["variant"] }) => void;
  dismissToast: (id: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  toggleChecklist: (taskId: string, itemId: string) => void;
  addChecklistItem: (taskId: string, label: string) => void;
  addComment: (taskId: string, body: string) => void;
  addTask: (draft: NewTaskDraft & { title: string }) => Task | null;
  openTaskId: string | null;
  newTaskDraft: NewTaskDraft | null;
  openTask: (id: string) => void;
  openNewTask: (draft: NewTaskDraft) => void;
  closeTaskModal: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  resolvedTasks: Record<string, boolean>;
  toggleTaskResolved: (id: string) => void;
}

const AppContext = createContext<AppStore | null>(null);

function nowIso(): string {
  return new Date().toISOString();
}

const uid = () => Math.random().toString(36).slice(2, 10);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [membersList, setMembersList] = useState<Member[]>(() => [...members]);
  const [tasks, setTasks] = useState<Task[]>(() => [...tasksSeed]);
  const [activities, setActivities] = useState<Activity[]>([...seedActivities]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [newTaskDraft, setNewTaskDraft] = useState<NewTaskDraft | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [resolvedTasks, setResolvedTasks] = useState<Record<string, boolean>>({});

  const pushToast = useCallback<AppStore["pushToast"]>((title, opts) => {
    const id = uid();
    const variant = opts?.variant ?? "success";
    setToasts((prev) => [...prev.slice(-3), { id, title, desc: opts?.desc, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateProfile = useCallback((patch: Partial<Member>) => {
    setMembersList((prev) =>
      prev.map((m, i) => (i === 0 ? { ...m, ...patch } : m))
    );
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: nowIso() } : t))
    );
  }, []);

  const moveTask = useCallback(
    (id: string, status: TaskStatus) => {
      const task = tasks.find((t) => t.id === id);
      if (!task || task.status === status) return;
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status, updatedAt: nowIso() } : t
        )
      );
      const actor = getMember("m-ali");
      setActivities((prev) => [
        {
          id: uid(),
          kind: status === "done" ? "task-completed" : "task-moved",
          actorId: actor.id,
          text:
            status === "done"
              ? `completed ${task.title}`
              : `moved ${task.title} to ${statusLabel(status)}`,
          at: nowIso(),
          projectId: task.projectId,
        },
        ...prev,
      ]);
    },
    [tasks]
  );

  const toggleChecklist = useCallback((taskId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              updatedAt: nowIso(),
              checklist: t.checklist.map((c) =>
                c.id === itemId ? { ...c, done: !c.done } : c
              ),
            }
          : t
      )
    );
  }, []);

  const addChecklistItem = useCallback((taskId: string, label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              updatedAt: nowIso(),
              checklist: [...t.checklist, { id: uid(), label: trimmed, done: false }],
            }
          : t
      )
    );
  }, []);

  const addComment = useCallback((taskId: string, body: string) => {
    const trimmed = body.trim();
    if (!trimmed) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const comment = {
      id: uid(),
      authorId: "m-ali",
      body: trimmed,
      at: nowIso(),
    };
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, updatedAt: nowIso(), comments: [...t.comments, comment] }
          : t
      )
    );
    setActivities((prev) => [
      {
        id: uid(),
        kind: "comment",
        actorId: "m-ali",
        text: `commented on ${task.title}`,
        at: nowIso(),
        projectId: task.projectId,
      },
      ...prev,
    ]);
  }, [tasks]);

  const addTask = useCallback<AppStore["addTask"]>(
    ({ title, projectId, status }) => {
      const trimmed = title.trim();
      if (!trimmed) return null;
      const task: Task = {
        id: `t-${uid()}`,
        title: trimmed,
        description: "No description yet.",
        projectId,
        status,
        priority: "medium",
        assigneeId: "m-ali",
        due: nowIso().slice(0, 10),
        points: 3,
        checklist: [],
        comments: [],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      setTasks((prev) => [task, ...prev]);
      setActivities((prev) => [
        {
          id: uid(),
          kind: "task-created",
          actorId: "m-ali",
          text: `created a new task · ${trimmed}`,
          at: nowIso(),
          projectId,
        },
        ...prev,
      ]);
      return task;
    },
    []
  );

  const openTask = useCallback((id: string) => {
    setNewTaskDraft(null);
    setOpenTaskId(id);
  }, []);

  const openNewTask = useCallback((draft: NewTaskDraft) => {
    setOpenTaskId(null);
    setNewTaskDraft(draft);
  }, []);

  const closeTaskModal = useCallback(() => {
    setOpenTaskId(null);
    setNewTaskDraft(null);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((v) => !v);
  }, []);

  const toggleTaskResolved = useCallback((id: string) => {
    setResolvedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const value = useMemo<AppStore>(
    () => ({
      tasks,
      members: membersList,
      projects,
      activities,
      toasts,
      pushToast,
      dismissToast,
      updateProfile,
      updateTask,
      moveTask,
      toggleChecklist,
      addChecklistItem,
      addComment,
      addTask,
      openTaskId,
      newTaskDraft,
      openTask,
      openNewTask,
      closeTaskModal,
      sidebarCollapsed,
      toggleSidebar,
      mobileNavOpen,
      setMobileNavOpen,
      resolvedTasks,
      toggleTaskResolved,
    }),
    [
      tasks,
      membersList,
      activities,
      toasts,
      pushToast,
      dismissToast,
      updateProfile,
      updateTask,
      moveTask,
      toggleChecklist,
      addChecklistItem,
      addComment,
      addTask,
      openTaskId,
      newTaskDraft,
      openTask,
      openNewTask,
      closeTaskModal,
      sidebarCollapsed,
      toggleSidebar,
      mobileNavOpen,
      resolvedTasks,
      toggleTaskResolved,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function statusLabel(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    backlog: "Backlog",
    todo: "To Do",
    "in-progress": "In Progress",
    review: "In Review",
    done: "Done",
  };
  return map[status];
}

export function useApp(): AppStore {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppStoreProvider");
  return ctx;
}