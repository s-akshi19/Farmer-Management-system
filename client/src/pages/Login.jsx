import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-green-100 px-4">
      <div className="card w-full max-w-md p-8">
        <div className="flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
            <Sprout size={28} />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Farmer Management System</h1>
          <p className="mt-1 text-sm text-gray-500">Login to manage farmer records</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="admin@demo.com" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-primary-50 p-4 text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-primary-700">Demo Credentials:</p>
          <p>Admin: <strong>admin@demo.com</strong> / <strong>password123</strong></p>
          <p>Officer: <strong>officer@demo.com</strong> / <strong>password123</strong></p>
          <p className="text-gray-400 mt-1">Run <code className="bg-gray-200 px-1 rounded">npm run seed</code> in server folder first</p>
        </div>
      </div>
    </div>
  );
}
