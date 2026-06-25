import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Pencil, Plus, Trash2, Sprout, Map } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { farmerService } from '../services/api';
import { Loader, Badge } from '../components/common/index.jsx';

const cropStatusColor = { Sowing: 'blue', Growing: 'green', Harvested: 'gray', Failed: 'red' };
const soilColor = { Alluvial: 'yellow', Black: 'gray', Red: 'red', Laterite: 'purple', Arid: 'yellow', Forest: 'green' };

export default function FarmerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLandForm, setShowLandForm] = useState(false);
  const [showCropForm, setShowCropForm] = useState(false);
  const [landForm, setLandForm] = useState({ khasraNumber: '', areaAcres: '', soilType: 'Alluvial', irrigationType: 'Rainfed', ownershipType: 'Owned' });
  const [cropForm, setCropForm] = useState({ cropName: '', cropType: 'Rabi', variety: '', sowingDate: '', expectedHarvestDate: '', areaAcres: '', expectedYieldKg: '', status: 'Sowing' });

  const load = () => {
    setLoading(true);
    farmerService.getOne(id).then(setData).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [id]);

  const addLand = async e => {
    e.preventDefault();
    try { await farmerService.addLand(id, landForm); toast.success('Land added!'); setShowLandForm(false); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const addCrop = async e => {
    e.preventDefault();
    try { await farmerService.addCrop(id, cropForm); toast.success('Crop added!'); setShowCropForm(false); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteLand = async (lid) => {
    if (!window.confirm('Delete this land record?')) return;
    try { await farmerService.deleteLand(lid); toast.success('Land deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  const deleteCrop = async (cid) => {
    if (!window.confirm('Delete this crop record?')) return;
    try { await farmerService.deleteCrop(cid); toast.success('Crop deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  if (loading) return <Loader fullScreen />;
  if (!data) return null;
  const { farmer, lands, crops } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"><ArrowLeft size={16} /> Back</button>
        <Link to={`/farmers/${id}/edit`} className="btn-secondary"><Pencil size={15} /> Edit</Link>
      </div>

      {/* Farmer Info Card */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-lg">{farmer.name[0]}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{farmer.name}</h1>
                <p className="text-sm font-mono text-gray-400">{farmer.farmerId}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Phone size={14} />{farmer.phone}</span>
              <span className="flex items-center gap-1"><MapPin size={14} />{farmer.village}, {farmer.district}, {farmer.state}</span>
            </div>
            {farmer.aadhaarNumber && <p className="mt-2 text-sm text-gray-500">Aadhaar: {farmer.aadhaarNumber}</p>}
          </div>
          <div className="text-right space-y-1">
            <Badge color={farmer.status === 'active' ? 'green' : 'red'}>{farmer.status}</Badge>
            <p className="text-sm text-gray-500">{farmer.totalLandAcres?.toFixed(1)} total acres</p>
            <p className="text-xs text-gray-400">Added {format(new Date(farmer.createdAt), 'PP')}</p>
          </div>
        </div>
      </div>

      {/* Land Records */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 font-bold text-gray-900"><Map size={18} className="text-primary-600" /> Land Records ({lands.length})</h2>
          <button onClick={() => setShowLandForm(v => !v)} className="btn-primary !py-1.5 text-xs"><Plus size={14} /> Add Land</button>
        </div>

        {showLandForm && (
          <form onSubmit={addLand} className="mb-4 rounded-lg bg-green-50 p-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div><label className="text-xs font-medium text-gray-600">Khasra No *</label><input required value={landForm.khasraNumber} onChange={e => setLandForm({ ...landForm, khasraNumber: e.target.value })} className="input-field mt-1" placeholder="KH-1234" /></div>
            <div><label className="text-xs font-medium text-gray-600">Area (Acres) *</label><input required type="number" min="0" step="0.1" value={landForm.areaAcres} onChange={e => setLandForm({ ...landForm, areaAcres: e.target.value })} className="input-field mt-1" /></div>
            <div><label className="text-xs font-medium text-gray-600">Soil Type</label><select value={landForm.soilType} onChange={e => setLandForm({ ...landForm, soilType: e.target.value })} className="input-field mt-1">{['Alluvial','Black','Red','Laterite','Arid','Forest','Other'].map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label className="text-xs font-medium text-gray-600">Irrigation</label><select value={landForm.irrigationType} onChange={e => setLandForm({ ...landForm, irrigationType: e.target.value })} className="input-field mt-1">{['Canal','Borewell','Rainfed','Drip','Sprinkler','Other'].map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label className="text-xs font-medium text-gray-600">Ownership</label><select value={landForm.ownershipType} onChange={e => setLandForm({ ...landForm, ownershipType: e.target.value })} className="input-field mt-1">{['Owned','Leased','Shared'].map(s => <option key={s}>{s}</option>)}</select></div>
            <div className="flex items-end gap-2"><button type="submit" className="btn-primary text-xs">Save</button><button type="button" onClick={() => setShowLandForm(false)} className="btn-secondary text-xs">Cancel</button></div>
          </form>
        )}

        {lands.length === 0 ? <p className="text-center text-gray-400 py-6">No land records yet</p> : (
          <div className="overflow-x-auto"><table className="min-w-full text-sm divide-y divide-gray-100">
            <thead className="bg-gray-50"><tr>{['Khasra No','Area','Soil','Irrigation','Ownership',''].map(h => <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">{lands.map(l => (
              <tr key={l._id}>
                <td className="px-3 py-2 font-mono text-xs">{l.khasraNumber}</td>
                <td className="px-3 py-2">{l.areaAcres} ac</td>
                <td className="px-3 py-2"><Badge color={soilColor[l.soilType] || 'gray'}>{l.soilType}</Badge></td>
                <td className="px-3 py-2 text-gray-600">{l.irrigationType}</td>
                <td className="px-3 py-2 text-gray-600">{l.ownershipType}</td>
                <td className="px-3 py-2"><button onClick={() => deleteLand(l._id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>

      {/* Crop Records */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 font-bold text-gray-900"><Sprout size={18} className="text-primary-600" /> Crop Records ({crops.length})</h2>
          <button onClick={() => setShowCropForm(v => !v)} className="btn-primary !py-1.5 text-xs"><Plus size={14} /> Add Crop</button>
        </div>

        {showCropForm && (
          <form onSubmit={addCrop} className="mb-4 rounded-lg bg-green-50 p-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div><label className="text-xs font-medium text-gray-600">Crop Name *</label><input required value={cropForm.cropName} onChange={e => setCropForm({ ...cropForm, cropName: e.target.value })} className="input-field mt-1" placeholder="Wheat" /></div>
            <div><label className="text-xs font-medium text-gray-600">Type *</label><select value={cropForm.cropType} onChange={e => setCropForm({ ...cropForm, cropType: e.target.value })} className="input-field mt-1">{['Kharif','Rabi','Zaid','Perennial'].map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label className="text-xs font-medium text-gray-600">Variety</label><input value={cropForm.variety} onChange={e => setCropForm({ ...cropForm, variety: e.target.value })} className="input-field mt-1" placeholder="HD-2967" /></div>
            <div><label className="text-xs font-medium text-gray-600">Sowing Date</label><input type="date" value={cropForm.sowingDate} onChange={e => setCropForm({ ...cropForm, sowingDate: e.target.value })} className="input-field mt-1" /></div>
            <div><label className="text-xs font-medium text-gray-600">Expected Harvest</label><input type="date" value={cropForm.expectedHarvestDate} onChange={e => setCropForm({ ...cropForm, expectedHarvestDate: e.target.value })} className="input-field mt-1" /></div>
            <div><label className="text-xs font-medium text-gray-600">Area (Acres)</label><input type="number" min="0" step="0.1" value={cropForm.areaAcres} onChange={e => setCropForm({ ...cropForm, areaAcres: e.target.value })} className="input-field mt-1" /></div>
            <div><label className="text-xs font-medium text-gray-600">Expected Yield (Kg)</label><input type="number" min="0" value={cropForm.expectedYieldKg} onChange={e => setCropForm({ ...cropForm, expectedYieldKg: e.target.value })} className="input-field mt-1" /></div>
            <div><label className="text-xs font-medium text-gray-600">Status</label><select value={cropForm.status} onChange={e => setCropForm({ ...cropForm, status: e.target.value })} className="input-field mt-1">{['Sowing','Growing','Harvested','Failed'].map(s => <option key={s}>{s}</option>)}</select></div>
            <div className="flex items-end gap-2"><button type="submit" className="btn-primary text-xs">Save</button><button type="button" onClick={() => setShowCropForm(false)} className="btn-secondary text-xs">Cancel</button></div>
          </form>
        )}

        {crops.length === 0 ? <p className="text-center text-gray-400 py-6">No crop records yet</p> : (
          <div className="overflow-x-auto"><table className="min-w-full text-sm divide-y divide-gray-100">
            <thead className="bg-gray-50"><tr>{['Crop','Type','Sowing','Expected Harvest','Area','Yield (Kg)','Status',''].map(h => <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">{crops.map(c => (
              <tr key={c._id}>
                <td className="px-3 py-2 font-medium">{c.cropName}{c.variety && <span className="text-gray-400 text-xs ml-1">({c.variety})</span>}</td>
                <td className="px-3 py-2 text-gray-600">{c.cropType}</td>
                <td className="px-3 py-2 text-gray-500 text-xs">{c.sowingDate ? format(new Date(c.sowingDate), 'PP') : '—'}</td>
                <td className="px-3 py-2 text-gray-500 text-xs">{c.expectedHarvestDate ? format(new Date(c.expectedHarvestDate), 'PP') : '—'}</td>
                <td className="px-3 py-2">{c.areaAcres || '—'} ac</td>
                <td className="px-3 py-2">{c.actualYieldKg || c.expectedYieldKg || '—'}</td>
                <td className="px-3 py-2"><Badge color={cropStatusColor[c.status]}>{c.status}</Badge></td>
                <td className="px-3 py-2"><button onClick={() => deleteCrop(c._id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}
