import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Command Center | MediClaw",
  description: "Project management dashboard for MediClaw AI agent",
};

const NAV = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/backlog", label: "Backlog", icon: "📋" },
  { href: "/kanban", label: "Kanban", icon: "🗂️" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen">
        <aside className="w-56 shrink-0 border-r border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col">
          <div className="p-5 border-b border-[var(--border)]">
            <h1 className="text-lg font-bold tracking-tight">⚡ Command Center</h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">MediClaw Agent</p>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-[var(--bg-hover)] transition-colors"
              >
                <span>{n.icon}</span>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
            Asset Builders © 2026
          </div>
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
