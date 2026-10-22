import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '60px' }}>
      <div className="card">
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={onSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          <button type="submit" disabled={busy} style={{ width: '100%' }}>{busy ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p style={{ marginTop: '15px', fontSize: '14px', textAlign: 'center' }}>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}