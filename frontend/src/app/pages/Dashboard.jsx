import { useState, useEffect } from "react";
import { Zap, CheckCircle, Activity, XCircle, ArrowUpRight, RefreshCw } from "lucide-react";
import { Link } from "react-router";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { KPICard } from "../components/KPICard.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { api } from "../services/api.js";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#111827', border: '1px solid #1F2933', borderRadius: 8, padding: '8px 12px' }}>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#a3e635' }}>{payload[0].value} runs</p>
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const [kpi, setKpi] = useState({
    totalAutomations: 0,
    enabledAutomations: 0,
    runs24h: 0,
    failedRuns: 0,
  });
  const [chartData, setChartData] = useState([
    { day: "Mon", runs: 0 },
    { day: "Tue", runs: 0 },
    { day: "Wed", runs: 0 },
    { day: "Thu", runs: 0 },
    { day: "Fri", runs: 0 },
    { day: "Sat", runs: 0 },
    { day: "Sun", runs: 0 },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadDashboard = async () => {
    try {
      const [kpiRes, chartRes, recentRes] = await Promise.all([
        api.getDashboardKpi().catch(() => null),
        api.getDashboardChart().catch(() => null),
        api.getDashboardRecent().catch(() => null),
      ]);
      if (kpiRes) setKpi(kpiRes);
      if (chartRes) setChartData(chartRes);
      if (recentRes) setRecentActivity(recentRes);
    } catch (e) {
      console.warn("Error loading dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleSyncN8n = async () => {
    setSyncing(true);
    try {
      const res = await api.syncN8nWorkflows();
      alert(res.message || "Workflows synchronized successfully!");
      loadDashboard();
    } catch (e) {
      alert("Sync failed: " + e.message);
    } finally {
      setSyncing(false);
    }
  };

  const successRate = kpi.runs24h > 0
    ? (((kpi.runs24h - kpi.failedRuns) / kpi.runs24h) * 100).toFixed(1) + '%'
    : '100%';

  const mostActiveName = recentActivity.length > 0 && recentActivity[0].automationName
    ? recentActivity[0].automationName
    : (kpi.totalAutomations > 0 ? "Configured" : "None yet");

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#F9FAFB', marginBottom: 2 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Live overview of automations, execution activity, and n8n triggers.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncN8n}
            disabled={syncing}
            className="glass-button glass-button-sm flex items-center gap-2"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Sync from n8n"}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          icon={Zap}
          label="Total Automations"
          value={kpi.totalAutomations}
          trend={kpi.totalAutomations > 0 ? `${kpi.totalAutomations} active` : "0 configured"}
          accent="#a3e635"
        />
        <KPICard
          icon={CheckCircle}
          label="Enabled"
          value={kpi.enabledAutomations}
          trend={kpi.totalAutomations > 0 ? `${Math.round((kpi.enabledAutomations / Math.max(kpi.totalAutomations, 1)) * 100)}% of total` : "None"}
          accent="#22C55E"
        />
        <KPICard
          icon={Activity}
          label="Runs (24h)"
          value={kpi.runs24h}
          trend={kpi.runs24h > 0 ? `${kpi.runs24h} executed` : "No runs yet"}
          accent="#3B82F6"
        />
        <KPICard
          icon={XCircle}
          label="Failed Runs"
          value={kpi.failedRuns}
          trend={kpi.failedRuns === 0 ? "0 failures" : `${kpi.failedRuns} need review`}
          accent="#EF4444"
        />
      </div>

      {/* Middle Row: Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Execution Volume Chart */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F9FAFB' }}>Weekly Execution Volume</h3>
              <span style={{ fontSize: 12, color: '#6B7280' }}>Past 7 days</span>
            </div>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 20 }}>
              Live execution runs logged from n8n webhooks and triggers
            </p>
          </div>

          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="runGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a3e635" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#a3e635" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2933" />
                <XAxis dataKey="day" stroke="#4B5563" tick={{ fontSize: 12 }} />
                <YAxis stroke="#4B5563" tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="runs"
                  stroke="#a3e635"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#runGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F9FAFB' }}>Recent Activity</h3>
              <Link
                to="/activity"
                className="flex items-center gap-1 hover:underline text-lime-400"
                style={{ fontSize: 12, color: '#a3e635', textDecoration: 'none' }}
              >
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {recentActivity.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                No recent executions yet.<br />Trigger a workflow or webhook to see live activity.
              </div>
            ) : (
              recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.status === 'success' ? '#22C55E' : '#EF4444' }}
                    />
                    <span
                      className="truncate"
                      style={{ fontSize: 13, color: '#E5E7EB' }}
                    >
                      {item.automationName || item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <span style={{ fontSize: 11, color: '#6B7280' }}>{item.time || item.timestamp}</span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Success Rate (24h)', value: successRate, color: '#22C55E' },
          { label: 'Total Automations', value: String(kpi.totalAutomations), color: '#a3e635' },
          { label: 'Most Active', value: mostActiveName, color: '#F9FAFB', isText: true },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {stat.label}
            </div>
            <div
              style={{
                fontSize: stat.isText ? 17 : 28,
                fontWeight: 700,
                color: stat.color,
                letterSpacing: '-0.01em',
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
