import { useState, useEffect } from 'react';
import { Plus, Pencil, X, Check, AlertCircle } from 'lucide-react';
import { getBrands, addBrand, updateBrand } from '../../services/api';

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // {mode:'add'|'edit', data}
  const [form, setForm] = useState({ name:'', description:'' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text:'', type:'' });

  const fetch = () => getBrands().then(r => setBrands(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const notify = (text, type='success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text:'', type:'' }), 3000); };

  const openAdd = () => { setForm({ name:'', description:'' }); setModal({ mode:'add' }); };
  const openEdit = (b) => { setForm({ name: b.name, description: b.description||'' }); setModal({ mode:'edit', id: b.id }); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal.mode === 'add') await addBrand(form);
      else await updateBrand(modal.id, form);
      notify(modal.mode === 'add' ? 'Brand added!' : 'Brand updated!');
      setModal(null); fetch();
    } catch (err) { notify(err.response?.data?.message || 'Save failed', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-white">Brands</h1><p className="text-gray-400 text-sm mt-0.5">{brands.length} brands</p></div>
        <button onClick={openAdd} className="btn-primary btn-sm"><Plus size={16}/> Add Brand</button>
      </div>

      {msg.text && <div className={`flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-sm ${msg.type==='success'?'bg-green-900/30 border border-green-800/50 text-green-300':'bg-red-900/30 border border-red-800/50 text-red-300'}`}>{msg.type==='success'?<Check size={14}/>:<AlertCircle size={14}/>}{msg.text}</div>}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-dark-600 bg-dark-700/50">
            <th className="text-left px-5 py-3.5 text-gray-400 font-medium">#</th>
            <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Name</th>
            <th className="text-left px-5 py-3.5 text-gray-400 font-medium hidden md:table-cell">Description</th>
            <th className="text-right px-5 py-3.5 text-gray-400 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {loading ? (
              [...Array(4)].map((_, i) => <tr key={i}><td colSpan={4} className="px-5 py-4"><div className="h-4 bg-dark-700 rounded animate-pulse"/></td></tr>)
            ) : brands.map((b, i) => (
              <tr key={b.id} className="border-b border-dark-600/50 table-row-hover">
                <td className="px-5 py-4 text-gray-500">{i+1}</td>
                <td className="px-5 py-4 font-medium text-white">{b.name}</td>
                <td className="px-5 py-4 text-gray-400 hidden md:table-cell">{b.description || '—'}</td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => openEdit(b)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-900/40 text-primary-400 hover:bg-primary-900/70 text-xs font-medium transition-all">
                    <Pencil size={12}/> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white text-lg">{modal.mode==='add'?'Add Brand':'Edit Brand'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white"><X size={18}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="label">Brand Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input" placeholder="e.g. Ikea"/></div>
              <div><label className="label">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="input resize-none h-20" placeholder="Optional description"/></div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving?<span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/>:'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
