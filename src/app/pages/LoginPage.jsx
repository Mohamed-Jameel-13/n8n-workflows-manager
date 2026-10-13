import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { api } from "../services/api.js";

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-bg landing-font" style={{ color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="landing-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Navbar */}
        <nav className="flex justify-between items-center p-6 w-full">
          <Link to="/" style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em', cursor: 'pointer', textDecoration: 'none', color: '#fff' }}>
            back
          </Link>
          <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.04em' }}>
            cmd+zest
          </div>
          <div style={{ width: '40px' }}></div>
        </nav>

        {/* Main Content Centered */}
        <div className="flex-1 flex items-center justify-center relative w-full h-full p-4">
          <div className="glass-card relative flex flex-col items-center justify-center p-12 w-full max-w-md">
            
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.04em' }}>welcome back</h1>
            <p style={{ color: '#9ca3af', marginBottom: '32px', fontSize: '18px', letterSpacing: '-0.02em' }}>
              enter your details to continue.
            </p>

            <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <input 
                  type="text" 
                  placeholder="username (admin)" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '18px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                  autoFocus
                />
              </div>
              <div>
                <input 
                  type="password" 
                  placeholder="password (123)" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '18px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                />
              </div>

              {error && (
                <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', marginTop: '-8px' }}>
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#000',
                  fontSize: '20px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: loading ? 'wait' : 'pointer',
                  marginTop: '8px',
                  transition: 'opacity 0.2s ease'
                }}
              >
                {loading ? "logging in..." : "login"}
              </button>
            </form>

            <div style={{ marginTop: '32px', color: '#9ca3af', fontSize: '16px' }}>
              don't have an account? <Link to="/signup" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>sign up</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
