"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { loadTasks, saveTasks, STATUS_LABELS, STATUS_COLUMNS, PRIORITY_COLORS, type Task, type Status, type Priority } from "@/lib/tasks";

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", priority: "medium" as Priority, project: "Solar Funnel", status: "backlog" as Status });

  useEffect(() => setTasks(loadTasks()), []);

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as Status;
    const updated = tasks.map((t) => (t.id === result.draggableId ? { ...t, status: newStatus } : t));
    setTasks(updated);
    saveTasks(updated);
  }

  function addTask() {
    if (!form.title.trim()) return;
    const newTask: Task = { ...form, id: Date.now().toString(), createdAt: new Date().toISOString().slice(0, 10) };
    const updated = [...tasks, newTask];
    setTasks(updated);
    saveTasks(updated);
    setForm({ title: "", priority: "medium", project: "Solar Funnel", status: "backlog" });
    setShowForm(false);
  }

  return (
    <div className="p-8 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kanban Board</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Drag tasks between columns</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-lg text-sm font-medium transition-colors">
          + Add Task
        </button>
      </div>

      {showForm && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex gap-3 items-end">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm">
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
          </select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm">
            {STATUS_COLUMNS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <input value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} placeholder="Project" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm w-40" />
          <button onClick={addTask} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">Save</button>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((status) => {
            const columnTasks = tasks.filter((t) => t.status === status);
            return (
              <div key={status} className="flex-1 min-w-[220px] flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{STATUS_LABELS[status]}</h3>
                  <span className="text-xs bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-2 py-0.5">{columnTasks.length}</span>
                </div>
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 rounded-xl p-2 space-y-2 transition-colors min-h-[200px] ${snapshot.isDraggingOver ? "bg-[var(--accent)]/10 border-2 border-dashed border-[var(--accent)]" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3 space-y-2 transition-shadow ${snapshot.isDragging ? "shadow-lg shadow-[var(--accent)]/20" : ""}`}
                            >
                              <p className="text-sm font-medium">{task.title}</p>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${PRIORITY_COLORS[task.priority]} text-white`}>{task.priority}</span>
                                <span className="text-[10px] text-[var(--text-secondary)]">{task.project}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
