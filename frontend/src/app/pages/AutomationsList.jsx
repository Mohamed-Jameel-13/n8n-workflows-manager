import { useState, useEffect } from "react";
import { Plus, Search, X, LayoutGrid, List, RefreshCw } from "lucide-react";
import { AutomationCard } from "../components/AutomationCard.jsx";
import { api } from "../services/api.js";

export function AutomationsList() {
  const [automations, setAutomations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [newAuto, setNewAuto] = useState({
    name: "",
    description: "",
    type: "n8n",
    n8nWorkflowId: "",
    webhookUrl: "",
  });

  const filterTags = [
    { id: 'all', label: 'All' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'n8n', label: 'n8n' },
    { id: 'cron', label: 'Cron Jobs' },
  ];

  const loadAutomations = async () => {
    try {
      const data = await api.getAutomations(activeFilter, searchTerm);
      setAutomations(data || []);
    } catch (e) {
      console.warn("Failed to load automations:", e);
      setAutomations([]);
    }
  };

  useEffect(() => {
    loadAutomations();
  }, [activeFilter, searchTerm]);

  const handleSyncN8n = async () => {
    setSyncing(true);
    try {
      const res = await api.syncN8nWorkflows();
      alert(res.message || "Workflows synchronized successfully!");
      loadAutomations();
    } catch (err) {
      alert("n8n Sync failed: " + err.message + "\n\nTip: Make sure your n8n Base URL and API Key are saved in Settings.");
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateAutomation = async (e) => {
    e.preventDefault();
    if (!newAuto.name.trim()) return;
    try {
      await api.createAutomation({
        name: newAuto.name,
        description: newAuto.description,
        type: newAuto.type,
        status: 'enabled',
        n8nWorkflowId: newAuto.n8nWorkflowId,
        webhookUrl: newAuto.webhookUrl,
        tags: [
          { label: newAuto.type, variant: newAuto.type === 'whatsapp' ? 'green' : (newAuto.type === 'cron' ? 'blue' : 'purple') },
          { label: 'n8n', variant: 'purple' }
        ],
      });
      setIsModalOpen(false);
      setNewAuto({ name: "", description: "", type: "n8n", n8nWorkflowId: "", webhookUrl: "" });
      loadAutomations();
    } catch (err) {
      alert("Failed to create automation: " + err.message);
    }
  };

  const enabledCount = automations.filter(a => a.status === 'enabled').length;

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F9FAFB', marginBottom: 2 }}>Automations</h2>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>
            {automations.length} automations · {enabledCount} enabled
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncN8n}
            disabled={syncing}
            className="glass-button glass-button-sm flex items-center gap-2"
            title="Import real workflows from your connected n8n instance"
          >
            <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Sync from n8n"}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="glass-button glass-button-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Create Automation
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {/* Search */}
        <div className="relative" style={{ flex: '1', minWidth: 240, maxWidth: 380 }}>
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#6B7280' }}
          />
          <input
            type="text"
            placeholder="Search automations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-lg glass-input"
            style={{ fontSize: 13 }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter tags */}
        <div className="flex items-center gap-2">
          {filterTags.map((tag) => {
            const active = activeFilter === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => setActiveFilter(tag.id)}
                className="px-3 py-1.5 rounded-lg transition-all duration-150"
                style={{
                  backgroundColor: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: active ? '#fff' : '#9CA3AF',
                  border: `1px solid ${active ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  fontSize: 13,
                  fontWeight: active ? 500 : 400,
                  cursor: 'pointer',
                }}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        {/* View mode toggle */}
        <div
          className="flex items-center rounded-lg p-0.5 ml-auto"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <button
            onClick={() => setViewMode('grid')}
            className="p-1.5 rounded transition-colors duration-200"
            style={{
              backgroundColor: viewMode === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: viewMode === 'grid' ? '#F9FAFB' : '#6B7280',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="p-1.5 rounded transition-colors duration-200"
            style={{
              backgroundColor: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: viewMode === 'list' ? '#F9FAFB' : '#6B7280',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Cards Grid / List */}
      <div
        className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}
      >
        {automations.length === 0 ? (
          <div className="glass-card p-12 text-center col-span-full">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(163,230,53,0.1)' }}>
              <Plus size={24} color="#a3e635" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 6 }}>No automations yet</h3>
            <p style={{ color: '#9CA3AF', fontSize: 14, maxWidth: 440, margin: '0 auto 20px' }}>
              Create your first automation or sync directly from your connected real n8n account.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsModalOpen(true)} className="glass-button">
                Create Automation
              </button>
              <button onClick={handleSyncN8n} disabled={syncing} className="glass-button">
                {syncing ? "Syncing..." : "Sync from n8n"}
              </button>
            </div>
          </div>
        ) : (
          automations.map((automation) => (
            <AutomationCard
              key={automation.id}
              {...automation}
              onStatusToggle={(id, newStatus) => {
                setAutomations(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
              }}
              onDelete={(id) => {
                setAutomations(prev => prev.filter(a => a.id !== id));
              }}
              onRunComplete={loadAutomations}
            />
          ))
        )}
      </div>

      {/* Create Automation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-6 relative" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Create New Automation</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAutomation} className="flex flex-col gap-4">
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
                  Automation Name *
                </label>
                <input
                  required
                  value={newAuto.name}
                  onChange={(e) => setNewAuto({ ...newAuto, name: e.target.value })}
                  placeholder="e.g. Lead Qualification to CRM"
                  className="w-full p-2.5 rounded-lg glass-input"
                  style={{ fontSize: 14 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
                  Description
                </label>
                <textarea
                  value={newAuto.description}
                  onChange={(e) => setNewAuto({ ...newAuto, description: e.target.value })}
                  placeholder="What does this automation do?"
                  rows={2}
                  className="w-full p-2.5 rounded-lg glass-input"
                  style={{ fontSize: 14 }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
                    Type
                  </label>
                  <select
                    value={newAuto.type}
                    onChange={(e) => setNewAuto({ ...newAuto, type: e.target.value })}
                    className="w-full p-2.5 rounded-lg glass-input"
                    style={{ fontSize: 14 }}
                  >
                    <option value="n8n" style={{ background: '#111827' }}>n8n Workflow</option>
                    <option value="whatsapp" style={{ background: '#111827' }}>WhatsApp</option>
                    <option value="cron" style={{ background: '#111827' }}>Cron Scheduled</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
                    n8n Workflow ID
                  </label>
                  <input
                    value={newAuto.n8nWorkflowId}
                    onChange={(e) => setNewAuto({ ...newAuto, n8nWorkflowId: e.target.value })}
                    placeholder="e.g. 1 or wf_abc123"
                    className="w-full p-2.5 rounded-lg glass-input"
                    style={{ fontSize: 14 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
                  Direct Webhook URL (Optional)
                </label>
                <input
                  value={newAuto.webhookUrl}
                  onChange={(e) => setNewAuto({ ...newAuto, webhookUrl: e.target.value })}
                  placeholder="https://your-n8n.cloud/webhook/..."
                  className="w-full p-2.5 rounded-lg glass-input"
                  style={{ fontSize: 14 }}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="glass-button glass-button-sm"
                  style={{ color: '#9CA3AF' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glass-button glass-button-sm"
                  style={{ backgroundColor: '#a3e635', color: '#000', fontWeight: 600 }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
