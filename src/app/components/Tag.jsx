const variantStyles = {
  default: {
    bg: 'rgba(156, 163, 175, 0.15)',
    text: '#9CA3AF',
  },
  blue: {
    bg: 'rgba(59, 130, 246, 0.15)',
    text: '#3B82F6',
  },
  green: {
    bg: 'rgba(34, 197, 94, 0.15)',
    text: '#22C55E',
  },
  purple: {
    bg: 'rgba(168, 85, 247, 0.15)',
    text: '#A855F7',
  },
};

export function Tag({ label, variant = 'default' }) {
  const style = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className="inline-flex items-center rounded-full"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        fontSize: 11,
        fontWeight: 500,
        padding: '2px 8px',
        letterSpacing: '0.01em',
      }}
    >
      {label}
    </span>
  );
}
