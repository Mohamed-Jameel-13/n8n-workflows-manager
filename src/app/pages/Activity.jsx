import { useState, useEffect } from "react";
import { Activity as ActivityIcon, Download, RefreshCw } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { api } from "../services/api.js";

export function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await api.getActivities();
      setActivities(data || []);
    } catch (e) {
      console.warn("Failed to load activities:", e);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    window.open(api.exportActivityCsvUrl(), '_blank');
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Activity Log
          </h1>
          <p style={{ color: '#9CA3AF' }}>Detailed execution history across all automations and n8n triggers.</p>
        </div>
        <button onClick={handleExportCsv} className="glass-button">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
            <ActivityIcon size={16} /> Recent Executions ({activities.length})
          </div>
          <button
            onClick={loadActivities}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF', fontSize: 13 }}>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Trigger</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                    No execution logs found. Trigger an automation to record live executions.
                  </td>
                </tr>
              ) : (
                activities.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors duration-150"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="px-6 py-4 font-medium text-white">{item.automationName || item.name}</td>
                    <td className="px-6 py-4 text-gray-400">{item.trigger}</td>
                    <td className="px-6 py-4 text-gray-400">{item.duration}</td>
                    <td className="px-6 py-4 text-gray-400">{item.time}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
