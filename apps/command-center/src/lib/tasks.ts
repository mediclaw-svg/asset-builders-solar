export type Status = "backlog" | "todo" | "in-progress" | "review" | "done";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  project: string;
  createdAt: string;
}

export const INITIAL_TASKS: Task[] = [
  // BACKLOG
  { id: "1", title: "Set up Supabase database", status: "backlog", priority: "high", project: "Solar Funnel", createdAt: "2026-02-15" },
  { id: "2", title: "Build AI sales chatbot backend", status: "backlog", priority: "high", project: "Solar Funnel", createdAt: "2026-02-15" },
  { id: "3", title: "Set up email service", status: "backlog", priority: "medium", project: "Solar Funnel", createdAt: "2026-02-15" },
  { id: "4", title: "Connect custom domain", status: "backlog", priority: "medium", project: "Solar Funnel", createdAt: "2026-02-15" },
  { id: "5", title: "Wire Cal.com calendar integration", status: "backlog", priority: "medium", project: "Solar Funnel", createdAt: "2026-02-15" },
  { id: "6", title: "Replace JSON file storage with Supabase", status: "backlog", priority: "high", project: "Solar Funnel", createdAt: "2026-02-15" },
  { id: "7", title: "Add authentication to admin pages", status: "backlog", priority: "medium", project: "Solar Funnel", createdAt: "2026-02-15" },
  { id: "8", title: "Build email templates", status: "backlog", priority: "low", project: "Solar Funnel", createdAt: "2026-02-15" },
  { id: "9", title: "SEO optimization", status: "backlog", priority: "low", project: "Solar Funnel", createdAt: "2026-02-15" },
  // DONE
  { id: "10", title: "Audit GHL account", status: "done", priority: "high", project: "Solar Funnel", createdAt: "2026-02-10" },
  { id: "11", title: "Build solar landing page", status: "done", priority: "high", project: "Solar Funnel", createdAt: "2026-02-11" },
  { id: "12", title: "Build booking page", status: "done", priority: "high", project: "Solar Funnel", createdAt: "2026-02-11" },
  { id: "13", title: "Build thank you page", status: "done", priority: "medium", project: "Solar Funnel", createdAt: "2026-02-11" },
  { id: "14", title: "Build leads API", status: "done", priority: "high", project: "Solar Funnel", createdAt: "2026-02-12" },
  { id: "15", title: "Build bookings API", status: "done", priority: "high", project: "Solar Funnel", createdAt: "2026-02-12" },
  { id: "16", title: "Build admin dashboard", status: "done", priority: "high", project: "Solar Funnel", createdAt: "2026-02-13" },
  { id: "17", title: "Build leads management", status: "done", priority: "high", project: "Solar Funnel", createdAt: "2026-02-13" },
  { id: "18", title: "Build kanban board", status: "done", priority: "medium", project: "Solar Funnel", createdAt: "2026-02-14" },
  { id: "19", title: "Restructure to monorepo", status: "done", priority: "high", project: "Infrastructure", createdAt: "2026-02-16" },
  { id: "20", title: "Create GitHub account", status: "done", priority: "high", project: "Infrastructure", createdAt: "2026-02-16" },
  { id: "21", title: "Deploy to Vercel", status: "done", priority: "high", project: "Infrastructure", createdAt: "2026-02-17" },
];

const STORAGE_KEY = "command-center-tasks";

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return INITIAL_TASKS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
  return INITIAL_TASKS;
}

export function saveTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export const STATUS_LABELS: Record<Status, string> = {
  backlog: "Backlog",
  todo: "To Do",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: "bg-gray-600",
  medium: "bg-blue-600",
  high: "bg-orange-500",
  urgent: "bg-red-600",
};

export const STATUS_COLUMNS: Status[] = ["backlog", "todo", "in-progress", "review", "done"];
