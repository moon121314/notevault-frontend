import { useState, useEffect } from 'react';
import api from '../api/client';
import { Pagination } from '../components/Pagination';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const fetchNotes = async (pageNumber) => {
    setLoading(true); setError('');
    try {
      const response = await api.get(`/notes?page=${pageNumber}&limit=5`);
      setNotes(response.data.data);
      setPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.pages);
    } catch (err) { setError(err.response?.data?.message || 'Failed to load notes.'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchNotes(page); }, [page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    try {
      await api.post('/notes', { title: newTitle, content: newContent });
      setNewTitle(''); setNewContent('');
      if (page !== 1) setPage(1); else fetchNotes(1); 
    } catch (err) { setError(err.response?.data?.message || 'Failed to create'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      if (notes.length === 1 && page > 1) setPage(page - 1); else fetchNotes(page);
    } catch (err) { setError(err.response?.data?.message || 'Failed to delete'); }
  };

  const startEdit = (note) => { setEditingId(note._id); setEditTitle(note.title); setEditContent(note.content); };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/notes/${id}`, { title: editTitle, content: editContent });
      setEditingId(null); fetchNotes(page);
    } catch (err) { setError(err.response?.data?.message || 'Failed to update'); }
  };

  return (
    <div className="container">
      <h1>My Notes</h1>
      {error && <div className="error">{error}</div>}
      <div className="card">
        <h3>Add a New Note</h3>
        <form onSubmit={handleCreate}>
          <input type="text" placeholder="Note Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
          <textarea placeholder="Write your note here..." value={newContent} onChange={(e) => setNewContent(e.target.value)} rows="3" required />
          <button type="submit">Save Note</button>
        </form>
      </div>
      {loading ? <p>Loading...</p> : notes.length === 0 ? <p>No notes found.</p> : notes.map((note) => (
        <div className="card" key={note._id}>
          {editingId === note._id ? (
            <div>
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows="3" />
              <div className="row">
                <button onClick={() => handleUpdate(note._id)}>Save Changes</button>
                <button className="secondary" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <h3>{note.title}</h3>
              <p style={{ whiteSpace: 'pre-wrap', marginBottom: '15px' }}>{note.content}</p>
              <div className="row">
                <button className="secondary" onClick={() => startEdit(note)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(note._id)}>Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}