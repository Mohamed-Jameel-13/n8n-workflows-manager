import React, { useState } from "react";
import { Plus, Search, X, LayoutGrid, List, Bell } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { AutomationCard } from "../components/AutomationCard";
import { automations } from "../data/mockdata";
import "../styles/dashboard.css";

export default function Automations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const filterTags = [
    { id: 'all', label: 'All' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'n8n', label: 'n8n' },
    { id: 'cron', label: 'Cron Jobs' },
  ];

  const filteredAutomations = automations.filter((automation) => {
    const matchesSearch =
      automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      automation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || automation.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-container">
        {/* Header */}
        <div className="header">
          <h3>Automations</h3>
          <div className="searchbar">
            <Search id="search-icon" />
            <input
              placeholder="Search..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <X
                size={16}
                onClick={() => setSearchTerm("")}
                style={{ position: 'absolute', right: '15px', cursor: 'pointer', color: '#9CA3AF' }}
              />
            )}
          </div>
          <Bell id="bell" />
        </div>

        {/* Main Content Area */}
        <div className="analytics" style={{ padding: '80px 30px 30px' }}>
          
          {/* Sub Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#F9FAFB', margin: '0 0 4px', fontFamily: '"JetBrains Mono", monospace' }}>
                Automations
              </h1>
              <p style={{ fontSize: '14px', color: '#9CA3AF', margin: 0 }}>
                {automations.length} automations · {automations.filter(a => a.status === 'enabled').length} enabled
              </p>
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
              <Plus size={16} />
              Create Automation
            </button>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            
            {/* Search Input on Filter Bar */}
            <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '380px' }}>
              <Search
                size={15}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }}
              />
              <input
                type="text"
                placeholder="Search automations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: '"JetBrains Mono", monospace'
                }}
              />
              {searchTerm && (
                <X
                  size={14}
                  onClick={() => setSearchTerm("")}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6B7280' }}
                />
              )}
            </div>

            {/* Filter Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {filterTags.map((tag) => {
                const active = activeFilter === tag.id;
                return (
                  <button
                    key={tag.id}
                    onClick={() => setActiveFilter(tag.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: active ? 'rgba(163, 230, 53, 0.15)' : 'transparent',
                      color: active ? '#a3e635' : '#9CA3AF',
                      border: `1px solid ${active ? 'rgba(163, 230, 53, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                      fontSize: '13px',
                      fontWeight: active ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: '"JetBrains Mono", monospace'
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
                    {tag.label}
                  </button>
                );
              })}
            </div>

            {/* View Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '4px',
                borderRadius: '8px',
                marginLeft: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}
            >
              {[
                { mode: 'grid', Icon: LayoutGrid },
                { mode: 'list', Icon: List },
              ].map(({ mode, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: '6px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: viewMode === mode ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: viewMode === mode ? '#fff' : '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          {filteredAutomations.length > 0 ? (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(450px, 1fr))' : '1fr',
                gap: '16px'
              }}
            >
              {filteredAutomations.map((automation) => (
                <AutomationCard key={automation.id} {...automation} />
              ))}
            </div>
          ) : (
            <div 
              style={{
                padding: '64px 20px',
                textAlign: 'center',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(0,0,0,0.4)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
              }}
            >
              <div style={{ fontSize: '15px', color: '#E5E7EB', marginBottom: '6px', fontWeight: 600 }}>No automations found</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Try adjusting your search or filter criteria.</div>
            </div>
          )}

          {/* Bottom Count */}
          {filteredAutomations.length > 0 && (
            <p style={{ marginTop: '16px', fontSize: '12px', color: '#6B7280', fontFamily: '"JetBrains Mono", monospace' }}>
              Showing {filteredAutomations.length} of {automations.length} automations
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
