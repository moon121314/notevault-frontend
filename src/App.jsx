import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import AdminUsers from './pages/AdminUsers';
import AdminNotes from './pages/AdminNotes';
import Interests from './pages/Interests';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/notes" replace />} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/interests" element={<ProtectedRoute><Interests /></ProtectedRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/notes" element={<AdminRoute><AdminNotes /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/notes" replace />} />
      </Routes>
    </>
  );
}