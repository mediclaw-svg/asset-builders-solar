"use client";

import { useEffect, useState } from "react";
import { loadTasks, type Task } from "@/lib/tasks";

const PROJECTS = [
  { name: "Asset Builders Solar Funnel", status: "active", color: "#6366f1" },
  { name: "Command Center", status: "active", color: "#22c55e" },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => setTasks(loadTasks()), []);

  const done = tasks.filter((t) => t.status === "done");
  const inProgress = tasks.filter((t) => t.status === "in-progress");
  const backlog = tasks.filter((t) => t.status === "backlog");
  const todo = tasks.filter((t) => t.status === "todo");
  const review = tasks.filter((t) => t.status === "review");

  const stats = [
    { label: "Completed", value: done.length, color: "text-green-400" },
    { label: "In Progress", value: inProgress.length, color: "text-blue-400" },
    { label: "In Review", value: review.length, color: "text-yellow-400" },
    { label: "Backlog", value: backlog.length + todo.length, color: "text-gray-400" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Overview of all projects managed by MediClaw</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-[var(--text-secondary)] text-xs uppercase tracking-wider">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Active Projects</h2>
        <div className="grid grid-cols-2 gap-4">
          {PROJECTS.map((p) => (
            <div key={p.name} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
              <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-[var(--text-secondary)] capitalize">{p.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Currently Running */}
      {inProgress.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">🔄 Currently Running</h2>
          <div className="space-y-2">
            {inProgress.map((t) => (
              <div key={t.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 flex justify-between items-center">
                <span>{t.title}</span>
                <span className="text-xs px-2 py-1 rounded bg-blue-600/20 text-blue-400">{t.project}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Completions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">✅ Recent Completions</h2>
        <div className="space-y-2">
          {done.slice(-8).reverse().map((t) => (
            <div key={t.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">{t.title}</span>
              <span className="text-xs px-2 py-1 rounded bg-green-600/20 text-green-400">{t.project}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
