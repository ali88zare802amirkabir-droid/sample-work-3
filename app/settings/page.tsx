"use client";

import { useState, type ReactNode } from "react";
import {
  Bell,
  Briefcase,
  Check,
  Moon,
  Palette,
  Save,
  Sun,
  Trash2,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { useTheme, ACCENTS, type AccentId } from "@/components/theme-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Modal } from "@/components/ui/modal";

type Section = "profile" | "appearance" | "notifications" | "workspace";

const SECTIONS: Array<{
  key: Section;
  label: string;
  icon: typeof UserRound;
}> = [
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "workspace", label: "Workspace", icon: Briefcase },
];

function SectionCard({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold text-ink">{title}</h3>
        <p className="mt-0.5 text-[12.5px] text-ink-3">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function Row({
  title,
  desc,
  checked,
  onToggle,
  disabled,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onToggle: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-ink">{title}</p>
        <p className="mt-0.5 text-[12px] text-ink-3">{desc}</p>
      </div>
      <Toggle
        checked={checked}
        onChange={onToggle}
        disabled={disabled}
        label={title}
      />
    </div>
  );
}

export default function SettingsPage() {
  const { members, updateProfile, pushToast } = useApp();
  const { theme, setTheme, accent, setAccent } = useTheme();
  const [section, setSection] = useState<Section>("profile");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const me = members[0];

  const [form, setForm] = useState({
    name: me.name,
    role: me.role,
    email: me.email,
    bio: me.bio,
  });

  const [notif, setNotif] = useState({
    assignments: true,
    comments: true,
    dueReminders: true,
    weeklyDigest: false,
    productNews: false,
  });

  const [app, setApp] = useState({ dense: false, reduceMotion: false });
  const [workspaceName, setWorkspaceName] = useState("Nexa HQ");

  const saveProfile = () => {
    updateProfile(form);
    pushToast("Profile updated", { desc: "Your changes are saved." });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      {/* Section nav */}
      <nav className="h-fit gap-1 rounded-2xl border border-edge bg-surface p-2 lg:sticky lg:top-20">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = section === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setSection(s.key)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                active ? "bg-accent-soft text-accent" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4" />
              {s.label}
            </button>
          );
        })}
      </nav>

      {/* Panels */}
      <div className="space-y-4 animate-fade-in">
        {section === "profile" && (
          <>
            <SectionCard title="Profile" desc="How you appear across the workspace.">
              <div className="flex items-center gap-4">
                <Avatar
                  name={form.name || "N"}
                  gradient="from-blue-500 to-cyan-400"
                  size="xl"
                  online
                />
                <div>
                  <p className="font-display text-[15px] font-semibold text-ink">
                    {form.name || "Your name"}
                  </p>
                  <p className="text-[12px] text-ink-3">{form.role}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1"
                    onClick={() => pushToast("Photo update is a demo", { variant: "info" })}
                  >
                    Change photo
                  </Button>
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </Field>
                <Field label="Role">
                  <Input
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  />
                </Field>
                <Field label="Email">
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Bio" hint="Shown on your profile card.">
                  <Textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  />
                </Field>
              </div>
              <div className="mt-5 flex justify-end gap-2 border-t border-edge pt-4">
                <Button variant="primary" onClick={saveProfile}>
                  <Save className="h-4 w-4" /> Save changes
                </Button>
              </div>
            </SectionCard>

            <SectionCard title="Account" desc="Never build a real backend for a demo — this is a frontend showcase.">
              <p className="text-[12.5px] leading-relaxed text-ink-2">
                NexaBoard is a portfolio prototype. Sign-in, billing and real account
                management are intentionally left out, so every pixel here works with
                local mock data.
              </p>
            </SectionCard>
          </>
        )}

        {section === "appearance" && (
          <>
            <SectionCard title="Theme" desc="Choose how NexaBoard looks on this device.">
              <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                {(["light", "dark"] as const).map((mode) => {
                  const active = theme === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setTheme(mode)}
                      className={cn(
                        "relative overflow-hidden rounded-2xl border p-3 pt-4 text-left transition-all",
                        active
                          ? "border-accent/60 ring-2 ring-accent/30"
                          : "border-edge hover:border-edge-strong"
                      )}
                      aria-pressed={active}
                    >
                      <span className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white">
                        {active && <Check className="h-3 w-3" />}
                      </span>
                      <span
                        className={cn(
                          "mb-3 flex h-16 items-end gap-1 rounded-lg border p-2",
                          mode === "light"
                            ? "border-[#e4e8ef] bg-[#f4f6f9]"
                            : "border-white/10 bg-[#0d1219]"
                        )}
                      >
                        <span className="h-3 w-1.5 rounded-full bg-[var(--accent)]" />
                        <span
                          className={cn(
                            "h-4 w-8 rounded-md",
                            mode === "light" ? "bg-white" : "bg-white/10"
                          )}
                        />
                      </span>
                      <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
                        {mode === "dark" ? (
                          <Moon className="h-4 w-4" />
                        ) : (
                          <Sun className="h-4 w-4" />
                        )}
                        {mode === "dark" ? "Dark" : "Light"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="Accent color" desc="Applied to buttons, links and highlights.">
              <div className="flex flex-wrap gap-3">
                {Object.entries(ACCENTS).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAccent(key as AccentId)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-3 py-2 text-[12.5px] font-medium transition-all",
                      accent === key
                        ? "border-accent/60 ring-2 ring-accent/30 text-ink"
                        : "border-edge text-ink-2 hover:border-edge-strong"
                    )}
                    aria-pressed={accent === key}
                  >
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: value.dark.accent }}
                    />
                    {value.label}
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Layout" desc="Tweaks to fit how you like to work.">
              <div className="divide-y divide-edge">
                <Row
                  title="Compact density"
                  desc="Tighter spacing across lists and the board."
                  checked={app.dense}
                  onToggle={(v) => {
                    setApp((a) => ({ ...a, dense: v }));
                    pushToast(v ? "Compact layout on" : "Comfortable layout on", {
                      variant: "info",
                    });
                  }}
                />
                <Row
                  title="Reduce motion"
                  desc="Prefer static transitions throughout the app."
                  checked={app.reduceMotion}
                  onToggle={(v) => setApp((a) => ({ ...a, reduceMotion: v }))}
                />
              </div>
            </SectionCard>
          </>
        )}

        {section === "notifications" && (
          <SectionCard
            title="Notifications"
            desc="Choose what gets your attention — demo toggles only."
          >
            <div className="divide-y divide-edge">
              <Row
                title="Task assignments"
                desc="When somebody assigns work to you."
                checked={notif.assignments}
                onToggle={(v) => setNotif((n) => ({ ...n, assignments: v }))}
              />
              <Row
                title="Comments"
                desc="When teammates reply to your tasks."
                checked={notif.comments}
                onToggle={(v) => setNotif((n) => ({ ...n, comments: v }))}
              />
              <Row
                title="Due date reminders"
                desc="A nudge a day before a deadline."
                checked={notif.dueReminders}
                onToggle={(v) => setNotif((n) => ({ ...n, dueReminders: v }))}
              />
              <Row
                title="Weekly digest"
                desc="A Monday summary of the week ahead."
                checked={notif.weeklyDigest}
                onToggle={(v) => setNotif((n) => ({ ...n, weeklyDigest: v }))}
              />
              <Row
                title="Product news"
                desc="Occasional updates about NexaBoard."
                checked={notif.productNews}
                onToggle={(v) => setNotif((n) => ({ ...n, productNews: v }))}
              />
            </div>
          </SectionCard>
        )}

        {section === "workspace" && (
          <>
            <SectionCard title="Workspace" desc="General settings for this demo workspace.">
              <Field label="Workspace name">
                <Input
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              </Field>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => pushToast("Workspace saved", { desc: `“${workspaceName}” is up to date.` })}
                >
                  Save workspace
                </Button>
              </div>
            </SectionCard>

            <SectionCard title="Demo state" desc="Little interactions to show off.">
              <div className="divide-y divide-edge">
                <Row
                  title="Sync preferences"
                  desc="Persisted to this browser via localStorage."
                  checked
                  onToggle={(v) =>
                    pushToast(v ? "Synced" : "Sync off", { variant: "info" })
                  }
                />
              </div>
              <div className="mt-3">
                <Button
                  variant="soft"
                  size="sm"
                  onClick={() =>
                    pushToast("Everything's calm", {
                      desc: "Demo flag — no tasks were actually touched.",
                      variant: "info",
                    })
                  }
                >
                  Mark all tasks resolved (demo)
                </Button>
              </div>
            </SectionCard>

            <SectionCard title="Danger zone" desc="Dramatic, but very much a demo.">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[13px] font-medium text-danger">
                    Delete this workspace
                  </p>
                  <p className="text-[12px] text-ink-3">
                    Removes everything… in the demo, just a toast.
                  </p>
                </div>
                <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                  <Trash2 className="h-4 w-4" /> Delete workspace
                </Button>
              </div>
            </SectionCard>
          </>
        )}
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        size="sm"
        title="Delete workspace?"
      >
        <div className="p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            This is a portfolio demo, so nothing real gets deleted — but pointing at a
            confirm dialog makes the interaction feel real.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirmDelete(false);
                pushToast("Workspace deleted", {
                  desc: "Just kidding — it's a demo.",
                  variant: "danger",
                });
              }}
            >
              Delete it
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}