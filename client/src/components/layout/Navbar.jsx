import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, LayoutDashboard, Users, TrendingUp, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/farmers', icon: Users, label: 'Farmers' },
  { to: '/market', icon: TrendingUp, label: 'Market Prices' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-extrabold text-gray-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white"><Sprout size={18} /></span>
          <span>Farmer<span className="text-primary-600">MS</span></span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${location.pathname.startsWith(to) ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Icon size={16} />{label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user && <span className="text-sm text-gray-500">Hi, <span className="font-semibold text-gray-800">{user.name.split(' ')[0]}</span> <span className="ml-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 capitalize">{user.role}</span></span>}
          <button onClick={handleLogout} className="btn-secondary !px-3 !py-2"><LogOut size={16} /> Logout</button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(o => !o)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </nav>
      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden space-y-1">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"><Icon size={16} />{label}</Link>
          ))}
          <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"><LogOut size={16} /> Logout</button>
        </div>
      )}
    </header>
  );
}
