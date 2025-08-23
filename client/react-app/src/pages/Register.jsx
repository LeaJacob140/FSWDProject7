import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reuse styles

function Register({ setUser }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // prevent page reload
    const res = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }), // changed here
    });

    const data = await res.json();
    console.log(data);

    // Check if registration was successful

    if (res.ok) {
      localStorage.setItem('token', data.token); // Save token for future use
      alert('Registered successfully');
      setUser({ ...data.user, token: data.token });


      navigate('/home'); // Go to sign-in page
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
            value={username}
            onChange={e => setUsername(e.target.value)}
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