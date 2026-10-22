import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(email.trim(), password);
      navigate(user.role === 'admin' ? '/admin/users' : '/notes');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '60px' }}>
      <div className="card">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={onSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={busy} style={{ width: '100%' }}>{busy ? 'Logging in...' : 'Login'}</button>
        </form>
        <p style={{ marginTop: '15px', fontSize: '14px', textAlign: 'center' }}>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}