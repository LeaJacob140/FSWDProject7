import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1 className="logo">MyStore</h1>

      {/* Hamburger icon for mobile */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
        <Link to="/home">Home</Link>
        <Link to="/cart">Cart</Link>
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
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
