import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  const linksByRole = {
    ADMIN: [
      { to: '/admin', label: 'Dashboard' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/stores', label: 'Stores' },
    ],
    NORMAL: [
      { to: '/stores', label: 'Stores' },
      { to: '/update-password', label: 'Update Password' },
    ],
    STORE_OWNER: [
      { to: '/store-owner', label: 'Dashboard' },
      { to: '/update-password', label: 'Update Password' },
    ],
  };

  return (
    <nav className="navbar">
      <strong>Store Ratings</strong>
      <div className="links">
        {(linksByRole[user.role] || []).map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) => `navlink${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
        <span style={{ color: '#64748b', fontSize: 13 }}>
          {user.name} ({user.role})
        </span>
        <button className="btn secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
