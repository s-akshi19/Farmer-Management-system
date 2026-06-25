import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Loader({ fullScreen = false }) {
  return (
    <div className={fullScreen ? 'flex min-h-[60vh] items-center justify-center' : 'flex items-center justify-center py-10'}>
      <Loader2 className="animate-spin text-primary-600" size={32} />
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function Badge({ children, color = 'gray' }) {
  const colors = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    gray: 'bg-gray-100 text-gray-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[color]}`}>{children}</span>;
}
