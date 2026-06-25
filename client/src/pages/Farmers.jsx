import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Trash2, Phone, MapPin, Filter, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { farmerService } from '../services/api';
import { Loader, Badge } from '../components/common/index.jsx';

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = () => {
    setLoading(true);
    farmerService.getAll({ search, district, status, page, limit: 10 })
      .then(d => { setFarmers(d.farmers); setPages(d.pages); setTotal(d.total); })
      .catch(() => toast.error('Failed to load farmers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, district, status, page]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This will also delete their land and crop records.`)) return;
    try { await farmerService.delete(id); toast.success('Farmer deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farmer Records</h1>
          <p className="mt-1 text-gray-500">
            Showing <span className="font-semibold text-gray-700">{total}</span> total registered farmers
          </p>
        </div>
        <Link to="/farmers/add" className="btn-primary shadow-lg shadow-primary-200">
          <Plus size={16} /> Add New Farmer
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, village, district..."
              className="input-field !pl-9"
            />
          </div>
          <input
            value={district}
            onChange={e => { setDistrict(e.target.value); setPage(1); }}
            placeholder="Filter by district"
            className="input-field w-44"
          />
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="input-field w-36"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {(search || district || status) && (
            <button
              onClick={() => { setSearch(''); setDistrict(''); setStatus(''); setPage(1); }}
              className="text-sm text-red-500 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? <Loader /> : (
        <>
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <p className="text-sm text-gray-500">{farmers.length} records on this page</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Farmer', 'ID', 'Phone', 'Location', 'Land', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {farmers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Search size={32} className="opacity-30" />
                          <p className="font-medium">No farmers found</p>
                          <p className="text-xs">Try changing your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : farmers.map(f => (
                    <tr key={f._id} className="hover:bg-green-50/30 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-bold text-sm shadow-sm">
                            {f.name[0]}
                          </div>
                          <p className="font-semibold text-gray-900">{f.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-gray-400 bg-gray-50/50">{f.farmerId}</td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-gray-600"><Phone size={13} />{f.phone}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-gray-600"><MapPin size={13} />{f.village}, {f.district}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                          {f.totalLandAcres?.toFixed(1)} ac
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge color={f.status === 'active' ? 'green' : 'red'}>{f.status}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1">
                          <Link to={`/farmers/${f._id}`} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition" title="View"><Eye size={15} /></Link>
                          <Link to={`/farmers/${f._id}/edit`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition" title="Edit"><Pencil size={15} /></Link>
                          <button onClick={() => handleDelete(f._id, f.name)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition" title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary !px-3 !py-2 text-sm disabled:opacity-40">← Prev</button>
              {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`h-9 w-9 rounded-lg text-sm font-medium transition ${page === p ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn-secondary !px-3 !py-2 text-sm disabled:opacity-40">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
