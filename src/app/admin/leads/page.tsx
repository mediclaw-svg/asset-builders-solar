'use client';

import { Fragment, useEffect, useState, useMemo } from 'react';

/* ── Types ── */
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  electricBill: string;
  status: string;
  createdAt: string;
  // any extra fields from the API
  [key: string]: unknown;
}

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'closed-won', 'closed-lost'] as const;

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  contacted: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  qualified: 'bg-green-600/20 text-green-400 border-green-600/30',
  'closed-won': 'bg-emerald-600/20 text-emerald-300 border-emerald-600/30',
  'closed-lost': 'bg-red-600/20 text-red-400 border-red-600/30',
};

/* ── Mock data (used when API is unavailable) ── */
const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'John Smith', email: 'john@example.com', phone: '(555) 123-4567', address: '123 Main St, Phoenix, AZ 85001', electricBill: '$180', status: 'new', createdAt: '2026-02-18T10:30:00Z' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '(555) 234-5678', address: '456 Oak Ave, Scottsdale, AZ 85251', electricBill: '$220', status: 'contacted', createdAt: '2026-02-17T14:15:00Z' },
  { id: '3', name: 'Mike Davis', email: 'mike@example.com', phone: '(555) 345-6789', address: '789 Pine Rd, Tempe, AZ 85281', electricBill: '$310', status: 'qualified', createdAt: '2026-02-16T09:00:00Z' },
  { id: '4', name: 'Emily Chen', email: 'emily@example.com', phone: '(555) 456-7890', address: '321 Elm Blvd, Mesa, AZ 85201', electricBill: '$275', status: 'closed-won', createdAt: '2026-02-15T16:45:00Z' },
  { id: '5', name: 'Robert Wilson', email: 'robert@example.com', phone: '(555) 567-8901', address: '654 Cedar Ln, Chandler, AZ 85224', electricBill: '$140', status: 'closed-lost', createdAt: '2026-02-14T11:20:00Z' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa@example.com', phone: '(555) 678-9012', address: '987 Birch Dr, Gilbert, AZ 85234', electricBill: '$195', status: 'new', createdAt: '2026-02-13T08:00:00Z' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/leads')
      .then(async (res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : data.leads ?? []);
      })
      .catch(() => {
        setError('API unavailable — showing mock data');
        setLeads(MOCK_LEADS);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Derived data ── */
  const filtered = useMemo(() => {
    if (!search) return leads;
    const q = search.toLowerCase();
    return leads.filter(
      (l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q),
    );
  }, [leads, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const l of leads) c[l.status] = (c[l.status] || 0) + 1;
    return c;
  }, [leads]);

  function handleStatusChange(id: string, newStatus: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    // TODO: PATCH /api/leads/:id with new status
  }

  /* ── Render ── */
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-1">Leads</h2>
      <p className="text-gray-500 mb-6">Manage and track your solar leads</p>

      {/* Status summary */}
      <div className="flex flex-wrap gap-3 mb-6">
        <span className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-white">
          Total: {leads.length}
        </span>
        {STATUS_OPTIONS.map((s) => (
          <span key={s} className={`rounded-lg border px-4 py-2 text-sm font-medium ${STATUS_COLORS[s]}`}>
            {s}: {counts[s] || 0}
          </span>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-6 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500"
      />

      {error && (
        <p className="mb-4 text-xs text-yellow-500">{error}</p>
      )}

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-gray-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Electric Bill</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const expanded = expandedId === lead.id;
                return (
                  <Fragment key={lead.id}>
                    <tr
                      onClick={() => setExpandedId(expanded ? null : lead.id)}
                      className="border-t border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-white">{lead.name}</td>
                      <td className="px-4 py-3 text-gray-400">{lead.email}</td>
                      <td className="px-4 py-3 text-gray-400">{lead.phone}</td>
                      <td className="px-4 py-3 text-gray-400 max-w-[200px] truncate">{lead.address}</td>
                      <td className="px-4 py-3 text-gray-300">{lead.electricBill}</td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`rounded-md border px-2 py-1 text-xs font-medium outline-none cursor-pointer ${STATUS_COLORS[lead.status] || 'bg-gray-800 text-gray-400 border-gray-700'}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="bg-gray-900 text-gray-200">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="border-t border-gray-800/50 bg-gray-900/50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            {Object.entries(lead).map(([key, val]) => (
                              <div key={key}>
                                <span className="text-gray-500 text-xs uppercase tracking-wider">{key}</span>
                                <p className="text-gray-300 mt-0.5">{String(val)}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-600">
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
