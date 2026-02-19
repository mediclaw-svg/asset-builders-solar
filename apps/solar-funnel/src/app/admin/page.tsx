// TODO: Replace placeholder data with real API integration (GET /api/stats or similar)

const stats = [
  { label: 'Total Leads', value: '128', icon: '👥', color: 'bg-blue-600/20 text-blue-400' },
  { label: 'New Leads', value: '24', icon: '🆕', color: 'bg-purple-600/20 text-purple-400' },
  { label: 'Booked Consultations', value: '18', icon: '📅', color: 'bg-emerald-600/20 text-emerald-400' },
  { label: 'Conversion Rate', value: '14.1%', icon: '📈', color: 'bg-amber-600/20 text-amber-400' },
];

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-2">Dashboard</h2>
      <p className="text-gray-500 mb-8">Overview of your solar lead pipeline</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg ${s.color} mb-4`}>
              {s.icon}
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* TODO: Add charts, recent activity feed, etc. */}
      <div className="mt-10 rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Recent Activity</h3>
        <p className="text-gray-500 text-sm">Coming soon — recent lead submissions and status changes will appear here.</p>
      </div>
    </div>
  );
}
