import React from "react";
import { LayoutGrid, Zap, GitBranch, Activity, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { path: "/automations", label: "Automations", icon: Zap },
    { path: "/workflows", label: "Workflows", icon: GitBranch },
    { path: "/activity", label: "Activity", icon: Activity },
  ];

  return (
    <div className="sidebar-outer-wrap">
      <div className="sidebar">
        <div className="logo-wrapper">
          <Zap id="logo" size={24} color="#a3e635" fill="#a3e635" />
          <h2>AutoFlow</h2>
        </div>
        <hr id="horizo1" />

        <h3>NAVIGATION</h3>
        <ul style={{ padding: 0, margin: 0 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li
                key={item.path}
                style={{
                  backgroundColor: active ? 'rgba(163, 230, 53, 0.15)' : 'transparent',
                  border: active ? '1px solid rgba(163, 230, 53, 0.4)' : '1px solid transparent',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} style={{ color: active ? '#a3e635' : '#666b77' }} />
                <Link
                  id="sidebar-navs"
                  to={item.path}
                  style={{
                    color: active ? '#a3e635' : '#76787d',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    flex: 1
                  }}
                >
                  {item.label}
                </Link>
                {active && (
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#a3e635',
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
        
        <hr id="horizo" style={{ marginTop: 'auto', marginBottom: '10px' }} />
        
        {/* Settings Link */}
        {(() => {
          const active = isActive("/settings");
          return (
            <Link
              id="settings-logo"
              to="/settings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: active ? 'rgba(163, 230, 53, 0.15)' : 'transparent',
                border: active ? '1px solid rgba(163, 230, 53, 0.4)' : '1px solid transparent',
                color: active ? '#a3e635' : '#666b77',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
                fontFamily: '"JetBrains Mono", monospace',
                cursor: 'pointer',
                marginBottom: '10px',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
            >
              <Settings size={18} style={{ color: active ? '#a3e635' : '#666b77' }} />
              <span>Settings</span>
              {active && (
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#a3e635',
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
              )}
            </Link>
          );
        })()}

        {/* User Card */}
        <div className="settings">
          <p className="user-logo">JD</p>
          <div className="username">
            <p>John Doe</p>
            <p id="plan-name">Pro plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
