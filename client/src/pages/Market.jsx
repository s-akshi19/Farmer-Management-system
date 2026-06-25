import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Plus, Trash2, IndianRupee, Search, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';
import { marketService } from '../services/api';
import { Loader } from '../components/common/index.jsx';

const cropEmoji = { Wheat: '🌾', Rice: '🍚', Sugarcane: '🎋', Mustard: '🌻', Potato: '🥔', Onion: '🧅', Tomato: '🍅', Cotton: '☁️', Soybean: '🫘', Maize: '🌽', Groundnut: '🥜', 'Gram (Chana)': '🫘' };

export default function Market() {
  const [livePrices, setLivePrices] = useState([]);
  const [savedPrices, setSavedPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchCrop, setSearchCrop] = useState('');
  const [form, setForm] = useState({ cropName: '', pricePerQuintal: '', minimumPrice: '', maximumPrice: '', market: '', state: 'Uttar Pradesh' });

  const load = async () => {
    try {
      const d = await marketService.getPrices();
      setLivePrices(d.livePrices);
      setSavedPrices(d.savedPrices);
    } catch { toast.error('Failed to load market data'); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  const handleRefresh = () => { setRefreshing(true); load(); toast.success('Prices refreshed!'); };

  const handleAdd = async e => {
    e.preventDefault();
    try { await marketService.addPrice(form); toast.success('Price added!'); setShowForm(false); setForm({ cropName: '', pricePerQuintal: '', minimumPrice: '', maximumPrice: '', market: '', state: 'Uttar Pradesh' }); load(); }
    catch { toast.error('Failed to add'); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this price record?')) return;
    try { await marketService.deletePrice(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  const filtered = livePrices.filter(p => p.cropName.toLowerCase().includes(searchCrop.toLowerCase()));

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 via-yellow-400 to-amber-500 px-8 py-8 text-white shadow-xl">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 right-32 h-24 w-24 rounded-full bg-white/10" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Market Prices</h1>
            <p className="mt-1 text-yellow-100">Live mandi rates for {livePrices.length} major crops across India</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleRefresh} disabled={refreshing} className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition">
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={() => setShowForm(v => !v)} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-yellow-700 hover:bg-yellow-50 transition">
              <Plus size={15} /> Add Price
            </button>
          </div>
        </div>
      </div>

      {/* Add Price Form */}
      {showForm && (
        <div className="card p-6">
          <h3 className="mb-5 font-bold text-gray-900">Add Market Price</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div><label className="mb-1 block text-xs font-medium text-gray-600">Crop Name *</label><input required value={form.cropName} onChange={e => setForm({ ...form, cropName: e.target.value })} className="input-field" placeholder="Wheat" /></div>
            <div><label className="mb-1 block text-xs font-medium text-gray-600">Price/Quintal (₹) *</label><input required type="number" value={form.pricePerQuintal} onChange={e => setForm({ ...form, pricePerQuintal: e.target.value })} className="input-field" /></div>
            <div><label className="mb-1 block text-xs font-medium text-gray-600">Min Price</label><input type="number" value={form.minimumPrice} onChange={e => setForm({ ...form, minimumPrice: e.target.value })} className="input-field" /></div>
            <div><label className="mb-1 block text-xs font-medium text-gray-600">Max Price</label><input type="number" value={form.maximumPrice} onChange={e => setForm({ ...form, maximumPrice: e.target.value })} className="input-field" /></div>
            <div><label className="mb-1 block text-xs font-medium text-gray-600">Mandi Name</label><input value={form.market} onChange={e => setForm({ ...form, market: e.target.value })} className="input-field" placeholder="Hapur Mandi" /></div>
            <div><label className="mb-1 block text-xs font-medium text-gray-600">State</label><input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="input-field" /></div>
            <div className="col-span-full flex gap-2 pt-2"><button type="submit" className="btn-primary">Save Price</button><button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button></div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input value={searchCrop} onChange={e => setSearchCrop(e.target.value)} placeholder="Search crop..." className="input-field !pl-9" />
      </div>

      {/* Live Price Cards */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <h2 className="font-bold text-gray-900">Live Mandi Rates</h2>
          <span className="text-xs text-gray-400">Updates every refresh</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => {
            const up = Math.random() > 0.5;
            const change = Math.floor(Math.random() * 80) + 10;
            return (
              <div key={i} className="card p-5 hover:-translate-y-1 transition hover:shadow-md">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cropEmoji[p.cropName] || '🌿'}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{p.cropName}</h3>
                      <p className="text-xs text-gray-400">{p.market}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {up ? '+' : '-'}{change}
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-gray-500 text-sm">₹</span>
                  <span className="text-2xl font-extrabold text-gray-900">{p.pricePerQuintal?.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">/qtl</span>
                </div>

                <div className="mt-3 flex justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                  <span>Min: <strong>₹{p.minimumPrice?.toLocaleString()}</strong></span>
                  <span>Max: <strong>₹{p.maximumPrice?.toLocaleString()}</strong></span>
                </div>
                <p className="mt-2 text-xs text-gray-400">{p.state}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manually Added Prices */}
      {savedPrices.length > 0 && (
        <div className="card overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-bold text-gray-900">Manually Added Prices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>{['Crop', 'Price/Quintal', 'Min', 'Max', 'Mandi', 'State', ''].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {savedPrices.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-semibold text-gray-900 flex items-center gap-2"><span>{cropEmoji[p.cropName] || '🌿'}</span>{p.cropName}</td>
                    <td className="px-5 py-3 font-bold text-gray-900">₹{p.pricePerQuintal?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-gray-500">{p.minimumPrice ? `₹${p.minimumPrice}` : '—'}</td>
                    <td className="px-5 py-3 text-gray-500">{p.maximumPrice ? `₹${p.maximumPrice}` : '—'}</td>
                    <td className="px-5 py-3 text-gray-500">{p.market || '—'}</td>
                    <td className="px-5 py-3 text-gray-500">{p.state}</td>
                    <td className="px-5 py-3"><button onClick={() => handleDelete(p._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition"><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
