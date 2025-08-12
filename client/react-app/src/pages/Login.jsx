import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Add CSS import

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }), // changed here
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      alert('Login successful');
      //navigate('/');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Sign in</h2>
        <form onSubmit={handleLogin}>
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="login-btn" onClick={()=>navigate('/home')}>Sign in</button>
        </form>
        <p className="register-text">
          New to us?  
        </p>
        <button
          type="button"
          className="register-btn"
          onClick={() => navigate('/register')}
        >
          Create your account
        </button>
      </div>
    </div>
  );
}

export default Login;