import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { api } from "../services/api.js";

export function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.signup({ username, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account");
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
            
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.04em' }}>create account</h1>
            <p style={{ color: '#9ca3af', marginBottom: '32px', fontSize: '18px', letterSpacing: '-0.02em' }}>
              join us to start exploring.
            </p>

            <form onSubmit={handleSignup} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <input 
                  type="text" 
                  placeholder="username" 
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
                  required
                />
              </div>
              <div>
                <input 
                  type="password" 
                  placeholder="password" 
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
                  required
                />
              </div>
              <div>
                <input 
                  type="password" 
                  placeholder="confirm password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  required
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
                {loading ? "creating..." : "sign up"}
              </button>
            </form>

            <div style={{ marginTop: '32px', color: '#9ca3af', fontSize: '16px' }}>
              already have an account? <Link to="/login" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>login</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
