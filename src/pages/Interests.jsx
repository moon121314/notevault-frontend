import { useState, useEffect } from 'react';
import api from '../api/client';
import { Pagination } from '../components/Pagination';

export default function Interests() {
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsPage, setPostsPage] = useState(1);
  const [postsTotalPages, setPostsTotalPages] = useState(0);
  const [postsLoading, setPostsLoading] = useState(false);

  const fetchGroups = async (pageNumber) => {
    setLoading(true); setError('');
    try {
      const response = await api.get(`/admin/interests?page=${pageNumber}&limit=5`);
      setGroups(response.data.data);
      setPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.pages);
    } catch (err) { setError(err.response?.data?.message || 'Failed to load interests.'); } finally { setLoading(false); }
  };

  const fetchPosts = async (userId, pageNumber = 1) => {
    setPostsLoading(true);
    try {
      const response = await api.get(`/admin/users/${userId}/posts?page=${pageNumber}&limit=5`);
      setSelectedUser(response.data.data);
      setPosts(response.data.data.posts);
      setPostsPage(response.data.pagination.page);
      setPostsTotalPages(response.data.pagination.pages);
    } catch (err) { setError(err.response?.data?.message || 'Failed to load posts.'); } finally { setPostsLoading(false); }
  };

  useEffect(() => { fetchGroups(page); }, [page]);

  return (
    <div className="container">
      <h1>Aggregation Pipelines</h1>
      <div className="card" style={{ backgroundColor: '#f8fafc' }}>
        <h3>Task 1: Group Users by Interests</h3>
        <p style={{ fontSize: '14px', color: '#475569' }}>Generated using a single <code>aggregate()</code> call with <code>$unwind</code>, <code>$group</code>, and <code>$facet</code>.</p>
      </div>
      {error && <div className="error">{error}</div>}
      {loading ? <p>Loading...</p> : groups.length === 0 ? <p>No interests found. Add some via the Admin Users page.</p> : (
        groups.map((group) => (
          <div className="card" key={group._id}>
            <h3 style={{ textTransform: 'capitalize' }}>{group._id} <span style={{ color: '#64748b', fontSize: '14px' }}>({group.userCount} users)</span></h3>
            <ul style={{ paddingLeft: '20px' }}>
              {group.users.map((user) => (
                <li key={user.id} style={{ marginBottom: '10px' }}>
                  <strong>{user.name}</strong> ({user.email})
                  <button className="secondary" style={{ marginLeft: '15px', padding: '4px 8px', fontSize: '12px' }} onClick={() => fetchPosts(user.id, 1)}>View Posts ($lookup)</button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      
      {selectedUser && (
        <div style={{ marginTop: '40px' }}>
          <hr style={{ borderColor: '#cbd5e1', marginBottom: '30px' }} />
          <div className="card" style={{ backgroundColor: '#f8fafc' }}>
            <h3>Task 2: Posts by {selectedUser.name} ($lookup)</h3>
            <p style={{ fontSize: '14px', color: '#475569' }}>Generated using a pipeline with <code>$lookup</code> to join the <code>users</code> and <code>posts</code> collections.</p>
          </div>
          {postsLoading ? <p>Loading posts...</p> : posts.length === 0 ? <p>This user has not created any posts yet.</p> : (
            posts.map((post) => (
              <div className="card" key={post._id}>
                <h4>{post.title}</h4>
                <p>{post.body}</p>
                <small style={{ color: '#64748b' }}>Posted on: {new Date(post.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}
          <Pagination page={postsPage} totalPages={postsTotalPages} onPageChange={(newPage) => fetchPosts(selectedUser._id, newPage)} />
        </div>
      )}
    </div>
  );
}