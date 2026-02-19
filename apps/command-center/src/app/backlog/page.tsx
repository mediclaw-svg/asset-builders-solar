"use client";

import { useEffect, useState, useMemo } from "react";
import { loadTasks, saveTasks, PRIORITY_COLORS, STATUS_LABELS, type Task, type Status, type Priority } from "@/lib/tasks";

export default function BacklogPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterProject, setFilterProject] = useState("all");
  const [sortBy, setSortBy] = useState<"priority" | "project" | "status">("priority");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium" as Priority, project: "Solar Funnel", status: "backlog" as Status });

  useEffect(() => setTasks(loadTasks()), []);

  const projects = useMemo(() => [...new Set(tasks.map((t) => t.project))], [tasks]);

  const priorityOrder: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
  const statusOrder: Record<Status, number> = { backlog: 0, todo: 1, "in-progress": 2, review: 3, done: 4 };

  const filtered = useMemo(() => {
    let list = filterProject === "all" ? tasks : tasks.filter((t) => t.project === filterProject);
    list = [...list].sort((a, b) => {
      if (sortBy === "priority") return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortBy === "status") return statusOrder[a.status] - statusOrder[b.status];
      return a.project.localeCompare(b.project);
    });
    return list;
  }, [tasks, filterProject, sortBy]);

  function addTask() {
    if (!form.title.trim()) return;
    const newTask: Task = { ...form, id: Date.now().toString(), createdAt: new Date().toISOString().slice(0, 10) };
    const updated = [...tasks, newTask];
    setTasks(updated);
    saveTasks(updated);
    setForm({ title: "", description: "", priority: "medium", project: "Solar Funnel", status: "backlog" });
    setShowForm(false);
  }

  function updateStatus(id: string, status: Status) {
    const updated = tasks.map((t) => (t.id === id ? { ...t, status } : t));
    setTasks(updated);
    saveTasks(updated);
  }

  function deleteTask(id: string) {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Backlog</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">{tasks.length} total tasks</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-lg text-sm font-medium transition-colors">
          + Add Task
        </button>
      </div>

      {showForm && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
          <div className="flex gap-3">
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm">
              <option value="backlog">Backlog</option><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="review">Review</option><option value="done">Done</option>
            </select>
            <input value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} placeholder="Project" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
            <button onClick={addTask} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors">Save</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm">
          <option value="all">All Projects</option>
          {projects.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm">
          <option value="priority">Sort by Priority</option>
          <option value="status">Sort by Status</option>
          <option value="project">Sort by Project</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3">Task</th>
              <th className="text-left px-4 py-3">Project</th>
              <th className="text-left px-4 py-3">Priority</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors">
                <td className="px-4 py-3">{t.title}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{t.project}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${PRIORITY_COLORS[t.priority]} text-white`}>{t.priority}</span>
                </td>
                <td className="px-4 py-3">
                  <select value={t.status} onChange={(e) => updateStatus(t.id, e.target.value as Status)} className="bg-transparent border border-[var(--border)] rounded px-2 py-1 text-xs">
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => deleteTask(t.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
