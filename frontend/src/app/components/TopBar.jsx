import { Search, Bell } from "lucide-react";
import { useLocation } from "react-router";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/automations": "Automations",
  "/workflows": "Workflows",
  "/activity": "Activity",
  "/settings": "Settings",
};

function getBreadcrumbs(pathname) {
  if (pathname.startsWith('/automations/')) return ['Automations', 'Detail'];
  const title = pageTitles[pathname];
  return title ? [title] : ['Dashboard'];
}

export function TopBar() {
  const location = useLocation();
  const crumbs = getBreadcrumbs(location.pathname);

  return (
    <header
      className="h-14 flex items-center justify-between px-6"
      style={{ 
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 1px 20px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        {crumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-2">
            {i > 0 && <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>}
            <span
              style={{
                fontSize: 14,
                color: i === crumbs.length - 1 ? '#fff' : '#9CA3AF',
                fontWeight: i === crumbs.length - 1 ? 500 : 400,
              }}
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#9CA3AF' }}
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 rounded-lg outline-none transition-all duration-200"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: 13,
              width: 220,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#fff';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.width = '280px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.width = '220px';
            }}
          />
          <kbd
            className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded"
            style={{ fontSize: 10, color: '#9CA3AF', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', lineHeight: '14px' }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
          style={{ border: '1px solid rgba(255, 255, 255, 0.2)', backgroundColor: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Bell size={16} style={{ color: '#9CA3AF' }} />
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#EF4444' }}
          />
        </button>
      </div>
    </header>
  );
}
