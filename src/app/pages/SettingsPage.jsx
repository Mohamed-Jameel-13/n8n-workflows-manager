import { useState, useEffect } from "react";
import { Copy, Eye, EyeOff, Check, Plus, RefreshCw, Radio, Server, Key, ShieldCheck, AlertCircle } from "lucide-react";
import { api } from "../services/api.js";

export function SettingsPage() {
  const [profile, setProfile] = useState({ fullName: "John Doe", email: "john@acme.com", avatarUrl: null });
  const [workspace, setWorkspace] = useState({
    name: "Acme Corp",
    slug: "acme",
    plan: "PRO",
    n8nBaseUrl: "http://localhost:5678",
    n8nApiKey: "",
    n8nWebhookBaseUrl: "http://localhost:5678/webhook",
  });
  const [apiKeys, setApiKeys] = useState([]);
  const [showKeys, setShowKeys] = useState({});
  const [copied, setCopied] = useState(null);
  const [showN8nKey, setShowN8nKey] = useState(false);

  // Status feedback
  const [profileSaved, setProfileSaved] = useState(false);
  const [workspaceSaved, setWorkspaceSaved] = useState(false);
  const [n8nSaved, setN8nSaved] = useState(false);
  const [testingN8n, setTestingN8n] = useState(false);
  const [n8nStatus, setN8nStatus] = useState(null);

  // Generate Key Modal / State
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [latestGeneratedKey, setLatestGeneratedKey] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data.profile) setProfile(data.profile);
      if (data.workspace) setWorkspace(data.workspace);
      if (data.apiKeys) setApiKeys(data.apiKeys);
    } catch (e) {
      console.warn("Failed to load settings:", e);
    }
  };

  const toggleKey = (index) => {
    setShowKeys((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleSaveProfile = async () => {
    try {
      await api.updateProfile(profile);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (e) {
      alert("Failed to save profile: " + e.message);
    }
  };

  const handleSaveWorkspace = async () => {
    try {
      await api.updateWorkspace(workspace);
      setWorkspaceSaved(true);
      setTimeout(() => setWorkspaceSaved(false), 2000);
    } catch (e) {
      alert("Failed to save workspace: " + e.message);
    }
  };

  const handleSaveN8n = async () => {
    try {
      await api.updateWorkspace(workspace);
      setN8nSaved(true);
      setTimeout(() => setN8nSaved(false), 2000);
    } catch (e) {
      alert("Failed to save n8n configuration: " + e.message);
    }
  };

  const [syncingN8n, setSyncingN8n] = useState(false);

  const handleSyncN8n = async () => {
    setSyncingN8n(true);
    try {
      await api.updateWorkspace(workspace);
      const res = await api.syncN8nWorkflows();
      alert(res.message || "Workflows synchronized successfully!");
    } catch (err) {
      alert("Sync failed: " + err.message + "\n\nTip: Test connection first to verify your n8n Base URL and API Key.");
    } finally {
      setSyncingN8n(false);
    }
  };

  const handleTestN8n = async () => {
    setTestingN8n(true);
    setN8nStatus(null);
    try {
      const result = await api.testN8nConnection(workspace.n8nBaseUrl, workspace.n8nApiKey);
      setN8nStatus(result);
    } catch (e) {
      setN8nStatus({
        connected: false,
        status: "ERROR",
        message: e.message || "Failed to reach n8n instance",
      });
    } finally {
      setTestingN8n(false);
    }
  };

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    try {
      const created = await api.generateApiKey(newKeyName.trim());
      setApiKeys((prev) => [created, ...prev]);
      setLatestGeneratedKey(created);
      setNewKeyName("");
      setIsGeneratingKey(false);
    } catch (err) {
      alert("Failed to generate key: " + err.message);
    }
  };

  const handleRevokeKey = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this API key? Applications using it will lose access.")) return;
    try {
      await api.revokeApiKey(id);
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      if (latestGeneratedKey?.id === id) setLatestGeneratedKey(null);
    } catch (e) {
      alert("Failed to revoke key: " + e.message);
    }
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="mb-8">
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#F9FAFB', marginBottom: 4 }}>Settings</h2>
        <p style={{ fontSize: 14, color: '#9CA3AF' }}>
          Configure your n8n workflow credentials, workspace settings, and developer API keys.
        </p>
      </div>

      {/* 1. n8n Instance & API Key Configuration */}
      <section className="glass-card p-6 mb-6" style={{ border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}>
              <Server size={20} color="#8B5CF6" />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F9FAFB' }}>n8n Workflow Engine & API Key</h3>
              <p style={{ fontSize: 12, color: '#9CA3AF' }}>Connect your n8n instance to trigger webhooks and sync workflows</p>
            </div>
          </div>
          <button
            onClick={handleTestN8n}
            disabled={testingN8n}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
            style={{
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              color: '#C4B5FD',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              cursor: testingN8n ? 'wait' : 'pointer',
            }}
          >
            <RefreshCw size={14} className={testingN8n ? "animate-spin" : ""} />
            {testingN8n ? "Testing..." : "Test Connection"}
          </button>
        </div>

        {/* Connection status banner */}
        {n8nStatus && (
          <div
            className="p-3 mb-5 rounded-lg flex items-center gap-3"
            style={{
              backgroundColor: n8nStatus.connected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              border: `1px solid ${n8nStatus.connected ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
            }}
          >
            {n8nStatus.connected ? <ShieldCheck size={18} color="#22C55E" /> : <AlertCircle size={18} color="#3B82F6" />}
            <div className="flex-1 text-xs">
              <span style={{ fontWeight: 600, color: n8nStatus.connected ? '#22C55E' : '#93C5FD' }}>
                {n8nStatus.connected ? "Connected to live n8n instance" : "Simulation Mode Active"}:
              </span>{" "}
              <span style={{ color: '#E5E7EB' }}>{n8nStatus.message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
              n8n Base URL
            </label>
            <input
              type="text"
              value={workspace.n8nBaseUrl || ""}
              onChange={(e) => setWorkspace({ ...workspace, n8nBaseUrl: e.target.value })}
              placeholder="http://localhost:5678"
              className="w-full px-3 py-2 rounded-lg glass-input text-sm"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
              n8n API Key
            </label>
            <div className="relative">
              <input
                type={showN8nKey ? "text" : "password"}
                value={workspace.n8nApiKey || ""}
                onChange={(e) => setWorkspace({ ...workspace, n8nApiKey: e.target.value })}
                placeholder="Enter n8n API Key (e.g. n8n_api_...)"
                className="w-full pl-3 pr-10 py-2 rounded-lg glass-input text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowN8nKey(!showN8nKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showN8nKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
            n8n Webhook Base URL
          </label>
          <input
            type="text"
            value={workspace.n8nWebhookBaseUrl || ""}
            onChange={(e) => setWorkspace({ ...workspace, n8nWebhookBaseUrl: e.target.value })}
            placeholder="http://localhost:5678/webhook"
            className="w-full px-3 py-2 rounded-lg glass-input text-sm"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSyncN8n}
            disabled={syncingN8n}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: syncingN8n ? 'wait' : 'pointer',
            }}
          >
            <RefreshCw size={14} className={syncingN8n ? "animate-spin" : ""} />
            {syncingN8n ? "Syncing..." : "Sync Workflows"}
          </button>
          <button
            onClick={handleSaveN8n}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
            style={{
              backgroundColor: n8nSaved ? 'rgba(34,197,94,0.15)' : '#8B5CF6',
              color: n8nSaved ? '#22C55E' : '#fff',
              border: n8nSaved ? '1px solid rgba(34,197,94,0.3)' : 'none',
              cursor: 'pointer',
            }}
          >
            {n8nSaved ? <><Check size={15} /> Saved n8n Config</> : "Save n8n Credentials"}
          </button>
        </div>
      </section>

      {/* 2. AutoFlow API Keys */}
      <section className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(163, 230, 53, 0.15)' }}>
              <Key size={20} color="#a3e635" />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#F9FAFB' }}>AutoFlow API Keys</h3>
              <p style={{ fontSize: 12, color: '#9CA3AF' }}>Developer API keys for programmatic webhook and REST access</p>
            </div>
          </div>
          <button
            onClick={() => setIsGeneratingKey(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{ backgroundColor: '#a3e635', color: '#000', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#84cc16'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#a3e635'; }}
          >
            <Plus size={15} />
            Generate new key
          </button>
        </div>

        {/* Generate Key Input Form */}
        {isGeneratingKey && (
          <form onSubmit={handleGenerateKey} className="p-4 mb-4 rounded-lg glass-card" style={{ border: '1px solid rgba(163, 230, 53, 0.3)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Create New API Key</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Key name (e.g. Production Zapier, Retool Sync)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                autoFocus
                className="flex-1 px-3 py-2 rounded-lg glass-input text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#a3e635', color: '#000', cursor: 'pointer' }}
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsGeneratingKey(false)}
                className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white"
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Latest generated key notification */}
        {latestGeneratedKey && (
          <div className="p-4 mb-4 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 13, fontWeight: 600, color: '#22C55E' }}>New Key Created: {latestGeneratedKey.name}</span>
              <button
                onClick={() => setLatestGeneratedKey(null)}
                style={{ fontSize: 11, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Dismiss
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={latestGeneratedKey.key}
                className="flex-1 px-3 py-1.5 rounded font-mono text-xs bg-black/50 border border-green-500/30 text-green-400"
              />
              <button
                onClick={() => handleCopy(latestGeneratedKey.key, 'latest')}
                className="px-3 py-1.5 rounded text-xs bg-green-500 text-black font-semibold flex items-center gap-1"
              >
                {copied === 'latest' ? <Check size={13} /> : <Copy size={13} />}
                {copied === 'latest' ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {apiKeys.map((key, index) => (
            <div
              key={key.id || index}
              className="rounded-lg p-4"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#F9FAFB', marginBottom: 2 }}>{key.name}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>
                    Created {key.created} · Last used {key.lastUsed}
                  </div>
                </div>
                <button
                  onClick={() => handleRevokeKey(key.id)}
                  className="px-2.5 py-1 rounded transition-all duration-200 text-xs font-medium"
                  style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', backgroundColor: 'transparent', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  Revoke
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 px-3 py-2 rounded-lg font-mono text-xs"
                  style={{ backgroundColor: '#0B1120', border: '1px solid #1F2933', color: '#9CA3AF' }}
                >
                  {showKeys[index] ? key.key : (key.key ? key.key.replace(/[^.]/g, '•').replace(/\.\.\.$/, '...') : '••••••••••••••••')}
                </div>
                <button
                  onClick={() => toggleKey(index)}
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{ border: '1px solid #1F2933', color: '#9CA3AF', backgroundColor: 'transparent', cursor: 'pointer' }}
                >
                  {showKeys[index] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  onClick={() => handleCopy(key.key, index)}
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{ border: '1px solid #1F2933', color: copied === index ? '#22C55E' : '#9CA3AF', backgroundColor: 'transparent', cursor: 'pointer' }}
                >
                  {copied === index ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. User Profile */}
      <section className="glass-card p-6 mb-6">
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#F9FAFB', marginBottom: 20 }}>Profile</h3>
        <div className="flex items-center gap-5 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #a3e635, #65a30d)', fontSize: 22, fontWeight: 700, color: '#000' }}
          >
            {profile.fullName ? profile.fullName.split(" ").map(n => n[0]).join("") : "JD"}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#F9FAFB', marginBottom: 2 }}>{profile.fullName}</div>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>{profile.email}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>Full name</label>
            <input
              value={profile.fullName || ""}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg glass-input text-sm"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>Email address</label>
            <input
              value={profile.email || ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg glass-input text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveProfile}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
            style={{ backgroundColor: profileSaved ? 'rgba(34,197,94,0.15)' : '#a3e635', color: profileSaved ? '#22C55E' : '#000', cursor: 'pointer' }}
          >
            {profileSaved ? <><Check size={15} /> Saved</> : 'Save changes'}
          </button>
        </div>
      </section>

      {/* 4. Workspace */}
      <section className="glass-card p-6 mb-6">
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#F9FAFB', marginBottom: 20 }}>Workspace</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>Workspace name</label>
            <input
              value={workspace.name || ""}
              onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg glass-input text-sm"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>Workspace slug</label>
            <div className="flex items-center rounded-lg overflow-hidden glass-input text-sm">
              <span className="px-3 py-2" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#9CA3AF', borderRight: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap' }}>
                app.autoflow.so/
              </span>
              <input
                value={workspace.slug || ""}
                onChange={(e) => setWorkspace({ ...workspace, slug: e.target.value })}
                className="flex-1 px-3 py-2 outline-none bg-transparent text-white border-none"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>Plan</label>
          <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(163,230,53,0.15)', color: '#a3e635', fontSize: 11, fontWeight: 600 }}
              >
                PRO
              </span>
              <span style={{ fontSize: 14, color: '#E5E7EB' }}>Pro plan · $29/month</span>
            </div>
            <button style={{ fontSize: 13, color: '#a3e635', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
              Manage billing →
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveWorkspace}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
            style={{ backgroundColor: workspaceSaved ? 'rgba(34,197,94,0.15)' : '#a3e635', color: workspaceSaved ? '#22C55E' : '#000', cursor: 'pointer' }}
          >
            {workspaceSaved ? <><Check size={15} /> Saved</> : 'Save changes'}
          </button>
        </div>
      </section>
    </div>
  );
}
