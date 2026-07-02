import React, { useState } from "react";
import { Copy, Eye, EyeOff, Check, Bell, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

const apiKeys = [
  { name: "Production API Key", key: "af_live_xk9m2pqr5nvj8tw...", created: "Jun 1, 2026", lastUsed: "2 hours ago" },
  { name: "Development API Key", key: "af_dev_3hbz7qye1dlv4sx...", created: "May 15, 2026", lastUsed: "Yesterday" },
];

export default function Settings() {
  const [showKeys, setShowKeys] = useState({});
  const [copied, setCopied] = useState(null);
  const [saved, setSaved] = useState(false);

  const toggleKey = (index) => {
    setShowKeys((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopy = (index) => {
    setCopied(index);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-container">
        <div className="header">
          <h3>Settings</h3>
          <div className="searchbar">
            <Search id="search-icon" />
            <input placeholder="Search..." type="text" />
          </div>
          <Bell id="bell" />
        </div>

        <div className="analytics" style={{ padding: '80px 30px 30px' }}>
          
          <div style={{ maxWidth: '720px' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#F9FAFB', margin: '0 0 4px', fontFamily: '"JetBrains Mono", monospace' }}>Settings</h2>
              <p style={{ fontSize: '14px', color: '#9CA3AF', margin: 0 }}>Manage your account, workspace, and API credentials.</p>
            </div>

            <section 
              className="glass-card" 
              style={{ 
                padding: '24px', 
                marginBottom: '20px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8)'
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#F9FAFB', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>Profile</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                <div
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #a3e635, #65a30d)', 
                    fontSize: '22px', 
                    fontWeight: 700, 
                    color: '#000' 
                  }}
                >
                  JD
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#F9FAFB', marginBottom: '2px' }}>John Doe</div>
                  <div style={{ fontSize: '13px', color: '#9CA3AF' }}>john@acme.com</div>
                </div>
                <button
                  style={{ 
                    marginLeft: 'auto', 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255, 255, 255, 0.2)', 
                    color: '#E5E7EB', 
                    fontSize: '13px', 
                    fontWeight: 500, 
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Change avatar
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9CA3AF', marginBottom: '6px' }}>Full name</label>
                  <input
                    defaultValue="John Doe"
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: '"JetBrains Mono", monospace'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9CA3AF', marginBottom: '6px' }}>Email address</label>
                  <input
                    defaultValue="john@acme.com"
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: '"JetBrains Mono", monospace'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSave}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '10px 20px', 
                    borderRadius: '8px', 
                    backgroundColor: saved ? 'rgba(34,197,94,0.15)' : '#a3e635', 
                    color: saved ? '#22C55E' : '#000', 
                    fontSize: '14px', 
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { if (!saved) e.currentTarget.style.backgroundColor = '#84cc16'; }}
                  onMouseLeave={(e) => { if (!saved) e.currentTarget.style.backgroundColor = '#a3e635'; }}
                >
                  {saved ? <><Check size={15} /> Saved</> : 'Save changes'}
                </button>
              </div>
            </section>

            <section 
              className="glass-card" 
              style={{ 
                padding: '24px', 
                marginBottom: '20px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8)'
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#F9FAFB', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>Workspace</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9CA3AF', marginBottom: '6px' }}>Workspace name</label>
                  <input
                    defaultValue="Acme Corp"
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: '"JetBrains Mono", monospace'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9CA3AF', marginBottom: '6px' }}>Workspace slug</label>
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <span style={{ padding: '10px 12px', backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '14px', color: '#9CA3AF', borderRight: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap' }}>
                      app.autoflow.so/
                    </span>
                    <input
                      defaultValue="acme"
                      style={{ 
                        flex: 1, 
                        padding: '10px 16px', 
                        outline: 'none',
                        backgroundColor: 'transparent', 
                        color: '#F9FAFB', 
                        fontSize: '14px', 
                        border: 'none',
                        fontFamily: '"JetBrains Mono", monospace'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9CA3AF', marginBottom: '6px' }}>Plan</label>
                <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{ backgroundColor: 'rgba(163,230,53,0.15)', color: '#a3e635', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px' }}
                    >
                      PRO
                    </span>
                    <span style={{ fontSize: '14px', color: '#E5E7EB' }}>Pro plan · $29/month</span>
                  </div>
                  <button style={{ fontSize: '13px', color: '#a3e635', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                    Manage billing →
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  style={{ 
                    padding: '10px 20px', 
                    borderRadius: '8px', 
                    backgroundColor: '#a3e635', 
                    color: '#000', 
                    fontSize: '14px', 
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#84cc16'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#a3e635'; }}
                >
                  Save changes
                </button>
              </div>
            </section>

            <section 
              className="glass-card" 
              style={{ 
                padding: '24px', 
                marginBottom: '20px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#F9FAFB', margin: 0 }}>API Keys</h3>
                <button
                  style={{ 
                    backgroundColor: '#a3e635', 
                    color: '#000', 
                    fontSize: '13px', 
                    fontWeight: 600,
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#84cc16'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#a3e635'; }}
                >
                  Generate new key
                </button>
              </div>
              <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '20px' }}>
                API keys give full access to the AutoFlow API. Keep them secret and never commit them to version control.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {apiKeys.map((key, index) => (
                  <div
                    key={index}
                    style={{ 
                      borderRadius: '8px', 
                      padding: '16px', 
                      backgroundColor: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.08)' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#F9FAFB', marginBottom: '2px' }}>{key.name}</div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>Created {key.created} · Last used {key.lastUsed}</div>
                      </div>
                      <button
                        style={{ 
                          border: '1px solid rgba(239,68,68,0.3)', 
                          color: '#EF4444', 
                          fontSize: '12px', 
                          fontWeight: 600, 
                          backgroundColor: 'transparent',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        Revoke
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{ 
                          flex: 1, 
                          padding: '8px 12px', 
                          borderRadius: '8px', 
                          fontFamily: 'monospace', 
                          backgroundColor: '#0B1120', 
                          border: '1px solid #1F2933', 
                          fontSize: '13px', 
                          color: '#9CA3AF' 
                        }}
                      >
                        {showKeys[index] ? key.key : key.key.replace(/[^.]/g, '•').replace(/\.\.\.$/, '...')}
                      </div>
                      <button
                        onClick={() => toggleKey(index)}
                        style={{ 
                          padding: '8px',
                          borderRadius: '8px', 
                          border: '1px solid #1F2933', 
                          color: '#9CA3AF', 
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {showKeys[index] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        onClick={() => handleCopy(index)}
                        style={{ 
                          padding: '8px',
                          borderRadius: '8px', 
                          border: '1px solid #1F2933', 
                          color: copied === index ? '#22C55E' : '#9CA3AF', 
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {copied === index ? <Check size={15} /> : <Copy size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section 
              className="glass-card" 
              style={{ 
                padding: '24px', 
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8)'
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#EF4444', marginBottom: '16px' }}>Danger Zone</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#F9FAFB', marginBottom: '2px' }}>Delete workspace</div>
                  <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Permanently delete your workspace and all its data. This cannot be undone.</div>
                </div>
                <button
                  style={{ 
                    border: '1px solid rgba(239, 68, 68, 0.4)', 
                    color: '#EF4444', 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    backgroundColor: 'transparent',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Delete workspace
                </button>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
