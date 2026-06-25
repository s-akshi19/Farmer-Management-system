import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { farmerService } from '../services/api';
import { Loader } from '../components/common/index.jsx';

const empty = { name: '', phone: '', email: '', village: '', district: '', state: 'Uttar Pradesh', aadhaarNumber: '', status: 'active' };

export default function FarmerForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    farmerService.getOne(id).then(d => { const f = d.farmer; setForm({ name: f.name, phone: f.phone, email: f.email || '', village: f.village, district: f.district, state: f.state, aadhaarNumber: f.aadhaarNumber || '', status: f.status }); setLoading(false); });
  }, [id, isEdit]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) { await farmerService.update(id, form); toast.success('Farmer updated!'); navigate(`/farmers/${id}`); }
      else { const d = await farmerService.create(form); toast.success('Farmer added!'); navigate(`/farmers/${d.farmer._id}`); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  if (loading) return <Loader fullScreen />;

  const fields = [
    { name: 'name', label: 'Full Name *', type: 'text', required: true, placeholder: 'Ramesh Kumar Singh' },
    { name: 'phone', label: 'Phone Number *', type: 'tel', required: true, placeholder: '9876543210' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'farmer@example.com' },
    { name: 'village', label: 'Village *', type: 'text', required: true, placeholder: 'Rampur' },
    { name: 'district', label: 'District *', type: 'text', required: true, placeholder: 'Ghaziabad' },
    { name: 'state', label: 'State *', type: 'text', required: true, placeholder: 'Uttar Pradesh' },
    { name: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text', placeholder: 'XXXX XXXX XXXX' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"><ArrowLeft size={16} /> Back</button>
      <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Farmer' : 'Add New Farmer'}</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {fields.map(f => (
            <div key={f.name}>
              <label className="mb-1 block text-sm font-medium text-gray-700">{f.label}</label>
              <input name={f.name} type={f.type} required={f.required} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} className="input-field" />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input-field">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : isEdit ? 'Update Farmer' : 'Add Farmer'}</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
