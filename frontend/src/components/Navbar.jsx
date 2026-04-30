import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/login');
  };

  return (
    <nav style={{ background: '#1f2937', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
          TaskManager
        </Link>
        <Link to="/" style={{ color: '#d1d5db', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/projects" style={{ color: '#d1d5db', textDecoration: 'none' }}>Projects</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#9ca3af' }}>Hello, {user?.name}</span>
        <button
          onClick={handleLogout}
          style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;