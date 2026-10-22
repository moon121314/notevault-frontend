import { useState, useEffect } from 'react';
import api from '../api/client';
import { Pagination } from '../components/Pagination';

const emptyForm = { name: '', email: '', password: '', role: 'user', interests: '' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async (pageNumber) => {
    setLoading(true); setError('');
    try {
      const response = await api.get(`/admin/users?page=${pageNumber}&limit=5`);
      setUsers(response.data.data);
      setPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.pages);
    } catch (err) { setError(err.response?.data?.message || 'Failed to load users.'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(page); }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    const interestsArray = form.interests.split(',').map((i) => i.trim()).filter(Boolean);
    const payload = { name: form.name.trim(), email: form.email.trim(), role: form.role, interests: interestsArray };
    if (form.password) payload.password = form.password;

    try {
      if (editingId) await api.put(`/admin/users/${editingId}`, payload);
      else { if (!payload.password) throw new Error('Password required'); await api.post('/admin/users', payload); }
      resetForm(); fetchUsers(page);
    } catch (err) { setError(err.response?.data?.message || err.message || 'Save failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete user?')) return;
    try { await api.delete(`/admin/users/${id}`); fetchUsers(page); } catch (err) { setError('Delete failed.'); }
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, interests: (u.interests || []).join(', ') });
  };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  return (
    <div className="container">
      <h1>Admin – Users</h1>
      {error && <div className="error">{error}</div>}
      <div className="card">
        <h3>{editingId ? 'Edit User' : 'Add New User'}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder={editingId ? "New Password (blank to keep)" : "Password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <input type="text" placeholder="Interests (comma separated)" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
          <div className="row">
            <button type="submit">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" className="secondary" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>
      {loading ? <p>Loading...</p> : (
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Interests</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{(u.interests || []).join(', ')}</td>
                <td>
                  <div className="row">
                    <button className="secondary" onClick={() => startEdit(u)}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(u.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}