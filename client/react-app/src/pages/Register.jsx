import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reuse styles

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();

  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name, email, password }), // changed here
  });

  const data = await res.json();

  if (res.ok) {
    alert('Registered successfully');
    navigate('/login'); // Go to sign-in page
  } else {
    alert(data.message || 'Registration failed');
  }
};

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Create account</h2>
        <form onSubmit={handleRegister}>
          <input
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Create your account</button>
        </form>
        <p className="register-text">Already have an account?</p>
        <button
          type="button"
          className="register-btn"
          onClick={() => navigate('/login')}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

export default Register;