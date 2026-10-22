import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <nav><strong>NoteVault</strong></nav>;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav>
      <div className="row" style={{ width: '100%' }}>
        <strong style={{ marginRight: 20 }}>NoteVault</strong>
        <Link to="/notes">My Notes</Link>
        <Link to="/interests">Interests</Link>
        {user.role === 'admin' && (
          <>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/notes">All Notes</Link>
          </>
        )}
        <span className="spacer"></span>
        <span style={{ marginRight: 15, fontSize: 14 }}>{user.name} ({user.role})</span>
        <button className="danger" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}