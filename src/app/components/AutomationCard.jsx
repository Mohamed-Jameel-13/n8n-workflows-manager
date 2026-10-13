import { useState } from "react";
import { Play, Pause, Edit, FileText, MessageSquare, Workflow, Clock, Check, ExternalLink, Trash2, Power } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { StatusBadge } from "./StatusBadge.jsx";
import { Tag } from "./Tag.jsx";
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

export function AutomationCard({
  id,
  name,
  description,
  status,
  type,
  lastRun,
  tags = [],
  runCount,
  n8nWorkflowId,
  webhookUrl,
  showActions = true,
  onStatusToggle,
  onDelete,
  onRunComplete,
}) {
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [ranSuccess, setRanSuccess] = useState(false);
  const [runMessage, setRunMessage] = useState(null);
  const [localStatus, setLocalStatus] = useState(status);
  const [localRunCount, setLocalRunCount] = useState(runCount || 0);
  const [localLastRun, setLocalLastRun] = useState(lastRun);

  const TypeIcon = typeIcons[type] || Workflow;
  const isEnabled = localStatus === 'enabled' || localStatus === 'Active';

  const handleRun = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setRunning(true);
    setRunMessage(null);
    try {
      const res = await api.runAutomation(id);
      if (res && res.success) {
        setRanSuccess(true);
        setRunMessage(res.message || `Started (${res.duration})`);
        setLocalRunCount(prev => prev + 1);
        setLocalLastRun({ time: "Just now", status: "success" });
        setLocalStatus('enabled');
        onRunComplete?.();
        setTimeout(() => {
          setRanSuccess(false);
          setRunMessage(null);
        }, 3000);
      } else {
        alert(res?.message || "Execution failed in n8n. Please check if webhook is configured.");
      }
    } catch (err) {
      alert("Failed to run automation: " + err.message);
    } finally {
      setRunning(false);
    }
  };

  const handleToggle = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setToggling(true);
    try {
      const updated = await api.toggleAutomationStatus(id);
      const newStatus = updated.status || (isEnabled ? 'disabled' : 'enabled');
      setLocalStatus(newStatus);
      onStatusToggle?.(id, newStatus);
    } catch (err) {
      alert("Failed to toggle status: " + err.message);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setDeleting(true);
    try {
      await api.deleteAutomation(id);
      onDelete?.(id);
    } catch (err) {
      alert("Failed to delete automation: " + err.message);
      setDeleting(false);
    }
  };

  return (
    <div
      className="glass-card p-5 transition-all duration-200 flex flex-col justify-between"
      style={{ opacity: deleting ? 0.4 : 1 }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
    >
      <div>
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${typeColors[type] || '#8B5CF6'}14` }}
          >
            <TypeIcon size={18} style={{ color: typeColors[type] || '#8B5CF6' }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1 gap-2">
              <Link to={`/automations/${id}`} style={{ textDecoration: 'none' }} className="truncate">
                <h3
                  style={{ fontSize: 15, fontWeight: 600, color: '#F9FAFB' }}
                  className="truncate"
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#3B82F6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#F9FAFB'; }}
                >
                  {name}
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <StatusBadge status={localStatus} />
                <button
                  onClick={handleToggle}
                  disabled={toggling}
                  title={isEnabled ? "Pause (Deactivate on n8n)" : "Activate on n8n"}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  style={{
                    color: isEnabled ? '#22C55E' : '#9CA3AF',
                    border: 'none',
                    background: 'none',
                    cursor: toggling ? 'wait' : 'pointer',
                  }}
                >
                  <Power size={13} className={toggling ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 10, lineHeight: 1.5 }} className="line-clamp-2">
              {description}
            </p>

            <div className="flex items-center gap-2 flex-wrap mb-3">
              {tags.map((tag, index) => (
                <Tag key={index} label={tag.label} variant={tag.variant} />
              ))}
              {n8nWorkflowId && (
                <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>
                  ID: {n8nWorkflowId}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Inline Execution Toast */}
        {runMessage && (
          <div
            className="mb-3 px-2.5 py-1.5 rounded text-xs flex items-center justify-between"
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#22C55E',
            }}
          >
            <span>{runMessage}</span>
            <Check size={12} />
          </div>
        )}

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center gap-3">
            {localLastRun && (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: localLastRun.status === 'success' ? '#22C55E' : '#EF4444' }}
                />
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                  {localLastRun.time}
                </span>
              </div>
            )}
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              {Number(localRunCount).toLocaleString()} runs
            </span>
          </div>

          {showActions && (
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {/* Run Trigger */}
              <button
                onClick={handleRun}
                disabled={running}
                className="glass-button glass-button-sm flex items-center gap-1"
                title="Trigger execution via n8n webhook"
                style={{
                  border: '1px solid #fff',
                  backgroundColor: ranSuccess ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 255, 255, 0.15)',
                  color: ranSuccess ? '#22C55E' : '#fff',
                  padding: '5px 10px',
                  cursor: running ? 'wait' : 'pointer',
                }}
              >
                {ranSuccess ? <Check size={13} /> : <Play size={13} className={running ? "animate-spin" : ""} />}
                {running ? "Running" : (ranSuccess ? "Done" : "Run")}
              </button>

              {/* Pause / Activate */}
              <button
                onClick={handleToggle}
                disabled={toggling}
                className="glass-button glass-button-sm flex items-center gap-1"
                title={isEnabled ? "Pause workflow in n8n" : "Activate workflow in n8n"}
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '5px 9px',
                  cursor: toggling ? 'wait' : 'pointer',
                  color: isEnabled ? '#F59E0B' : '#22C55E',
                }}
              >
                {isEnabled ? <Pause size={12} /> : <Play size={12} />}
                {isEnabled ? "Pause" : "Activate"}
              </button>

              {/* Edit */}
              <button
                onClick={() => navigate(`/automations/${id}?tab=settings`)}
                className="glass-button glass-button-sm"
                title="Edit automation settings"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '5px 9px',
                }}
              >
                <Edit size={12} />
              </button>

              {/* Open in n8n Canvas */}
              {n8nWorkflowId && (
                <a
                  href={`https://rafproj1.sitesv2.alburujits.com/workflow/${n8nWorkflowId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-button glass-button-sm flex items-center gap-1"
                  title="Open live workflow in n8n canvas"
                  style={{
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    color: '#A78BFA',
                    padding: '5px 8px',
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={12} />
                </a>
              )}

              {/* Logs */}
              <button
                onClick={() => navigate(`/automations/${id}`)}
                className="glass-button glass-button-sm"
                title="View execution logs"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '5px 9px',
                }}
              >
                <FileText size={12} />
              </button>

              {/* Delete */}
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="glass-button glass-button-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                title="Delete automation"
                style={{
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  padding: '5px 8px',
                  cursor: deleting ? 'wait' : 'pointer',
                }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
