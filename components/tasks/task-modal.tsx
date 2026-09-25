"use client";

import { useMemo, useState } from "react";
import {
  AlignLeft,
  Calendar,
  CheckSquare,
  ChevronDown,
  Flag,
  Plus,
  Send,
  User as UserIcon,
} from "lucide-react";
import { cn, dueLabel, timeAgo } from "@/lib/utils";
import { useApp } from "@/lib/store";
import {
  COLUMN_ORDER,
  getMember,
  getProject,
  priorityMeta,
  taskStatusMeta,
} from "@/lib/data";
import type { Priority, Task, TaskStatus } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Field, Input, Textarea } from "@/components/ui/input";

export function TaskModalHost() {
  const { openTaskId, newTaskDraft, closeTaskModal } = useApp();

  const isCreate = newTaskDraft !== null;

  return (
    <>
      <TaskModal
        key={openTaskId ?? "create"}
        open={isCreate || openTaskId !== null}
        onClose={closeTaskModal}
        taskId={openTaskId}
        createDraft={newTaskDraft}
      />
    </>
  );
}

function TaskModal({
  open,
  onClose,
  taskId,
  createDraft,
}: {
  open: boolean;
  onClose: () => void;
  taskId: string | null;
  createDraft: { projectId: string; status: TaskStatus } | null;
}) {
  const {
    tasks,
    projects,
    members,
    updateTask,
    moveTask,
    toggleChecklist,
    addChecklistItem,
    addComment,
    addTask,
    pushToast,
  } = useApp();

  const task = useMemo(
    () => (taskId ? tasks.find((t) => t.id === taskId) ?? null : null),
    [tasks, taskId]
  );

  const isCreate = createDraft !== null;

  const [draftTitle, setDraftTitle] = useState("");
  const [draftDesc, setDraftDesc] = useState("");
  const [draftProject, setDraftProject] = useState(createDraft?.projectId ?? "p-nexa");
  const [draftStatus, setDraftStatus] = useState<TaskStatus>(createDraft?.status ?? "todo");
  const [draftPriority, setDraftPriority] = useState<Priority | null>(null);
  const [draftAssignee, setDraftAssignee] = useState("m-ali");
  const [draftDue, setDraftDue] = useState("");
  const [commentDraft, setCommentDraft] = useState("");
  const [newCheck, setNewCheck] = useState("");

  if (open && isCreate) {
    const submit = () => {
      const created = addTask({
        title: draftTitle,
        projectId: draftProject,
        status: draftStatus,
      });
      if (!created) return;
      const patch: Record<string, unknown> = {};
      if (draftDesc.trim()) patch.description = draftDesc;
      if (draftPriority) patch.priority = draftPriority;
      patch.assigneeId = draftAssignee;
      if (draftDue) patch.due = draftDue;
      updateTask(created.id, patch as Partial<Task>);
      pushToast("Task created", {
        desc: `"${draftTitle}" added to ${getProject(draftProject).name}`,
      });
      onClose();
    };

    return (
      <Modal open={open} onClose={onClose} size="lg" title="Create task">
        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
          <Field label="Task title">
            <Input
              autoFocus
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="What needs to get done?"
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={draftDesc}
              onChange={(e) => setDraftDesc(e.target.value)}
              rows={3}
              placeholder="A short, clear description…"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project">
              <Dropdown
                trigger={({ open: o, toggle }) => (
                  <ProjectField projectId={draftProject} open={o} onClick={toggle} />
                )}
              >
                {({ close }) => (
                  <>
                    {projects.map((p) => (
                      <DropdownItem
                        key={p.id}
                        active={p.id === draftProject}
                        onClick={() => {
                          setDraftProject(p.id);
                          close();
                        }}
                      >
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full bg-gradient-to-br",
                            p.gradient
                          )}
                        />
                        {p.name}
                      </DropdownItem>
                    ))}
                  </>
                )}
              </Dropdown>
            </Field>
            <Field label="Assignee">
              <Dropdown
                trigger={({ open: o, toggle }) => (
                  <AssigneeField memberId={draftAssignee} open={o} onClick={toggle} />
                )}
              >
                {({ close }) => (
                  <>
                    {members.map((m) => (
                      <DropdownItem
                        key={m.id}
                        active={m.id === draftAssignee}
                        onClick={() => {
                          setDraftAssignee(m.id);
                          close();
                        }}
                      >
                        <Avatar name={m.name} gradient={m.gradient} size="xs" />
                        {m.name}
                      </DropdownItem>
                    ))}
                  </>
                )}
              </Dropdown>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <StatusSelect value={draftStatus} onChange={setDraftStatus} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Priority">
                <PrioritySelect value={draftPriority} onChange={setDraftPriority} />
              </Field>
              <Field label="Due date">
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                  <Input
                    type="date"
                    value={draftDue}
                    onChange={(e) => setDraftDue(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </Field>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-edge px-5 py-3.5">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!draftTitle.trim()} onClick={submit}>
            Create task
          </Button>
        </div>
      </Modal>
    );
  }

  if (open && task) {
    return (
      <Modal open={open} onClose={onClose} size="xl">
        <div className="max-h-[82vh] overflow-y-auto">
          <div className="grid lg:grid-cols-[1fr_240px]">
            {/* Main column */}
            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral" dot={taskStatusMeta[task.status].dot}>
                  {taskStatusMeta[task.status].label}
                </Badge>
                <Badge tone={priorityTone(task.priority)} dot={priorityMeta[task.priority].dot}>
                  {priorityMeta[task.priority].label}
                </Badge>
                {task.label && <Badge tone="accent">{task.label}</Badge>}
              </div>

              <input
                value={task.title}
                onChange={(e) => updateTask(task.id, { title: e.target.value })}
                className="w-full bg-transparent font-display text-xl font-semibold text-ink outline-none focus:border-b focus:border-edge"
                aria-label="Task title"
              />

              <div>
                <SectionHeading icon={AlignLeft} label="Description" />
                <Textarea
                  value={task.description}
                  onChange={(e) => updateTask(task.id, { description: e.target.value })}
                  rows={3}
                  className="mt-2"
                  placeholder="Add a description…"
                />
              </div>

              {task.checklist.length > 0 && (
                <div>
                  <SectionHeading
                    icon={CheckSquare}
                    label="Checklist"
                    action={`${task.checklist.filter((c) => c.done).length}/${task.checklist.length}`}
                  />
                  <div className="mt-2 space-y-1">
                    {task.checklist.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleChecklist(task.id, item.id)}
                        className="group flex w-full items-start gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface-2"
                      >
                        <CheckSquare
                          className={cn(
                            "mt-0.5 h-4.5 w-4.5 shrink-0 transition-colors",
                            item.done ? "text-ok" : "text-ink-3 group-hover:text-ink-2"
                          )}
                        />
                        <span
                          className={cn(
                            "text-[13.5px] transition-colors",
                            item.done
                              ? "text-ink-3 line-through"
                              : "text-ink"
                          )}
                        >
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <SectionHeading icon={Plus} label="Add checklist item" />
                <div className="mt-2 flex gap-2">
                  <Input
                    value={newCheck}
                    onChange={(e) => setNewCheck(e.target.value)}
                    placeholder="Add an item…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newCheck.trim()) {
                        addChecklistItem(task.id, newCheck);
                        setNewCheck("");
                      }
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="md"
                    disabled={!newCheck.trim()}
                    onClick={() => {
                      addChecklistItem(task.id, newCheck);
                      setNewCheck("");
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <SectionHeading icon={Send} label="Comments" action={`${task.comments.length}`} />
                <div className="mt-2 space-y-3">
                  {task.comments.map((comment) => {
                    const author = getMember(comment.authorId);
                    return (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar name={author.name} gradient={author.gradient} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[13px] font-semibold text-ink">
                              {author.name}
                            </span>
                            <span className="text-[11px] text-ink-3">
                              {timeAgo(comment.at)}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-2">
                            {comment.body}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {task.comments.length === 0 && (
                    <p className="text-[13px] text-ink-3">No comments yet.</p>
                  )}
                </div>
                <div className="mt-3 flex items-end gap-2">
                  <Textarea
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    rows={2}
                    placeholder="Write a comment… (demo: saved locally)"
                  />
                  <Button
                    variant="primary"
                    size="icon"
                    disabled={!commentDraft.trim()}
                    aria-label="Send comment"
                    onClick={() => {
                      addComment(task.id, commentDraft);
                      pushToast("Comment added", { desc: "Saved to this task (demo)." });
                      setCommentDraft("");
                    }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Side column */}
            <div className="border-t border-edge bg-surface-2/40 p-5 sm:p-6 lg:border-l lg:border-t-0">
              <div className="space-y-4">
                <div>
                  <MetaLabel>Status</MetaLabel>
                  <StatusSelect
                    value={task.status}
                    onChange={(s) => {
                      if (s === task.status) return;
                      moveTask(task.id, s);
                      pushToast(
                        s === "done"
                          ? "Task completed 🎉"
                          : `Moved to ${taskStatusMeta[s].label}`,
                        { desc: task.title, variant: s === "done" ? "success" : "info" }
                      );
                    }}
                    full
                  />
                </div>

                <div>
                  <MetaLabel>Priority</MetaLabel>
                  <Dropdown
                    trigger={({ open: o, toggle }) => (
                      <PriorityButton priority={task.priority} open={o} onClick={toggle} />
                    )}
                  >
                    {({ close }) => (
                      <>
                        {(["urgent", "high", "medium", "low"] as Priority[]).map((p) => (
                          <DropdownItem
                            key={p}
                            active={p === task.priority}
                            onClick={() => {
                              updateTask(task.id, { priority: p });
                              pushToast(`Priority set to ${priorityMeta[p].label}`, {
                                variant: "info",
                              });
                              close();
                            }}
                          >
                            <span className={cn("h-2 w-2 rounded-full", priorityMeta[p].dot)} />
                            {priorityMeta[p].label}
                          </DropdownItem>
                        ))}
                      </>
                    )}
                  </Dropdown>
                </div>

                <div>
                  <MetaLabel>Assignee</MetaLabel>
                  <Dropdown
                    trigger={({ open: o, toggle }) => (
                      <AssigneeField memberId={task.assigneeId} open={o} onClick={toggle} />
                    )}
                  >
                    {({ close }) => (
                      <>
                        {members.map((m) => (
                          <DropdownItem
                            key={m.id}
                            active={m.id === task.assigneeId}
                            onClick={() => {
                              updateTask(task.id, { assigneeId: m.id });
                              pushToast(`Assigned to ${m.name}`, { variant: "info" });
                              close();
                            }}
                          >
                            <Avatar name={m.name} gradient={m.gradient} size="xs" />
                            {m.name}
                          </DropdownItem>
                        ))}
                      </>
                    )}
                  </Dropdown>
                </div>

                <div>
                  <MetaLabel>Due date</MetaLabel>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                    <Input
                      type="date"
                      value={task.due}
                      onChange={(e) => {
                        updateTask(task.id, { due: e.target.value });
                        pushToast("Due date updated", { variant: "info" });
                      }}
                      className="pl-9"
                    />
                  </div>
                  <p
                    className={cn(
                      "mt-1.5 text-[12px]",
                      dueLabel(task.due).tone === "danger" && "text-danger",
                      dueLabel(task.due).tone === "warn" && "text-warn",
                      dueLabel(task.due).tone === "muted" && "text-ink-3"
                    )}
                  >
                    {dueLabel(task.due).text}
                  </p>
                </div>

                <div>
                  <MetaLabel>Project</MetaLabel>
                  <div className="flex items-center gap-2 rounded-xl border border-edge bg-bg-soft px-3 py-2 text-[13px] font-medium text-ink-2">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full bg-gradient-to-br",
                        getProject(task.projectId).gradient
                      )}
                    />
                    <span className="truncate">{getProject(task.projectId).name}</span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-edge pt-4 text-[12px] text-ink-3">
                  <p>Created {timeAgo(task.createdAt)}</p>
                  <p>Last updated {timeAgo(task.updatedAt)}</p>
                  {task.points && <p>{task.points} story points</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return null;
}

function SectionHeading({
  icon: Icon,
  label,
  action,
}: {
  icon: typeof AlignLeft;
  label: string;
  action?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-ink-2">
        <Icon className="h-4 w-4 text-ink-3" />
        {label}
      </div>
      {action && (
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-ink-2">
          {action}
        </span>
      )}
    </div>
  );
}

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-3">
      {children}
    </p>
  );
}

function StatusSelect({
  value,
  onChange,
  full,
}: {
  value: TaskStatus;
  onChange: (s: TaskStatus) => void;
  full?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-1 rounded-xl border border-edge bg-bg-soft p-1",
        full && "flex-col"
      )}
    >
      {COLUMN_ORDER.map((status) => {
        const meta = taskStatusMeta[status];
        const active = value === status;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium transition-colors",
              active
                ? "bg-surface text-ink shadow-sm"
                : "text-ink-3 hover:text-ink-2"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}

function PriorityButton({
  priority,
  open,
  onClick,
}: {
  priority: Priority | null;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9.5 w-full items-center gap-2 rounded-xl border border-edge bg-bg-soft px-3 text-[13px] font-medium text-ink transition-colors hover:border-edge-strong"
    >
      <Flag className="h-3.5 w-3.5 text-ink-3" />
      <span className="flex-1 text-left">
        {priority ? priorityMeta[priority].label : "Set priority"}
      </span>
      <ChevronDown
        className={cn("h-4 w-4 text-ink-3 transition-transform", open && "rotate-180")}
      />
    </button>
  );
}

function PrioritySelect({
  value,
  onChange,
}: {
  value: Priority | null;
  onChange: (p: Priority) => void;
}) {
  return (
    <Dropdown
      trigger={({ open: o, toggle }) => (
        <PriorityButton priority={value} open={o} onClick={toggle} />
      )}
    >
      {({ close }) => (
        <>
          {(["urgent", "high", "medium", "low"] as Priority[]).map((p) => (
            <DropdownItem
              key={p}
              active={value === p}
              onClick={() => {
                onChange(p);
                close();
              }}
            >
              <span className={cn("h-2 w-2 rounded-full", priorityMeta[p].dot)} />
              {priorityMeta[p].label}
            </DropdownItem>
          ))}
        </>
      )}
    </Dropdown>
  );
}

function AssigneeField({
  memberId,
  open,
  onClick,
}: {
  memberId: string;
  open: boolean;
  onClick: () => void;
}) {
  const member = getMember(memberId);
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9.5 w-full items-center gap-2 rounded-xl border border-edge bg-bg-soft px-3 text-[13px] font-medium text-ink transition-colors hover:border-edge-strong"
    >
      <UserIcon className="h-3.5 w-3.5 text-ink-3" />
      <Avatar name={member.name} gradient={member.gradient} size="xs" />
      <span className="flex-1 truncate text-left">{member.name}</span>
      <ChevronDown
        className={cn("h-4 w-4 text-ink-3 transition-transform", open && "rotate-180")}
      />
    </button>
  );
}

function ProjectField({
  projectId,
  open,
  onClick,
}: {
  projectId: string;
  open: boolean;
  onClick: () => void;
}) {
  const project = getProject(projectId);
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9.5 w-full items-center gap-2 rounded-xl border border-edge bg-bg-soft px-3 text-[13px] font-medium text-ink transition-colors hover:border-edge-strong"
    >
      <span className={cn("h-2 w-2 rounded-full bg-gradient-to-br", project.gradient)} />
      <span className="flex-1 truncate text-left">{project.name}</span>
      <ChevronDown
        className={cn("h-4 w-4 text-ink-3 transition-transform", open && "rotate-180")}
      />
    </button>
  );
}

function priorityTone(p: Priority): "danger" | "warn" | "accent" | "neutral" {
  if (p === "urgent") return "danger";
  if (p === "high") return "warn";
  if (p === "medium") return "accent";
  return "neutral";
}