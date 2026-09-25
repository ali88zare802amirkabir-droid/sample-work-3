"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { TaskModalHost } from "@/components/tasks/task-modal";
import { ToastHost } from "@/components/ui/toast";

export function AppShell({ children }: { children: ReactNode }) {
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileNavOpen,
    setMobileNavOpen,
  } = useApp();

  return (
    <div className="min-h-screen">
      <div className="app-bg" aria-hidden />

      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 hidden lg:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px] animate-fade-in"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 animate-drawer-in">
            <Sidebar
              collapsed={false}
              mobile
              onToggle={toggleSidebar}
              onCloseMobile={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-200 ease-out",
          sidebarCollapsed ? "lg:pl-[68px]" : "lg:pl-[236px]"
        )}
      >
        <Topbar />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      <TaskModalHost />
      <ToastHost />
    </div>
  );
}