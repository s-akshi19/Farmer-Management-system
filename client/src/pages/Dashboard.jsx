import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Sprout, MapPin, TrendingUp, UserCheck, UserX, Plus, ArrowRight, Wheat, CloudSun, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid } from 'recharts';
import { farmerService, marketService } from '../services/api';
import { Loader, Badge } from '../components/common/index.jsx';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const monthlyData = [
  { month: 'Jan', farmers: 12 }, { month: 'Feb', farmers: 18 },
  { month: 'Mar', farmers: 25 }, { month: 'Apr', farmers: 31 },
  { month: 'May', farmers: 40 }, { month: 'Jun', farmers: 55 },
  { month: 'Jul', farmers: 68 }, { month: 'Aug', farmers: 75 },
  { month: 'Sep', farmers: 82 }, { month: 'Oct', farmers: 88 },
  { month: 'Nov', farmers: 95 }, { month: 'Dec', farmers: 100 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentFarmers, setRecentFarmers] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      farmerService.getStats(),
      farmerService.getAll({ limit: 5, page: 1 }),
      marketService.getPrices(),
    ]).then(([statsData, farmersData, marketData]) => {
      setStats(statsData.stats);
      setRecentFarmers(farmersData.farmers);
      setMarketPrices(marketData.livePrices?.slice(0, 4) || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;
  if (!stats) return null;

  const statCards = [
    { label: 'Total Farmers', value: stats.totalFarmers, icon: Users, color: 'text-blue-600', bg: 'from-blue-500 to-blue-600', light: 'bg-blue-50' },
    { label: 'Active Farmers', value: stats.activeFarmers, icon: UserCheck, color: 'text-emerald-600', bg: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50' },
    { label: 'Inactive', value: stats.inactiveFarmers, icon: UserX, color: 'text-red-600', bg: 'from-red-500 to-red-600', light: 'bg-red-50' },
    { label: 'Land Parcels', value: stats.totalLandParcels, icon: MapPin, color: 'text-purple-600', bg: 'from-purple-500 to-purple-600', light: 'bg-purple-50' },
    { label: 'Total Acres', value: `${stats.totalAcres?.toFixed(0)}`, icon: Sprout, color: 'text-yellow-600', bg: 'from-yellow-500 to-yellow-600', light: 'bg-yellow-50' },
    { label: 'Crop Records', value: stats.totalCrops, icon: TrendingUp, color: 'text-primary-600', bg: 'from-primary-500 to-primary-600', light: 'bg-primary-50' },
  ];

  const cropStatusData = stats.cropsByStatus?.map(c => ({ name: c._id, value: c.count })) || [];
  const districtData = stats.topDistricts?.map(d => ({ name: d._id, farmers: d.count })) || [];

  return (
    <div className="space-y-8 pb-10">

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-emerald-500 px-8 py-10 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 right-20 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute bottom-4 right-48 h-20 w-20 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-primary-100 text-sm font-medium">Welcome back,</p>
            <h1 className="mt-1 text-3xl font-extrabold">{user?.name} 👋</h1>
            <p className="mt-2 max-w-md text-primary-100">
              Managing <span className="font-bold text-white">{stats.totalFarmers} farmers</span> across{' '}
              <span className="font-bold text-white">{stats.totalAcres?.toFixed(0)} acres</span> of agricultural land.
            </p>
            <div className="mt-5 flex gap-3">
              <Link to="/farmers/add" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-primary-700 shadow hover:bg-primary-50 transition">
                <Plus size={16} /> Add Farmer
              </Link>
              <Link to="/farmers" className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition">
                View All <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex gap-4">
            <div className="rounded-xl bg-white/10 p-5 text-center backdrop-blur">
              <p className="text-3xl font-extrabold">{stats.activeFarmers}</p>
              <p className="text-xs text-primary-100 mt-1">Active Farmers</p>
            </div>
            <div className="rounded-xl bg-white/10 p-5 text-center backdrop-blur">
              <p className="text-3xl font-extrabold">{stats.totalLandParcels}</p>
              <p className="text-xs text-primary-100 mt-1">Land Parcels</p>
            </div>
            <div className="rounded-xl bg-white/10 p-5 text-center backdrop-blur">
              <p className="text-3xl font-extrabold">{stats.totalCrops}</p>
              <p className="text-xs text-primary-100 mt-1">Crop Records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map(({ label, value, icon: Icon, color, bg, light }) => (
          <div key={label} className="card p-5 hover:-translate-y-1 transition">
            <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${light}`}>
              <Icon size={22} className={color} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{value}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Growth Chart - spans 2 cols */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900">Farmer Registration Growth</h2>
              <p className="text-xs text-gray-500 mt-0.5">Cumulative farmer records this year</p>
            </div>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">2026</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorFarmers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="farmers" stroke="#16a34a" strokeWidth={2.5} fill="url(#colorFarmers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Crop Status Pie */}
        <div className="card p-6">
          <div className="mb-4">
            <h2 className="font-bold text-gray-900">Crop Status</h2>
            <p className="text-xs text-gray-500 mt-0.5">Current season distribution</p>
          </div>
          {cropStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={cropStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {cropStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-gray-400">No crop data yet</p>
          )}
        </div>
      </div>

      {/* District Chart + Market Prices */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4">
            <h2 className="font-bold text-gray-900">Top Districts</h2>
            <p className="text-xs text-gray-500 mt-0.5">Farmers per district</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={districtData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="farmers" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live Market Preview */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-900">Live Market Rates</h2>
              <p className="text-xs text-gray-500 mt-0.5">Today's mandi prices</p>
            </div>
            <Link to="/market" className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1">View All <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {marketPrices.map((p, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100">
                    <Sprout size={16} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{p.cropName}</p>
                    <p className="text-xs text-gray-400">{p.market}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">₹{p.pricePerQuintal?.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">/quintal</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Farmers Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-gray-900">Recently Added Farmers</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest farmer registrations</p>
          </div>
          <Link to="/farmers" className="btn-secondary !py-1.5 !px-3 text-xs">View All Farmers</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase">Farmer</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase">Land</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentFarmers.map(f => (
                <tr key={f._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-sm">{f.name[0]}</div>
                      <div>
                        <p className="font-semibold text-gray-900">{f.name}</p>
                        <p className="text-xs text-gray-400">{f.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-gray-400">{f.farmerId}</td>
                  <td className="py-3 pr-4 text-gray-600 text-xs">{f.village}, {f.district}</td>
                  <td className="py-3 pr-4 text-gray-700">{f.totalLandAcres?.toFixed(1)} ac</td>
                  <td className="py-3 pr-4">
                    <Badge color={f.status === 'active' ? 'green' : 'red'}>{f.status}</Badge>
                  </td>
                  <td className="py-3">
                    <Link to={`/farmers/${f._id}`} className="text-xs font-semibold text-primary-600 hover:underline">View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link to="/farmers" className="group card p-6 flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-100 transition">
            <Users size={26} className="text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">View Farmers</p>
            <p className="text-sm text-gray-500">Browse all {stats.totalFarmers} records</p>
          </div>
          <ArrowRight size={18} className="ml-auto text-gray-300 group-hover:text-blue-500 transition" />
        </Link>
        <Link to="/farmers/add" className="group card p-6 flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 group-hover:bg-primary-100 transition">
            <Plus size={26} className="text-primary-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Add Farmer</p>
            <p className="text-sm text-gray-500">Register a new farmer</p>
          </div>
          <ArrowRight size={18} className="ml-auto text-gray-300 group-hover:text-primary-500 transition" />
        </Link>
        <Link to="/market" className="group card p-6 flex items-center gap-4 transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-50 group-hover:bg-yellow-100 transition">
            <TrendingUp size={26} className="text-yellow-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Market Prices</p>
            <p className="text-sm text-gray-500">Live mandi rates</p>
          </div>
          <ArrowRight size={18} className="ml-auto text-gray-300 group-hover:text-yellow-500 transition" />
        </Link>
      </div>

    </div>
  );
}
