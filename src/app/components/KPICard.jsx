export function KPICard({ icon: Icon, label, value, trend, accent = '#3B82F6' }) {
  return (
    <div
      className="glass-card p-5 transition-all duration-200"
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}40`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accent}14` }}
        >
          <Icon size={18} style={{ color: accent }} />
        </div>
        {trend && (
          <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 500 }}>{trend}</span>
        )}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#F9FAFB', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>{label}</div>
    </div>
  );
}
