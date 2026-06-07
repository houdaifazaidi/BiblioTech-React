import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'rgba(17,24,39,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 2rem'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        height: 60,
        gap: '1rem'
      }}>
        <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)', marginRight: 'auto', textDecoration: 'none' }}>
          Biblio<span style={{ color: 'var(--text)' }}>Tech</span>
        </Link>
        
        <NavLink to="/books" style={({ isActive }) => ({
          color: isActive ? 'var(--accent)' : 'var(--muted)',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          padding: '0.4rem 0.75rem',
          borderRadius: 8,
          background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent'
        })}>
          Browse
        </NavLink>

        {user ? (
          <>
            <NavLink to="/loans" style={({ isActive }) => ({
              color: isActive ? 'var(--accent)' : 'var(--muted)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '0.4rem 0.75rem',
              borderRadius: 8,
              background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent'
            })}>
              My Loans
            </NavLink>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ marginLeft: '0.5rem' }}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
