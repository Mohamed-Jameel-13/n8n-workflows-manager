import { Link, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Zap, Settings, Activity, GitBranch, LogOut } from "lucide-react";
import { api } from "../services/api.js";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/automations", label: "Automations", icon: Zap },
  { path: "/workflows", label: "Workflows", icon: GitBranch },
  { path: "/activity", label: "Activity", icon: Activity },
];

const bottomItems = [
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = api.getCurrentUser();

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    api.logout();
    navigate("/login");
  };

  const displayName = currentUser?.fullName || currentUser?.username || "Admin User";
  const displayRole = currentUser?.role || "ADMIN";
  const initials = displayName
    .split(" ")
    .map(p => p[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "AU";

  return (
    <aside
      className="w-60 flex flex-col"
      style={{ 
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '1px 0 20px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-5" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Link to="/" className="flex items-center gap-2.5" style={{ textDecoration: 'none' }}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #a3e635, #65a30d)' }}
          >
            <Zap size={15} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#F9FAFB', letterSpacing: '-0.01em' }}>
            AutoFlow
          </span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-4 px-3">
        <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0 8px 8px' }}>
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-all duration-150"
              style={{
                backgroundColor: active ? 'rgba(163,230,53,0.15)' : 'transparent',
                color: active ? '#a3e635' : '#9CA3AF',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: active ? 500 : 400,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#E5E7EB';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9CA3AF';
                }
              }}
            >
              <Icon size={17} />
              <span>{item.label}</span>
              {active && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: '#a3e635' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 pb-4 pt-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-all duration-150"
              style={{
                backgroundColor: active ? 'rgba(163,230,53,0.15)' : 'transparent',
                color: active ? '#a3e635' : '#9CA3AF',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: active ? 500 : 400,
              }}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* User Card */}
        <div className="flex items-center justify-between px-3 py-2.5 mt-2 rounded-lg" style={{ border: '1px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #a3e635, #65a30d)', fontSize: 11, fontWeight: 700, color: '#000' }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <div className="truncate" style={{ fontSize: 13, fontWeight: 500, color: '#F9FAFB', lineHeight: 1.2 }}>{displayName}</div>
              <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.2 }}>{displayRole}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="text-gray-400 hover:text-red-400 transition-colors p-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
