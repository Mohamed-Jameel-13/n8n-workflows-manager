import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Play, Edit, Power, Clock, Activity, CheckCircle, XCircle, MessageSquare, Workflow, Hash, Calendar, RefreshCw, ExternalLink, Copy, Check, Trash2 } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { Tag } from "../components/Tag.jsx";
import { api } from "../services/api.js";

const typeIcons = {
  whatsapp: MessageSquare,
  n8n: Workflow,
  cron: Clock,
};

const typeColors = {
  whatsapp: '#22C55E',
  n8n: '#8B5CF6',
  cron: '#3B82F6',
};

const typeLabels = {
  whatsapp: 'WhatsApp',
  n8n: 'n8n Workflow',
  cron: 'Cron Job',
};

export function AutomationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('logs');
  const [automation, setAutomation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runMessage, setRunMessage] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "", webhookUrl: "" });
  const [savedSettings, setSavedSettings] = useState(false);

  useEffect(() => {
    loadAutomation();
  }, [id]);

  const loadAutomation = async () => {
    setLoading(true);
    try {
      const data = await api.getAutomation(id);
      setAutomation(data);
      setEditForm({
        name: data.name,
        description: data.description || "",
        webhookUrl: data.webhookUrl || "",
      });
    } catch (e) {
      console.warn("Could not load automation:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunNow = async () => {
    setRunning(true);
    setRunMessage(null);
    try {
      const res = await api.runAutomation(id);
      setRunMessage({ success: res.success, text: res.message || "Executed successfully" });
      await loadAutomation();
      setTimeout(() => setRunMessage(null), 3500);
    } catch (e) {
      setRunMessage({ success: false, text: e.message || "Execution failed" });
    } finally {
      setRunning(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const updated = await api.toggleAutomationStatus(id);
      setAutomation(prev => ({ ...prev, status: updated.status }));
    } catch (e) {
      alert("Failed to toggle status: " + e.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${automation.name}"? This will remove it from AutoFlow and n8n.`)) return;
    try {
      await api.deleteAutomation(id);
      navigate('/automations');
    } catch (e) {
      alert("Failed to delete automation: " + e.message);
    }
  };

  const handleCopyWebhook = () => {
    if (!automation.webhookUrl) return;
    navigator.clipboard.writeText(automation.webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.updateAutomation(id, editForm);
      setAutomation(prev => ({ ...prev, ...editForm }));
      setSavedSettings(true);
      setTimeout(() => setSavedSettings(false), 2000);
    } catch (e) {
      alert("Failed to save settings: " + e.message);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 900 }} className="text-center py-16 text-gray-400">
        <RefreshCw className="animate-spin inline-block mr-2" size={18} /> Loading automation details...
      </div>
    );
  }

  if (!automation) {
    return (
      <div style={{ maxWidth: 900 }}>
        <div className="text-center py-16">
          <p style={{ fontSize: 16, color: '#E5E7EB', marginBottom: 8 }}>Automation not found</p>
          <Link to="/automations" style={{ fontSize: 13, color: '#3B82F6', textDecoration: 'none' }}>
            ← Back to automations
          </Link>
        </div>
      </div>
    );
  }

  const TypeIcon = typeIcons[automation.type] || Workflow;
  const logs = automation.logs || [];
  const successCount = logs.filter(l => l.status === 'success').length;
  const successRate = logs.length > 0 ? ((successCount / logs.length) * 100).toFixed(1) : "100.0";
  const failedCount = logs.filter(l => l.status === 'failed').length;

  const tabs = [
    { id: 'logs', label: 'Logs' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Back */}
      <Link
        to="/automations"
        className="inline-flex items-center gap-1.5 mb-6 transition-colors duration-200"
        style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: 13 }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#E5E7EB'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
      >
        <ArrowLeft size={15} />
        Back to automations
      </Link>

      {/* Header Card */}
      <div className="glass-card p-6 mb-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${typeColors[automation.type] || '#8B5CF6'}18` }}
            >
              <TypeIcon size={26} style={{ color: typeColors[automation.type] || '#8B5CF6' }} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 style={{ fontSize: 24, fontWeight: 700, color: '#F9FAFB' }}>{automation.name}</h1>
                <StatusBadge status={automation.status} />
              </div>
              <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 12, maxWidth: 560 }}>{automation.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {(automation.tags || []).map((tag, index) => (
                  <Tag key={index} label={tag.label} variant={tag.variant} />
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRunNow}
              disabled={running}
              className="glass-button glass-button-sm flex items-center gap-2"
              style={{ cursor: running ? 'wait' : 'pointer', backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
            >
              <Play size={14} className={running ? "animate-spin" : ""} />
              {running ? "Running..." : "Run Now"}
            </button>

            {automation.n8nWorkflowId && (
              <a
                href={`https://rafproj1.sitesv2.alburujits.com/workflow/${automation.n8nWorkflowId}`}
                target="_blank"
                rel="noreferrer"
                className="glass-button glass-button-sm flex items-center gap-1.5 text-purple-400 hover:text-purple-300"
                style={{ textDecoration: 'none' }}
                title="Open live workflow in n8n canvas"
              >
                <ExternalLink size={14} />
                View in n8n
              </a>
            )}

            <button
              onClick={() => setActiveTab('settings')}
              className="glass-button glass-button-sm flex items-center gap-1.5"
            >
              <Edit size={14} />
              Edit
            </button>

            <button
              onClick={handleToggleStatus}
              className="glass-button glass-button-sm flex items-center gap-1.5"
              style={{
                border: automation.status === 'enabled' ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(34,197,94,0.3)',
                color: automation.status === 'enabled' ? '#F59E0B' : '#22C55E',
                cursor: 'pointer'
              }}
            >
              <Power size={14} />
              {automation.status === 'enabled' ? 'Pause' : 'Activate'}
            </button>

            <button
              onClick={handleDelete}
              className="glass-button glass-button-sm flex items-center gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              style={{ border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer' }}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>

        {/* Live Execution Feedback Alert */}
        {runMessage && (
          <div
            className="mt-4 p-3 rounded-lg text-sm flex items-center gap-2"
            style={{
              backgroundColor: runMessage.success ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${runMessage.success ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              color: runMessage.success ? '#22C55E' : '#EF4444',
            }}
          >
            {runMessage.success ? <CheckCircle size={16} /> : <XCircle size={16} />}
            <span>{runMessage.text}</span>
          </div>
        )}
      </div>

      {/* Two-column: Details + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        {/* Details */}
        <div className="lg:col-span-3 glass-card p-6">
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#F9FAFB', marginBottom: 16 }}>Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: Workflow, label: 'Type', value: typeLabels[automation.type] || automation.type },
              { icon: Calendar, label: 'Created', value: automation.createdAt || "Recently" },
              { icon: Clock, label: 'Last run', value: automation.lastRun?.time || 'Never' },
              { icon: Hash, label: 'Total runs', value: Number(automation.runCount || 0).toLocaleString() },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#111827' }}>
                  <Icon size={14} color="#9CA3AF" />
                </div>
                <span style={{ fontSize: 13, color: '#9CA3AF', width: 90 }}>{label}</span>
                <span style={{ fontSize: 13, color: '#E5E7EB', fontWeight: 500 }}>{value}</span>
              </div>
            ))}

            {automation.webhookUrl && (
              <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#111827' }}>
                  <Workflow size={14} color="#9CA3AF" />
                </div>
                <span style={{ fontSize: 13, color: '#9CA3AF', width: 90 }}>Webhook</span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span style={{ fontSize: 12, color: '#A78BFA', fontFamily: 'monospace' }} className="truncate">
                    {automation.webhookUrl}
                  </span>
                  <button
                    onClick={handleCopyWebhook}
                    className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                    title="Copy Webhook URL"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {copiedUrl ? <Check size={13} color="#22C55E" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
          {[
            { icon: Activity, label: 'Total Runs', value: Number(automation.runCount || 0).toLocaleString(), color: '#3B82F6' },
            { icon: CheckCircle, label: 'Success Rate', value: `${successRate}%`, color: '#22C55E' },
            { icon: XCircle, label: 'Failed Runs', value: String(failedCount), color: '#EF4444' },
            { icon: Clock, label: 'Avg Duration', value: '0.8s', color: '#8B5CF6' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={15} style={{ color }} />
                <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color, letterSpacing: '-0.01em' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="glass-card overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center px-2 pt-2" style={{ borderBottom: '1px solid #1F2933' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2.5 transition-colors duration-200"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: activeTab === tab.id ? '#F9FAFB' : '#9CA3AF',
                borderBottom: activeTab === tab.id ? '2px solid #3B82F6' : '2px solid transparent',
                marginBottom: -1,
                background: 'none',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1F2933' }}>
                    {['Timestamp', 'Status', 'Message', 'Duration'].map((h) => (
                      <th
                        key={h}
                        style={{ textAlign: 'left', padding: '0 16px 12px', fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-sm text-gray-500">
                        No logs recorded yet. Click "Run Now" to trigger an execution.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log, index) => (
                      <tr
                        key={index}
                        style={{ borderBottom: '1px solid #1F2933', transition: 'background-color 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#9CA3AF', fontFamily: 'monospace' }}>
                          {log.timestamp}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <StatusBadge status={log.status} size="sm" />
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#E5E7EB' }}>
                          {log.message}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#9CA3AF' }}>
                          {log.duration}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="p-6">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {logs.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">No execution history recorded yet.</p>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 rounded-lg"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: log.status === 'success' ? '#22C55E' : '#EF4444' }}
                      />
                      <span style={{ fontSize: 13, color: '#E5E7EB' }}>Run #{logs.length - index}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span style={{ fontSize: 12, color: '#6B7280', fontFamily: 'monospace' }}>{log.timestamp}</span>
                      <StatusBadge status={log.status} size="sm" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="p-6" style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
                  Automation name
                </label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg glass-input text-sm"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg glass-input text-sm resize-none"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
                  Custom Webhook URL
                </label>
                <input
                  value={editForm.webhookUrl}
                  onChange={(e) => setEditForm({ ...editForm, webhookUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg glass-input text-sm"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="glass-button glass-button-sm font-semibold"
                >
                  {savedSettings ? "Changes Saved!" : "Save changes"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
