import { useState, useEffect } from 'react';
import api from '../api/client';
import { Pagination } from '../components/Pagination';

export default function AdminNotes() {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllNotes = async (pageNumber) => {
    setLoading(true); setError('');
    try {
      const response = await api.get(`/admin/notes?page=${pageNumber}&limit=10`);
      setNotes(response.data.data);
      setPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.pages);
    } catch (err) { setError(err.response?.data?.message || 'Failed to load all notes.'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAllNotes(page); }, [page]);

  return (
    <div className="container">
      <h1>Admin – All Notes</h1>
      <p style={{ color: '#64748b', marginBottom: '20px' }}>Viewing all notes across all users.</p>
      {error && <div className="error">{error}</div>}
      {loading ? <p>Loading...</p> : notes.length === 0 ? <p>No notes found.</p> : (
        <table>
          <thead><tr><th>Title</th><th>Content</th><th>Owner</th><th>Created At</th></tr></thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note._id}>
                <td><strong>{note.title}</strong></td>
                <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>{note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content}</td>
                <td>
                  {note.owner ? (
                    <><div>{note.owner.name}</div><div style={{ fontSize: '12px', color: '#64748b' }}>{note.owner.email}</div></>
                  ) : 'Unknown User'}
                </td>
                <td>{new Date(note.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}