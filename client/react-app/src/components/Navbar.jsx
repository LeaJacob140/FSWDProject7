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

      {/* Hamburger for mobile */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</div>

     <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
        {user ? (
          // משתמש מחובר
          <>
            <Link to="/home">Home</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          // משתמש לא מחובר
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
