import React from "react";
import { Plus, GitBranch, ArrowRight, Bell, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

export default function Workflows() {
  const workflows = [
    { id: 1, name: "Lead Qualification to CRM", steps: 4, status: "Active" },
    { id: 2, name: "Weekly Report Generation", steps: 2, status: "Paused" },
    { id: 3, name: "Onboarding Sequence", steps: 6, status: "Active" },
  ];

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-container">
        {/* Header */}
        <div className="header">
          <h3>Workflows</h3>
          <div className="searchbar">
            <Search id="search-icon" />
            <input placeholder="Search..." type="text" />
          </div>
          <Bell id="bell" />
        </div>

        {/* Main Content Area */}
        <div className="analytics" style={{ padding: '80px 30px 30px' }}>
          
          {/* Sub Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 4px', fontFamily: '"JetBrains Mono", monospace' }}>
                Workflows
              </h1>
              <p style={{ color: '#9CA3AF', margin: 0 }}>Manage your multi-step automation sequences.</p>
            </div>
            <button 
              className="btn-primary" 
              style={{ 
                padding: '10px 20px', 
                fontSize: '14px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}
            >
              <Plus size={18} /> New Workflow
            </button>
          </div>

          {/* Grid Layout */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '24px' 
            }}
          >
            {workflows.map((wf) => (
              <div 
                key={wf.id} 
                className="glass-card" 
                style={{ 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between', 
                  minHeight: '200px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div 
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        backgroundColor: 'rgba(59, 130, 246, 0.15)' 
                      }}
                    >
                      <GitBranch size={20} color="#3B82F6" />
                    </div>
                    <div style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: 600,
                      backgroundColor: wf.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      color: wf.status === 'Active' ? '#22C55E' : '#9CA3AF',
                      border: wf.status === 'Active' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      {wf.status}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', margin: '0 0 8px' }}>{wf.name}</h3>
                  <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0 }}>{wf.steps} steps configured</p>
                </div>
                
                <div style={{ paddingTop: '16px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Last edited 2d ago</span>
                  <button 
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '6px 12px',
                      color: '#fff',
                      fontSize: '13px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontFamily: '"JetBrains Mono", monospace'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    Edit <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
