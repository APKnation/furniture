import { useState, useEffect } from 'react';
import { Plus, Pencil, X, Trash2 } from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../services/api';
import { showError, showSuccess, confirmAction } from '../../utils/swal';


export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name:'' });
  const [saving, setSaving] = useState(false);

  const fetch = () => getCategories().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal.mode==='add') await addCategory(form);
      else await updateCategory(modal.id, form);
      showSuccess('Success', modal.mode==='add'?'Category added!':'Category updated!');
      setModal(null); fetch();
    } catch (err) { showError('Save failed', err.response?.data?.message || 'Failed to save category'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (await confirmAction('Delete Category?', 'Are you sure you want to delete this category?', 'Yes, delete it', true)) {
      try {
        await deleteCategory(id);
        showSuccess('Deleted', 'Category has been deleted.');
        fetch();
      } catch (err) {
        showError('Delete failed', err.response?.data?.message || 'Cannot delete this category.');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-white">Categories</h1><p className="text-gray-400 text-sm mt-0.5">{items.length} categories</p></div>
        <button onClick={() => { setForm({ name:'' }); setModal({ mode:'add' }); }} className="btn-primary btn-sm"><Plus size={16}/> Add Category</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-dark-600 bg-dark-700/50">
            <th className="text-left px-5 py-3.5 text-gray-400 font-medium">#</th>
            <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Name</th>
            <th className="text-right px-5 py-3.5 text-gray-400 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {loading ? [...Array(3)].map((_, i) => <tr key={i}><td colSpan={3} className="px-5 py-4"><div className="h-4 bg-dark-700 rounded animate-pulse"/></td></tr>)
            : items.map((item, i) => (
              <tr key={item.id} className="border-b border-dark-600/50 table-row-hover">
                <td className="px-5 py-4 text-gray-500">{i+1}</td>
                <td className="px-5 py-4 font-medium text-white">{item.name}</td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => { setForm({ name: item.name }); setModal({ mode:'edit', id: item.id }); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-900/40 text-primary-400 hover:bg-primary-900/70 text-xs font-medium transition-all mr-2">
                    <Pencil size={12}/> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 text-xs font-medium transition-all">
                    <Trash2 size={12}/> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-sm p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">{modal.mode==='add'?'Add Category':'Edit Category'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white"><X size={18}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="label">Category Name *</label><input required value={form.name} onChange={e=>setForm({name:e.target.value})} className="input" placeholder="e.g. Living Room"/></div>
              <div className="flex gap-3"><button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button><button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">{saving?<span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/>:'Save'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
