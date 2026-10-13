import { useState, useEffect } from "react";
import { Plus, GitBranch, X, Play, Pause, RefreshCw, ExternalLink, Trash2, Check } from "lucide-react";
import { api } from "../services/api.js";

export function Workflows() {
  const [workflows, setWorkflows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [runningId, setRunningId] = useState(null);
  const [ranSuccessId, setRanSuccessId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [newWf, setNewWf] = useState({ name: "", steps: 3, n8nWorkflowId: "" });

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await api.getWorkflows();
      setWorkflows(data || []);
    } catch (e) {
      console.warn("Failed to load workflows:", e);
      setWorkflows([]);
    }
  };

  const handleSyncN8n = async () => {
    setSyncing(true);
    try {
      const res = await api.syncN8nWorkflows();
      alert(res.message || "Workflows synchronized successfully!");
      loadWorkflows();
    } catch (err) {
      alert("n8n Sync failed: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateWorkflow = async (e) => {
    e.preventDefault();
    if (!newWf.name.trim()) return;
    try {
      await api.createWorkflow({
        name: newWf.name,
        steps: Number(newWf.steps) || 1,
        status: "Active",
        n8nWorkflowId: newWf.n8nWorkflowId,
      });
      setIsModalOpen(false);
      setNewWf({ name: "", steps: 3, n8nWorkflowId: "" });
      loadWorkflows();
    } catch (err) {
      alert("Failed to create workflow: " + err.message);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    setTogglingId(id);
    try {
      const updated = await api.toggleWorkflowStatus(id);
      setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: updated.status } : w));
    } catch (e) {
      alert("Failed to toggle status: " + e.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete workflow "${name}"? This will remove it from AutoFlow and n8n.`)) return;
    setDeletingId(id);
    try {
      await api.deleteWorkflow(id);
      setWorkflows(prev => prev.filter(w => w.id !== id));
    } catch (e) {
      alert("Failed to delete workflow: " + e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRunWorkflow = async (wf) => {
    setRunningId(wf.id);
    try {
      // Find automation or call trigger
      const autos = await api.getAutomations();
      const match = (autos || []).find(a => a.n8nWorkflowId === wf.n8nWorkflowId || a.name === wf.name);
      if (match) {
        const res = await api.runAutomation(match.id);
        if (res && res.success) {
          setRanSuccessId(wf.id);
          setTimeout(() => setRanSuccessId(null), 2500);
          loadWorkflows();
        } else {
          alert(res?.message || "Trigger execution failed.");
        }
      } else {
        alert("No linked webhook automation found for this workflow. Click 'Sync from n8n' to update webhook endpoints.");
      }
    } catch (err) {
      alert("Failed to run workflow: " + err.message);
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Workflows
          </h1>
          <p style={{ color: '#9CA3AF' }}>Manage your sequences and active n8n workflows.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncN8n}
            disabled={syncing}
            className="glass-button glass-button-sm flex items-center gap-2"
          >
            <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Sync from n8n"}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="glass-button"
          >
            <Plus size={18} /> New Workflow
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.length === 0 ? (
          <div className="glass-card p-12 text-center col-span-full">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
              <GitBranch size={24} color="#3B82F6" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 6 }}>No workflows found</h3>
            <p style={{ color: '#9CA3AF', fontSize: 14, maxWidth: 440, margin: '0 auto 20px' }}>
              Create a workflow manually or sync your workflows directly from your live n8n instance.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsModalOpen(true)} className="glass-button">
                Create Workflow
              </button>
              <button onClick={handleSyncN8n} disabled={syncing} className="glass-button">
                {syncing ? "Syncing..." : "Sync from n8n"}
              </button>
            </div>
          </div>
        ) : (
          workflows.map((wf) => {
            const isActive = wf.status === 'Active';
            const isToggling = togglingId === wf.id;
            const isRunning = runningId === wf.id;
            const isRanSuccess = ranSuccessId === wf.id;
            const isDeleting = deletingId === wf.id;

            return (
              <div
                key={wf.id}
                className="glass-card p-6 flex flex-col justify-between"
                style={{ minHeight: 220, opacity: isDeleting ? 0.4 : 1 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
                      <GitBranch size={20} color="#3B82F6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: 12, 
                        fontWeight: 600,
                        backgroundColor: isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        color: isActive ? '#22C55E' : '#9CA3AF',
                        border: isActive ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        {wf.status}
                      </div>

                      {wf.n8nWorkflowId && (
                        <a
                          href={`https://rafproj1.sitesv2.alburujits.com/workflow/${wf.n8nWorkflowId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded hover:bg-white/10 transition-colors text-purple-400 hover:text-purple-300"
                          title="Open live workflow in n8n canvas"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{wf.name}</h3>
                  <p style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 12 }}>
                    {wf.steps} steps configured {wf.n8nWorkflowId ? `· ID: ${wf.n8nWorkflowId}` : ""}
                  </p>
                </div>
                
                <div className="pt-4 mt-2 flex items-center justify-between gap-2 flex-wrap" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>
                    {wf.lastEdited || "Recently"}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Run Trigger */}
                    <button
                      onClick={() => handleRunWorkflow(wf)}
                      disabled={isRunning}
                      className="glass-button glass-button-sm flex items-center gap-1"
                      style={{
                        padding: '5px 10px',
                        backgroundColor: isRanSuccess ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255,255,255,0.1)',
                        color: isRanSuccess ? '#22C55E' : '#fff',
                        cursor: isRunning ? 'wait' : 'pointer',
                      }}
                      title="Trigger workflow execution"
                    >
                      {isRanSuccess ? <Check size={12} /> : <Play size={12} className={isRunning ? "animate-spin" : ""} />}
                      {isRunning ? "Running" : (isRanSuccess ? "Started" : "Run")}
                    </button>

                    {/* Activate / Pause Toggle */}
                    <button
                      onClick={() => handleToggle(wf.id, wf.status)}
                      disabled={isToggling}
                      className="glass-button glass-button-sm flex items-center gap-1"
                      style={{
                        padding: '5px 10px',
                        color: isActive ? '#F59E0B' : '#22C55E',
                        cursor: isToggling ? 'wait' : 'pointer',
                      }}
                      title={isActive ? "Pause workflow in n8n" : "Activate workflow in n8n"}
                    >
                      {isActive ? <Pause size={12} /> : <Play size={12} />}
                      {isToggling ? "Updating..." : (isActive ? "Pause" : "Activate")}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(wf.id, wf.name)}
                      disabled={isDeleting}
                      className="glass-button glass-button-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      style={{ padding: '5px 8px', border: '1px solid rgba(239,68,68,0.3)', cursor: isDeleting ? 'wait' : 'pointer' }}
                      title="Delete workflow"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Workflow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 relative" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Create Workflow</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateWorkflow} className="flex flex-col gap-4">
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
                  Workflow Name *
                </label>
                <input
                  required
                  value={newWf.name}
                  onChange={(e) => setNewWf({ ...newWf, name: e.target.value })}
                  placeholder="e.g. Lead Qualification to CRM"
                  className="w-full p-2.5 rounded-lg glass-input"
                  style={{ fontSize: 14 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
                  Steps Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newWf.steps}
                  onChange={(e) => setNewWf({ ...newWf, steps: e.target.value })}
                  className="w-full p-2.5 rounded-lg glass-input"
                  style={{ fontSize: 14 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
                  n8n Workflow ID (Optional - leave blank to create in live n8n)
                </label>
                <input
                  value={newWf.n8nWorkflowId}
                  onChange={(e) => setNewWf({ ...newWf, n8nWorkflowId: e.target.value })}
                  placeholder="Leave blank to auto-create in n8n"
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
