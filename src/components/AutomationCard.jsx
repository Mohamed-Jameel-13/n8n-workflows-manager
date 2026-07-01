import React, { useState } from "react";
import { Play, Edit, FileText, MessageSquare, Workflow, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import { Tag } from "./Tag";

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
  tags,
  runCount,
  showActions = true,
}) {
  const TypeIcon = typeIcons[type] || Workflow;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        transition: 'all 0.2s ease',
        borderColor: hovered ? 'rgba(163, 230, 53, 0.4)' : 'rgba(255, 255, 255, 0.15)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '8px',
        background: 'rgba(0, 0, 0, 0.4)',
        boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            backgroundColor: `${typeColors[type] || '#8B5CF6'}14`
          }}
        >
          <TypeIcon size={18} style={{ color: typeColors[type] || '#8B5CF6' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px' }}>
            <Link to={`/automations/${id}`} style={{ textDecoration: 'none' }}>
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#F9FAFB',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#a3e635'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#F9FAFB'; }}
              >
                {name}
              </h3>
            </Link>
            <StatusBadge status={status} />
          </div>

          <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '10px', lineHeight: 1.5 }}>
            {description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {tags.map((tag, index) => (
              <Tag key={index} label={tag.label} variant={tag.variant} />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {lastRun && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: lastRun.status === 'success' ? '#22C55E' : '#EF4444'
                    }}
                  />
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    {lastRun.time}
                  </span>
                </div>
              )}
              {runCount !== undefined && (
                <span style={{ fontSize: '12px', color: '#6B7280' }}>
                  {runCount.toLocaleString()} runs
                </span>
              )}
            </div>

            {showActions && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {[
                  { icon: Play, label: 'Run', primary: true },
                  { icon: Edit, label: 'Edit', primary: false },
                  { icon: FileText, label: 'Logs', primary: false },
                ].map(({ icon: Icon, label, primary }) => (
                  <button
                    key={label}
                    style={{
                      border: primary ? '1px solid #fff' : '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: primary ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      padding: '6px 12px',
                      color: '#fff',
                      fontSize: '13px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      fontFamily: '"JetBrains Mono", monospace'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = primary ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = primary ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
