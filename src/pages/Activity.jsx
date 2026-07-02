import React from "react";
import { Activity as ActivityIcon, Download, Bell, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { StatusBadge } from "../components/StatusBadge";
import "../styles/dashboard.css";

export default function Activity() {
  const activities = [
    { id: 1, name: "WhatsApp Customer Support", time: "10:23 AM", status: "success", trigger: "Webhook", duration: "1.2s" },
    { id: 2, name: "Lead Qualification Workflow", time: "11:45 AM", status: "success", trigger: "Typeform", duration: "2.4s" },
    { id: 3, name: "Database Backup Scheduler", time: "02:00 AM", status: "success", trigger: "Cron", duration: "45.1s" },
    { id: 4, name: "Slack Notification Bot", time: "Yesterday", status: "failed", trigger: "API", duration: "0.8s" },
    { id: 5, name: "Order Confirmation WhatsApp", time: "Yesterday", status: "success", trigger: "Shopify", duration: "1.5s" },
  ];

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-container">
        <div className="header">
          <h3>Activity Log</h3>
          <div className="searchbar">
            <Search id="search-icon" />
            <input placeholder="Search..." type="text" />
          </div>
          <Bell id="bell" />
        </div>

        <div className="analytics" style={{ padding: '80px 30px 30px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 4px', fontFamily: '"JetBrains Mono", monospace' }}>
                Activity Log
              </h1>
              <p style={{ color: '#9CA3AF', margin: 0 }}>Detailed execution history across all automations.</p>
            </div>
            <button 
              className="btn-secondary" 
              style={{ 
                padding: '10px 20px', 
                fontSize: '14px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px',
                borderRadius: '6px'
              }}
            >
              <Download size={18} /> Export CSV
            </button>
          </div>

          <div 
            className="glass-card" 
            style={{ 
              overflow: 'hidden',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8)'
            }}
          >
            <div 
              style={{ 
                padding: '16px 24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                borderBottom: '1px solid rgba(255,255,255,0.1)' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#9CA3AF', fontWeight: 500 }}>
                <ActivityIcon size={16} /> Recent Executions
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF', fontSize: '13px' }}>
                    <th style={{ padding: '16px 24px', fontWeight: 500 }}>Name</th>
                    <th style={{ padding: '16px 24px', fontWeight: 500 }}>Trigger</th>
                    <th style={{ padding: '16px 24px', fontWeight: 500 }}>Duration</th>
                    <th style={{ padding: '16px 24px', fontWeight: 500 }}>Time</th>
                    <th style={{ padding: '16px 24px', fontWeight: 500 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((item) => (
                    <tr 
                      key={item.id} 
                      style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.05)', 
                        transition: 'background-color 0.2s ease',
                      }} 
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 500 }}>{item.name}</td>
                      <td style={{ padding: '16px 24px', color: '#9CA3AF' }}>{item.trigger}</td>
                      <td style={{ padding: '16px 24px', color: '#9CA3AF' }}>{item.duration}</td>
                      <td style={{ padding: '16px 24px', color: '#9CA3AF' }}>{item.time}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
