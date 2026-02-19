'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';

// --- Types ---

type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

type Board = Column[];

// --- Constants ---

const STORAGE_KEY = 'kanban-board-state';

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-gray-600 text-gray-200',
  medium: 'bg-blue-600 text-blue-100',
  high: 'bg-amber-600 text-amber-100',
  urgent: 'bg-red-600 text-red-100',
};

const COLUMN_ACCENT: Record<string, string> = {
  backlog: 'border-t-gray-500',
  'in-progress': 'border-t-blue-500',
  review: 'border-t-amber-500',
  done: 'border-t-emerald-500',
};

let _id = Date.now();
const uid = () => `t-${_id++}`;

const defaultBoard: Board = [
  {
    id: 'backlog',
    title: 'Backlog',
    tasks: [
      { id: uid(), title: 'Set up GitHub repo & Vercel deployment', description: '', priority: 'high' },
      { id: uid(), title: 'Connect custom domain', description: '', priority: 'medium' },
      { id: uid(), title: 'Set up Supabase database', description: '', priority: 'high' },
      { id: uid(), title: 'Build email notification system', description: '', priority: 'medium' },
      { id: uid(), title: 'Add Cal.com integration for booking', description: '', priority: 'low' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      { id: uid(), title: 'Build solar landing page (Offer page)', description: '', priority: 'urgent' },
      { id: uid(), title: 'Build AI sales chatbot component', description: '', priority: 'high' },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    tasks: [],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: uid(), title: 'Create Next.js project', description: '', priority: 'medium' },
      { id: uid(), title: 'Audit GHL account', description: '', priority: 'medium' },
      { id: uid(), title: 'Define pipeline stages', description: '', priority: 'medium' },
    ],
  },
];

// --- Component ---

export default function KanbanPage() {
  const [board, setBoard] = useState<Board | null>(null);
  const [modal, setModal] = useState<{ open: boolean; columnId: string }>({ open: false, columnId: '' });
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' as Priority });

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setBoard(JSON.parse(raw));
      } else {
        setBoard(defaultBoard);
      }
    } catch {
      setBoard(defaultBoard);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (board) localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  }, [board]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!board) return;
      const { source, destination } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      const next = board.map((col) => ({ ...col, tasks: [...col.tasks] }));
      const srcCol = next.find((c) => c.id === source.droppableId)!;
      const dstCol = next.find((c) => c.id === destination.droppableId)!;
      const [moved] = srcCol.tasks.splice(source.index, 1);
      dstCol.tasks.splice(destination.index, 0, moved);
      setBoard(next);
    },
    [board],
  );

  const addTask = () => {
    if (!board || !form.title.trim()) return;
    const next = board.map((col) =>
      col.id === modal.columnId
        ? { ...col, tasks: [...col.tasks, { id: uid(), title: form.title.trim(), description: form.description.trim(), priority: form.priority }] }
        : col,
    );
    setBoard(next);
    setForm({ title: '', description: '', priority: 'medium' });
    setModal({ open: false, columnId: '' });
  };

  const deleteTask = (columnId: string, taskId: string) => {
    if (!board) return;
    setBoard(board.map((col) => (col.id === columnId ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) } : col)));
  };

  if (!board) return <div className="flex items-center justify-center h-screen text-gray-400">Loading…</div>;

  return (
    <div className="p-6 h-screen flex flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Project Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">Drag tasks between columns to update status</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem(STORAGE_KEY);
            setBoard(defaultBoard);
          }}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Reset Board
        </button>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {board.map((column) => (
            <div key={column.id} className={`flex-shrink-0 w-72 bg-gray-900 rounded-xl border border-gray-800 border-t-2 ${COLUMN_ACCENT[column.id] ?? 'border-t-gray-600'} flex flex-col`}>
              {/* Column header */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-sm text-gray-200">{column.title}</h2>
                  <span className="text-xs bg-gray-800 text-gray-400 rounded-full px-2 py-0.5">{column.tasks.length}</span>
                </div>
                <button
                  onClick={() => setModal({ open: true, columnId: column.id })}
                  className="text-gray-600 hover:text-gray-300 transition-colors text-lg leading-none"
                  title="Add task"
                >
                  +
                </button>
              </div>

              {/* Tasks */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 px-3 pb-3 space-y-2 overflow-y-auto transition-colors rounded-b-xl ${snapshot.isDraggingOver ? 'bg-gray-800/40' : ''}`}
                  >
                    {column.tasks.map((task, idx) => (
                      <Draggable key={task.id} draggableId={task.id} index={idx}>
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            className={`group bg-gray-850 border border-gray-800 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-shadow ${snap.isDragging ? 'shadow-lg shadow-black/40 ring-1 ring-blue-500/30' : 'hover:border-gray-700'}`}
                            style={{ ...prov.draggableProps.style, backgroundColor: '#1a1d23' }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm text-gray-200 font-medium leading-snug">{task.title}</p>
                              <button
                                onClick={() => deleteTask(column.id, task.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all text-xs mt-0.5 flex-shrink-0"
                              >
                                ✕
                              </button>
                            </div>
                            {task.description && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{task.description}</p>}
                            <div className="mt-2">
                              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                                {task.priority}
                              </span>
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
          ))}
        </div>
      </DragDropContext>

      {/* Add Task Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setModal({ open: false, columnId: '' })}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">
              Add Task → <span className="text-blue-400">{board.find((c) => c.id === modal.columnId)?.title}</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Title *</label>
                <input
                  autoFocus
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
                  placeholder="Optional description"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setForm({ ...form, priority: p })}
                      className={`flex-1 text-xs font-semibold uppercase tracking-wider py-1.5 rounded-lg border transition-all ${
                        form.priority === p
                          ? `${PRIORITY_COLORS[p]} border-transparent`
                          : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal({ open: false, columnId: '' })} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button
                onClick={addTask}
                disabled={!form.title.trim()}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
