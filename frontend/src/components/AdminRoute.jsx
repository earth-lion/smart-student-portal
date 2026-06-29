import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Only allows users with role === 'admin'
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}
