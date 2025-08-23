import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const hideAuthLinks = ['/login', '/register'].includes(location.pathname);

  return (
    <nav className="navbar">
      <h1 className="logo">MyStore</h1>

      {/* Hamburger for mobile */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</div>

      <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
        <Link to="/home">Home</Link>
        <Link to="/cart">Cart</Link>

        {/* Show login/register only if user is not logged in and not on login/register page */}
        {!user && !hideAuthLinks && <Link to="/login">Login</Link>}
        {!user && !hideAuthLinks && <Link to="/register">Register</Link>}

        {/* Admin link */}
        {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}

        {/* Logout button */}
        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
