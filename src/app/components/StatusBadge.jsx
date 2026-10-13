const statusConfig = {
  enabled: { bg: 'rgba(34,197,94,0.12)', text: '#22C55E', dot: '#22C55E', label: 'Enabled' },
  disabled: { bg: 'rgba(107,114,128,0.12)', text: '#9CA3AF', dot: '#9CA3AF', label: 'Disabled' },
  success: { bg: 'rgba(34,197,94,0.12)', text: '#22C55E', dot: '#22C55E', label: 'Success' },
  failed: { bg: 'rgba(239,68,68,0.12)', text: '#EF4444', dot: '#EF4444', label: 'Failed' },
  running: { bg: 'rgba(59,130,246,0.12)', text: '#3B82F6', dot: '#3B82F6', label: 'Running' },
  pending: { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B', dot: '#F59E0B', label: 'Pending' },
  active: { bg: 'rgba(34,197,94,0.12)', text: '#22C55E', dot: '#22C55E', label: 'Active' },
  paused: { bg: 'rgba(107,114,128,0.12)', text: '#9CA3AF', dot: '#9CA3AF', label: 'Paused' },
};

export function StatusBadge({ status, size = 'md' }) {
  const norm = (status || 'disabled').toLowerCase();
  const config = statusConfig[norm] || statusConfig.disabled;
  const isSmall = size === 'sm';

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        fontSize: isSmall ? 11 : 12,
        fontWeight: 500,
        padding: isSmall ? '2px 8px' : '3px 10px',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: isSmall ? 5 : 6,
          height: isSmall ? 5 : 6,
          borderRadius: '50%',
          backgroundColor: config.dot,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  );
}
